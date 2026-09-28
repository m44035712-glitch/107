import {
  AgentExecutionResponse,
  ConfidenceLevel,
  Evidence,
  IndianLanguage,
  QueryIntent,
  ToolName,
} from "@bis/shared-types";
import { CitationBuilder } from "../citations/citation-builder";
import { GroundingValidator } from "../grounding/grounding-validator";
import { ILLMProvider } from "../providers/llm.provider";
import { IndicLanguageEngine } from "../providers/translation.provider";
import { BIS_SYSTEM_PROMPT } from "../prompts/bis-prompts";
import { tool } from "@langchain/core/tools";
import { StateGraph, Annotation, END } from "@langchain/langgraph";
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { z } from "zod";

export interface BISAgentToolsHandler {
  executeTool(
    tool: ToolName,
    args: Record<string, unknown>,
  ): Promise<{ data: unknown; evidence: Evidence[] }>;
}

const AgentStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  evidence: Annotation<Evidence[]>({
    reducer: (x, y) => {
      const existingIds = new Set(x.map((e) => e.id));
      const filteredNew = y.filter((e) => !existingIds.has(e.id));
      return [...x, ...filteredNew];
    },
    default: () => [],
  }),
});

export class SentinelXAgent {
  private citationBuilder = new CitationBuilder();
  private groundingValidator = new GroundingValidator();
  private languageEngine = new IndicLanguageEngine();

  constructor(
    private llmProvider: ILLMProvider,
    private toolsHandler?: BISAgentToolsHandler,
  ) {}

  private getChatModel(): BaseChatModel | null {
    const provider = (process.env.LLM_PROVIDER || "").toLowerCase();
    if (provider === "deterministic") return null;

    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    const hasValidOpenRouter = openrouterKey && !openrouterKey.includes('your_openrouter_key') && openrouterKey.trim().length > 10;
    const hasValidAnthropic = anthropicKey && !anthropicKey.includes('your_anthropic_api_key_here') && anthropicKey.trim().length > 10;
    const hasValidOpenAI = openaiKey && !openaiKey.includes('your_openai_api_key_here') && openaiKey.trim().length > 10;

    if (provider === 'openrouter' || (hasValidOpenRouter && provider !== 'anthropic' && provider !== 'openai')) {
      if (!hasValidOpenRouter) return null;
      return new ChatOpenAI({
        modelName: process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free',
        openAIApiKey: openrouterKey,
        temperature: 0.5,
        configuration: {
          baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
          defaultHeaders: {
            'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
            'X-Title': process.env.OPENROUTER_SITE_NAME || 'SentinelX'
          }
        }
      }) as unknown as BaseChatModel;
    }

    if (provider === 'anthropic' || (hasValidAnthropic && provider !== 'openai')) {
      if (!hasValidAnthropic) return null;
      return new ChatAnthropic({
        modelName: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
        apiKey: anthropicKey,
        temperature: 0.5,
      }) as unknown as BaseChatModel;
    }

    if (provider === "openai" || hasValidOpenAI) {
      if (!hasValidOpenAI) return null;
      return new ChatOpenAI({
        modelName: process.env.OPENAI_MODEL || "gpt-4o-mini",
        openAIApiKey: openaiKey,
        temperature: 0.5,
      }) as unknown as BaseChatModel;
    }

    return null;
  }

  /**
   * Classify user query intent into one of the specialized BIS domains.
   */
  classifyIntent(query: string): QueryIntent {
    const q = query.toLowerCase();

    if (
      q.includes("hallmark") ||
      q.includes("huid") ||
      q.includes("gold purity") ||
      q.includes("silver purity") ||
      q.includes("22k") ||
      q.includes("916")
    ) {
      return QueryIntent.HALLMARKING_VERIFICATION;
    }
    if (
      q.includes("isi mark") ||
      q.includes("cml") ||
      q.includes("genuine isi") ||
      q.includes("fake") ||
      q.includes("consumer complaint")
    ) {
      return QueryIntent.CONSUMER_ISI_CHECK;
    }
    if (
      q.includes("clause") ||
      q.includes("explain clause") ||
      q.includes("clause 5") ||
      q.includes("clause 4")
    ) {
      return QueryIntent.CLAUSE_EXPLANATION;
    }
    if (
      q.includes("test") ||
      q.includes("sampling") ||
      q.includes("test method") ||
      q.includes("routine test")
    ) {
      return QueryIntent.TESTING_REQUIREMENTS;
    }
    if (
      q.includes("laboratory") ||
      q.includes("lab") ||
      q.includes("nabl") ||
      q.includes("where to test") ||
      q.includes("testing centre")
    ) {
      return QueryIntent.LABORATORY_LOOKUP;
    }
    if (
      q.includes("certif") ||
      q.includes("scheme") ||
      q.includes("licence") ||
      q.includes("license") ||
      q.includes("crs") ||
      q.includes("fmcs")
    ) {
      return QueryIntent.CERTIFICATION_GUIDANCE;
    }
    if (
      q.includes("roadmap") ||
      q.includes("process") ||
      q.includes("steps to comply")
    ) {
      return QueryIntent.COMPLIANCE_ROADMAP;
    }
    if (q.includes("compare") || q.includes("difference between")) {
      return QueryIntent.COMPARE_STANDARDS;
    }
    if (
      q.includes("standard") ||
      q.includes("manufacture") ||
      q.includes("which is") ||
      q.includes("applicable") ||
      q.includes("bottle") ||
      q.includes("cement") ||
      q.includes("cable") ||
      q.includes("battery")
    ) {
      return QueryIntent.FIND_STANDARD;
    }

    return QueryIntent.GENERAL_BIS_INFO;
  }

  /**
   * Multi-step Agent Execution using LangGraph StateGraph (when real model available)
   * or single-tool intent execution (when deterministic mode active).
   */
  async execute(
    query: string,
    preferredLanguage?: IndianLanguage,
  ): Promise<AgentExecutionResponse> {
    const detectedLang =
      preferredLanguage || (await this.languageEngine.detectLanguage(query));
    const { translatedText, preservedEntities } =
      await this.languageEngine.translateToEnglish(query, detectedLang);
    const intent = this.classifyIntent(translatedText);

    const model = this.getChatModel();

    // If real LLM model & tools handler available, execute LangGraph agent graph loop
    if (model && this.toolsHandler) {
      console.log(
        '\x1b[32m%s\x1b[0m',
        `[SentinelX Agent: MULTI-STEP LLM] Executing LangGraph agent loop with cloud model for query: "${query}"`
      );
      try {
        return await this.executeGraphAgent(
          query,
          translatedText,
          intent,
          model,
          detectedLang,
        );
      } catch (err) {
        console.warn(
          "[SentinelXAgent] LangGraph execution failed, falling back to deterministic intent handler:",
          err,
        );
      }
    } else {
      console.log(
        '\x1b[33m%s\x1b[0m',
        `[SentinelX Agent: DETERMINISTIC HANDLER] Executing single-tool fallback mode (no cloud LLM) for query: "${query}"`
      );
    }

    // Single-tool fallback path for deterministic mode
    let retrievedEvidence: Evidence[] = [];
    const workflowOffers: AgentExecutionResponse["workflowOffers"] = [];

    if (this.toolsHandler) {
      if (intent === QueryIntent.FIND_STANDARD) {
        const res = await this.toolsHandler.executeTool("recommend_standards", {
          query: translatedText,
          entities: preservedEntities,
        });
        retrievedEvidence = res.evidence;
        workflowOffers.push(
          {
            type: "FIND_TESTING",
            label: "View Testing Requirements",
            actionPayload: { query: translatedText },
          },
          {
            type: "FIND_LAB",
            label: "Find Recognized Laboratory",
            actionPayload: { query: translatedText },
          },
          {
            type: "VIEW_ROADMAP",
            label: "Check Certification Scheme",
            actionPayload: { query: translatedText },
          },
        );
      } else if (intent === QueryIntent.TESTING_REQUIREMENTS) {
        const res = await this.toolsHandler.executeTool(
          "get_testing_requirements",
          { query: translatedText },
        );
        retrievedEvidence = res.evidence;
        workflowOffers.push({
          type: "FIND_LAB",
          label: "Locate Testing Lab",
          actionPayload: { query: translatedText },
        });
      } else if (intent === QueryIntent.LABORATORY_LOOKUP) {
        const res = await this.toolsHandler.executeTool("search_laboratories", {
          query: translatedText,
        });
        retrievedEvidence = res.evidence;
      } else if (intent === QueryIntent.HALLMARKING_VERIFICATION) {
        const res = await this.toolsHandler.executeTool(
          "search_hallmarking_information",
          { query: translatedText },
        );
        retrievedEvidence = res.evidence;
      } else if (intent === QueryIntent.CONSUMER_ISI_CHECK) {
        const res = await this.toolsHandler.executeTool(
          "search_consumer_information",
          { query: translatedText },
        );
        retrievedEvidence = res.evidence;
      } else {
        const res = await this.toolsHandler.executeTool(
          "search_bis_documents",
          { query: translatedText },
        );
        retrievedEvidence = res.evidence;
      }
    }

    const llmResult = await this.llmProvider.generateText(
      translatedText,
      retrievedEvidence,
    );
    let finalAnswer = llmResult.text;

    // Translate back to original language if requested
    if (detectedLang !== IndianLanguage.EN) {
      finalAnswer = await this.languageEngine.translateFromEnglish(
        finalAnswer,
        detectedLang,
        preservedEntities,
      );
    }

    const citations = this.citationBuilder.buildCitations(retrievedEvidence);
    const suggestedFollowUps = this.generateSuggestedFollowups(
      intent,
      detectedLang,
    );

    return {
      query,
      intent,
      structuredAnswer: finalAnswer,
      citations,
      evidence: retrievedEvidence,
      suggestedFollowUps,
      workflowOffers,
    };
  }

  private async executeGraphAgent(
    originalQuery: string,
    translatedText: string,
    intent: QueryIntent,
    model: BaseChatModel,
    detectedLang: IndianLanguage,
  ): Promise<AgentExecutionResponse> {
    const handler = this.toolsHandler!;
    const collectedEvidence: Evidence[] = [];

    const evidenceCollector = (ev: Evidence[]) => {
      ev.forEach((e) => {
        if (!collectedEvidence.some((ex) => ex.id === e.id)) {
          collectedEvidence.push(e);
        }
      });
    };

    // Define tools wrapped with handler dispatch
    const tools = [
      tool(
        async (args) => {
          const res = await handler.executeTool("recommend_standards", args);
          if (res.evidence) evidenceCollector(res.evidence);
          return JSON.stringify(res.data);
        },
        {
          name: "recommend_standards",
          description:
            "Recommend applicable Indian Standards (IS) based on product description, material specs, or capacity.",
          schema: z.object({ query: z.string() }),
        },
      ),
      tool(
        async (args) => {
          const res = await handler.executeTool("search_standards", args);
          if (res.evidence) evidenceCollector(res.evidence);
          return JSON.stringify(res.data);
        },
        {
          name: "search_standards",
          description:
            "Search Indian Standards by standard number, title, or keywords.",
          schema: z.object({ query: z.string() }),
        },
      ),
      tool(
        async (args) => {
          const res = await handler.executeTool(
            "get_testing_requirements",
            args,
          );
          if (res.evidence) evidenceCollector(res.evidence);
          return JSON.stringify(res.data);
        },
        {
          name: "get_testing_requirements",
          description:
            "Get testing schedules, routine vs type test parameters, and sampling requirements for a standard or product.",
          schema: z.object({ query: z.string() }),
        },
      ),
      tool(
        async (args) => {
          const res = await handler.executeTool("search_laboratories", args);
          if (res.evidence) evidenceCollector(res.evidence);
          return JSON.stringify(res.data);
        },
        {
          name: "search_laboratories",
          description:
            "Find NABL accredited and BIS recognized laboratories authorized for standard testing.",
          schema: z.object({ query: z.string() }),
        },
      ),
      tool(
        async (args) => {
          const res = await handler.executeTool(
            "search_hallmarking_information",
            args,
          );
          if (res.evidence) evidenceCollector(res.evidence);
          return JSON.stringify(res.data);
        },
        {
          name: "search_hallmarking_information",
          description:
            "Search gold/silver purity grades (24K, 22K/916, 18K), HUID rules, and hallmarking guidelines.",
          schema: z.object({ query: z.string() }),
        },
      ),
      tool(
        async (args) => {
          const res = await handler.executeTool(
            "search_consumer_information",
            args,
          );
          if (res.evidence) evidenceCollector(res.evidence);
          return JSON.stringify(res.data);
        },
        {
          name: "search_consumer_information",
          description:
            "Verify CM/L licence numbers, check for fake ISI marks, and access consumer protection redressal.",
          schema: z.object({ query: z.string() }),
        },
      ),
      tool(
        async (args) => {
          const res = await handler.executeTool("search_bis_documents", args);
          if (res.evidence) evidenceCollector(res.evidence);
          return JSON.stringify(res.data);
        },
        {
          name: "search_bis_documents",
          description:
            "Search authoritative BIS document chunks for clause text and statutory requirements.",
          schema: z.object({ query: z.string() }),
        },
      ),
    ];

    const modelWithTools = (model as any).bindTools(tools);

    // Build LangGraph StateGraph
    const workflow = new StateGraph(AgentStateAnnotation)
      .addNode("agent", async (state) => {
        const response = await modelWithTools.invoke(state.messages);
        return { messages: [response] };
      })
      .addNode("tools", async (state) => {
        const lastMsg = state.messages[state.messages.length - 1] as any;
        const toolCalls = lastMsg.tool_calls || [];
        const toolMessages: ToolMessage[] = [];

        for (const tc of toolCalls) {
          const targetTool = tools.find((t) => t.name === tc.name);
          if (targetTool) {
            const toolResult = await targetTool.invoke(tc.args);
            toolMessages.push(
              new ToolMessage({
                content:
                  typeof toolResult === "string"
                    ? toolResult
                    : JSON.stringify(toolResult),
                tool_call_id: tc.id,
              }),
            );
          }
        }

        return { messages: toolMessages };
      })
      .addEdge("tools", "agent")
      .addConditionalEdges("agent", (state) => {
        const lastMsg = state.messages[state.messages.length - 1] as any;
        if (lastMsg?.tool_calls && lastMsg.tool_calls.length > 0) {
          return "tools";
        }
        return END;
      })
      .addEdge("__start__", "agent");

    const app = workflow.compile();

    const initialState = {
      messages: [
        new SystemMessage(BIS_SYSTEM_PROMPT),
        new HumanMessage(translatedText),
      ],
    };

    const finalState = await app.invoke(initialState);
    const finalMsg = finalState.messages[finalState.messages.length - 1];
    let answerText =
      typeof finalMsg.content === "string"
        ? finalMsg.content
        : JSON.stringify(finalMsg.content);

    // Translate back to target language if non-English
    if (detectedLang !== IndianLanguage.EN) {
      answerText = await this.languageEngine.translateFromEnglish(
        answerText,
        detectedLang,
      );
    }

    const citations = this.citationBuilder.buildCitations(collectedEvidence);
    const suggestedFollowUps = this.generateSuggestedFollowups(
      intent,
      detectedLang,
    );
    const workflowOffers: AgentExecutionResponse["workflowOffers"] = [
      {
        type: "FIND_TESTING",
        label: "View Testing Requirements",
        actionPayload: { query: translatedText },
      },
      {
        type: "FIND_LAB",
        label: "Find Recognized Laboratory",
        actionPayload: { query: translatedText },
      },
      {
        type: "VIEW_ROADMAP",
        label: "Check Certification Scheme",
        actionPayload: { query: translatedText },
      },
    ];

    return {
      query: originalQuery,
      intent,
      structuredAnswer: answerText,
      citations,
      evidence: collectedEvidence,
      suggestedFollowUps,
      workflowOffers,
    };
  }

  private generateSuggestedFollowups(
    intent: QueryIntent,
    lang: IndianLanguage = IndianLanguage.EN,
  ): string[] {
    if (lang === IndianLanguage.HI) {
      if (intent === QueryIntent.FIND_STANDARD) {
        return [
          "इस मानक के तहत अनिवार्य परीक्षण आवश्यकताएं क्या हैं?",
          "मेरी निर्माण इकाई पर कौन सी बीआईएस प्रमाणन योजना लागू होती है?",
          "क्या आप एक पूर्ण अनुपालन रोडमैप रिपोर्ट तैयार कर सकते हैं?",
        ];
      }
      if (intent === QueryIntent.HALLMARKING_VERIFICATION) {
        return [
          "बीआईएस केयर ऐप पर 6-अंकीय HUID कोड कैसे सत्यापित करें?",
          "22K (916) और 18K (750) सोने की शुद्धता में क्या अंतर है?",
          "निकटतम बीआईएस मान्यता प्राप्त हॉलमार्किंग केंद्र कहां है?",
        ];
      }
      if (intent === QueryIntent.CONSUMER_ISI_CHECK) {
        return [
          "नकली या जाली ISI मार्क वाले उत्पाद की रिपोर्ट कैसे करें?",
          "बीआईएस केयर ऐप टोल-फ्री उपभोक्ता हेल्पलाइन नंबर क्या है?",
          "ऑनलाइन निर्माता लाइसेंस स्थिति कैसे सत्यापित करें?",
        ];
      }
      if (intent === QueryIntent.GENERAL_BIS_INFO) {
        return [
          "मेरे उत्पाद के लिए लागू भारतीय मानक खोजें",
          "बीआईएस आईएसआई मार्क प्रमाणन कैसे काम करता है?",
          "स्टील और सीमेंट के लिए कौन से नियमित परीक्षण आवश्यक हैं?",
          "सोने के 6-अंकीय HUID हॉलमार्क को कैसे सत्यापित करें?",
        ];
      }
      return [
        "लागू परीक्षण धाराएं दिखाएं",
        "निकटतम एनएबीएल/बीआईएस मान्यता प्राप्त लैब खोजें",
        "मानक धारा आवश्यकताओं को सरल भाषा में समझाएं",
      ];
    }

    if (intent === QueryIntent.FIND_STANDARD) {
      return [
        "What are the mandatory testing requirements under this standard?",
        "Which BIS certification scheme applies to my unit?",
        "Can you generate a complete compliance roadmap report?",
      ];
    }
    if (intent === QueryIntent.HALLMARKING_VERIFICATION) {
      return [
        "How do I verify the 6-digit HUID code on BIS Care App?",
        "What is the difference between 22K (916) and 18K (750) gold purity?",
        "Where is the nearest BIS Assaying and Hallmarking Centre?",
      ];
    }
    if (intent === QueryIntent.CONSUMER_ISI_CHECK) {
      return [
        "How do I report a product with a fake or counterfeit ISI mark?",
        "What is the BIS Care App toll-free consumer helpline number?",
        "How to verify manufacturer license status online?",
      ];
    }
    if (intent === QueryIntent.GENERAL_BIS_INFO) {
      return [
        "Find applicable Indian Standard for my product",
        "How does BIS ISI Mark certification work?",
        "What are the routine tests required for steel & cement?",
        "How to verify a 6-digit HUID gold hallmark?",
      ];
    }
    return [
      "Show applicable testing clauses",
      "Find nearest NABL/BIS testing laboratory",
      "Explain clause requirements in simple language",
    ];
  }
}
