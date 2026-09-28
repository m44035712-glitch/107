# SentinelX Project Report

## AI-Powered Intelligent Assistant for Indian Standards and BIS Services

**Smart India Hackathon Problem ID:** SIH26107  
**Project category:** Software  
**Theme:** Smart Automation  
**Project type:** Web-based AI decision-support platform  
**Prepared from:** The SentinelX repository implementation and its accompanying project documentation

---

## 1. Executive Summary

SentinelX is a web platform intended to make Indian Standards and Bureau of Indian Standards (BIS) information easier to find and act on. It brings product-to-standard discovery, certification guidance, testing information, laboratory search, hallmarking guidance, consumer checks, and conversational retrieval into one application.

The system follows a retrieval-first design: it searches available standards and source material, returns relevant evidence, and presents citations and source links with its answers. Its knowledge retrieval can use PostgreSQL and pgvector when configured, and can fall back to a supplied BIS workbook or in-memory seed data for local development. The web interface is built with Next.js; the API is built with NestJS; shared packages contain domain types, AI utilities, API clients, and seed data.

The repository contains a runnable prototype. In the inspected local environment, the web app served successfully at `http://localhost:3000`, and the API returned standards for a Cement query using the workbook fallback. PostgreSQL was reachable but the configured `sentinelx` database did not exist, so database-backed retrieval and persistence were unavailable in that run.

## 2. Problem Statement

BIS administers a broad body of Indian Standards, certification schemes, product testing requirements, laboratory recognition information, hallmarking rules, and consumer-protection services. Users often need to consult multiple portals and technical documents to answer basic compliance questions. This creates several practical challenges:

- Identifying which Indian Standard may apply to a product or material.
- Understanding whether a certification scheme or Quality Control Order applies.
- Finding testing methods, acceptance criteria, sampling needs, and apparatus.
- Locating laboratories for a standard or testing capability.
- Understanding hallmarking marks and HUID checks.
- Distinguishing format checks and general guidance from official verification of a licence or product.
- Finding current, authoritative sources and determining whether information is up to date.

These challenges can be particularly costly for MSMEs, manufacturers, exporters, consumers, students, and researchers who may not have specialist regulatory knowledge.

## 3. Proposed Solution

SentinelX provides one interface for searching and navigating BIS-related information. A user can ask a question or select a product, receive matching standards or relevant guidance, and inspect the supporting evidence and source links where provided.

The product principle described by the project is **“Retrieve First, Reason Second, Cite Everything.”** Answers are intended as decision support, not as a replacement for official BIS notifications, standards, certification decisions, or legal advice. Users should confirm important requirements against current official sources.

## 4. Objectives

1. Reduce the effort required to locate standards and BIS-related guidance.
2. Help users identify likely standards from product names and product profiles.
3. Present certification, testing, laboratory, hallmarking, and consumer resources in a consistent experience.
4. Preserve traceability by showing evidence metadata, excerpts, and source URLs when available.
5. Support conversational retrieval across English and supported Indic-language workflows.
6. Provide a modular foundation that can be extended with current, verified data and production integrations.

## 5. Intended Users

- Product manufacturers, sellers, startups, and MSMEs.
- Consumers seeking general product-mark and hallmarking guidance.
- Students and researchers studying standards and compliance.
- Administrators or evaluators reviewing retrieval performance and system activity.

## 6. Scope and Main Features

### 6.1 Product seller and standard discovery
The seller workflow accepts a product name or a suggested product and queries the RAG search endpoint. It presents matching standard identifiers, titles, categories, status fields, and source links when returned by the API. The standards area also includes keyword search and product-profile recommendations.

### 6.2 Conversational assistant
The chat and AI-agent modules accept user queries, identify likely intent, retrieve evidence, and return a structured response with supporting citations and follow-up information. The schema provides fields for language, intent, confidence, citations, evidence, grounding status, and source-freshness warnings.

### 6.3 Certification guidance
Certification endpoints and web pages provide scheme information and roadmap-oriented guidance. The data model represents scheme applicability, sectors, mandatory product categories, steps, required documents, fee summaries, surveillance frequency, validity, and official guideline URLs.

### 6.4 Testing requirements
The testing module represents test methods, clauses, descriptions, acceptance criteria, sampling requirements, frequency, equipment, and whether a test is destructive or routine. Information shown to users must be checked against the current applicable standard and official documents.

### 6.5 Laboratories
The laboratory feature is designed to find facilities using location, standards, and testing capabilities. The schema includes recognition and accreditation fields, contact information, recognized standards, capabilities, and source/update information. Live verification or synchronization with authoritative directories is not demonstrated by the inspected setup.

### 6.6 Hallmarking
The hallmarking module provides purity-grade and mark guidance, centre-related data, and a HUID format check. A format check establishes whether the input matches the expected pattern; it does **not** prove that a HUID is authentic or currently valid in the BIS Care system.

### 6.7 Consumer protection
The consumer module provides CM/L-format checks and general guidance about identifying marks and consumer grievance channels. A syntactically valid licence number is not equivalent to an official BIS licence lookup or confirmation that a particular product is genuine.

### 6.8 Reports, analytics, feedback, and administration
The repository includes compliance-report generation, analytics and evaluation endpoints, feedback capture, document ingestion/status endpoints, and administrative endpoints. Availability and completeness of each workflow depend on configured data and services.

## 7. System Architecture

```text
Browser
  |
  v
Next.js web app (apps/web, port 3000)
  |
  v
Typed API client (packages/api-client)
  |
  v
NestJS REST API (apps/api, port 4000, /api/v1)
  |             |                 |
  |             |                 +--> Domain services
  |             |                      standards, certification, testing,
  |             |                      laboratories, hallmarking, consumer,
  |             |                      chat, compliance, feedback, analytics
  |             |
  |             +--> RAG retrieval and AI packages
  |                    language handling, query intent, embeddings,
  |                    retrieval, reranking, evidence formatting
  |
  +--> Prisma ORM --> PostgreSQL 16 + pgvector
  |
  +--> Local development fallback --> BIS workbook / seed standards
```

The repository is organized as a pnpm/Turborepo monorepo. `apps/web` contains the user interface; `apps/api` contains the REST API; `packages/ai`, `api-client`, `shared-types`, `seed-data`, and `ui` provide reusable functionality. Prisma schemas and migrations describe the relational and vector-oriented persistence layer.

## 8. Retrieval and Data Flow

1. The user submits a product or question in the web app.
2. The typed API client sends a JSON request to the NestJS API. The seller search calls `POST /api/v1/rag/search`.
3. The RAG service detects or accepts a language, normalizes/translates the query, preserves technical entities, and classifies the intent.
4. When available, the service attempts vector retrieval, full-text retrieval, and exact-entity matching against PostgreSQL document chunks. Failures in these optional database retrieval paths are caught so the service can continue.
5. The service also checks the configured BIS workbook and can use in-memory seed standards if database chunks are unavailable.
6. Candidate evidence is reranked and trimmed to the requested result count.
7. The API returns result metadata and excerpts; the web page maps these to a product and standard results view.

The workbook reader uses `BIS_XLSX_PATH` when configured and also checks conventional data-folder paths. It reads workbook sheets other than `README`, preserving row fields in evidence excerpts. Correct and current source data remain essential: retrieval quality cannot exceed the quality, coverage, and freshness of the ingested material.

### Prototype Walkthrough: What Happens When a User Uses It

#### A. Find standards for a product

1. The user opens the Product Seller page (`/seller`) or the standards recommendation flow and enters a product such as “Cement,” or selects one of the suggested products.
2. The seller page sends the product query and requested result count to the typed API client. The client posts it to `/api/v1/rag/search`.
3. The NestJS RAG service normalizes the query, detects language where needed, classifies the query intent, and gathers candidate standards. It attempts database vector/full-text retrieval, then checks the configured workbook and seed-data fallback paths.
4. The retrieval candidates are reranked and returned with fields such as standard number, title, status, source URL, excerpt, and match score.
5. The browser filters out results without a usable standard number, removes duplicate standard numbers, and displays the remaining matches. Selecting a result opens its evidence excerpt; a link can take the user to laboratory search for that product and standard.

In the inspected local run, searching for “Cement” returned workbook-backed results such as IS 269:2015. That confirms the fallback workflow; it does not confirm that a PostgreSQL vector index is configured.

#### B. Ask the AI assistant

1. The user enters a natural-language question in `/chat` and may choose a language or role mode where the interface offers it.
2. The web client sends the message to the chat API. `POST /api/v1/chat/message` accepts optional authentication; session listing and session retrieval/deletion require authentication.
3. The API's AI-agent layer chooses a relevant tool, such as standard recommendation/search, certification guidance, testing requirements, laboratory search, hallmarking information, or consumer information. If no specialized route is selected, it calls general RAG retrieval.
4. The selected service returns domain data and evidence. The agent constructs a response intended to include citations/evidence and the chat UI presents the answer and its supporting material.
5. When database persistence is available, chat sessions and messages can be stored with language, intent, citations, evidence, and grounding metadata. In offline development, a missing database can prevent persistence even while some answers can still be generated from fallback data.

#### C. Use a focused domain page

- **Standards:** search an IS number or product, or provide product-profile attributes to request recommendations and match reasons.
- **Certification:** browse scheme information and request a process/roadmap. The API exposes scheme and roadmap endpoints; source links should be checked for current official requirements.
- **Testing:** search by standard, product, or test and inspect returned methods, clauses, criteria, sample requirements, and equipment.
- **Laboratories:** search the available directory by standard, test, and location-related filters, then inspect lab contact and recognition details.
- **Hallmarking:** view general hallmarking guidance, check whether a submitted HUID has the expected six-character format, and search centre information. The format check is not a live BIS Care lookup.
- **Consumer:** enter a CM/L number for a format check and read general verification/grievance guidance. A format-valid number is not proof of a valid licence.
- **Reports and dashboard:** generate or inspect compliance/evaluation information exposed by their API modules. Database-backed history and metrics require the database to be set up.

#### D. What happens when a service is unavailable

The browser's API client turns non-success HTTP responses into visible error messages, such as “API request failed with status 500.” The web app and API are separate processes: loading the web page on port 3000 does not start the API on port 4000. Both must be running for API-backed searches. A database error may be tolerated by the RAG service's fallback logic, but other data-persistence or database-backed endpoints can remain unavailable. If a workbook fallback is used, `BIS_XLSX_PATH` must point to a readable workbook in the machine running the API.

## 9. Technology Stack

| Area | Technology in repository |
|---|---|
| Monorepo | pnpm workspaces, Turborepo |
| Web | Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide icons |
| API | NestJS 10, TypeScript, REST, Swagger/OpenAPI |
| Persistence | PostgreSQL 16, pgvector, Prisma ORM 5 |
| AI and retrieval | Internal `@bis/ai` package, embedding-provider abstraction, hybrid retrieval/reranking, deterministic fallback paths |
| Shared code | `@bis/shared-types`, `@bis/api-client`, `@bis/seed-data`, `@bis/ui` |
| Testing | Jest and ts-jest; Playwright E2E tests are referenced in repository documentation |
| Local orchestration | Docker Compose for PostgreSQL, API, and web services |

The technology versions above reflect the package manifests in this repository. Some older overview text in the README lists different frontend versions; the manifests should be treated as the implementation source of truth.

## 10. Data Model

The Prisma schema defines the principal records below:

- **User and access:** users, roles, preferred language, organizations, and contact metadata.
- **Conversation:** chat sessions and messages, including language, intent, citations, evidence, feedback, and grounding metadata.
- **Standards:** standard identifiers, titles, years, departments, status, scope, abstract, keywords, mandatory flags, QCO references, clauses, and documents.
- **Knowledge retrieval:** documents and document chunks with source, clause, page, status, metadata, and a vector embedding field.
- **Certification and testing:** certification schemes and their steps; testing requirements and associated acceptance, sampling, and equipment fields.
- **Facilities:** laboratories and hallmarking centres with location, capability, recognition, contact, and source fields.
- **Quality and operations:** sources, feedback, query logs, and evaluation results.

The Prisma datasource is PostgreSQL and declares the `vector` extension. The vector column is represented as `vector(1536)`, so the chosen embedding model and database setup must be compatible with that dimensionality.

## 11. API Surface

The NestJS application applies the `/api/v1` prefix. The inspected controllers include endpoints for:

- Authentication: registration, login, and profile.
- Standards: search, recommend, compare, and retrieve by identifier.
- Certification: list/detail schemes and generate a roadmap.
- Testing: retrieve requirements.
- Laboratories: search and retrieve a facility.
- Hallmarking: guidance, HUID format validation, and centre search.
- Consumer: ISI/CM-L guidance and grievance information.
- RAG: evidence search.
- Chat: messages, streaming, sessions, and session retrieval/deletion.
- Compliance: generate a report.
- Feedback, analytics, administration, and document ingestion/status.

Swagger documentation is configured at `http://localhost:4000/api/docs` when the API is running.

## 12. Security and Responsible Use

The schema and API use role concepts, JWT-related modules, password hashing dependencies, input validation, and API-level exception handling. These are useful application controls, but they do not by themselves establish production security.

Before deployment, operators should replace development secrets, restrict CORS to trusted origins, use HTTPS, apply rate limits and authorization checks to sensitive routes, validate uploads and ingested content, protect database credentials, and maintain backups and audit logs. The local `.env` example contains placeholder keys and development credentials; they must not be treated as production secrets.

Standards, QCOs, certification rules, laboratory recognition, and hallmarking requirements can change. The system should display source and freshness information and direct users to official BIS sources. It should not represent a pattern check as official verification or an AI recommendation as a binding compliance decision.

## 13. Local Setup and Running

### Prerequisites

- Node.js 18 or later; Node.js 20 or later is recommended by the repository documentation.
- Corepack and pnpm, as specified by the root `package.json`.
- PostgreSQL 16 with pgvector for database-backed retrieval, or Docker Desktop to run the provided PostgreSQL container.
- A BIS workbook at a configured path if workbook fallback is required.

### Setup

From the repository root (`sih-26107-main`):

```powershell
corepack pnpm install
Copy-Item .env.example .env
```

Edit `.env` to set the local database connection and the correct workbook path. For the included Compose database, start PostgreSQL with:

```powershell
docker compose up -d postgres
```

Then create/update the schema using the repository's migration workflow, or use `pnpm db:push` for a local development database. Generate the Prisma client and seed/ingest data as appropriate:

```powershell
corepack pnpm db:generate
corepack pnpm db:seed
corepack pnpm ingest:xlsx
```

Workbook ingestion requires the configured workbook to exist. External provider keys are optional for the deterministic/local fallback paths, but are required for the corresponding hosted provider integrations.

### Start services

The intended monorepo command is:

```powershell
corepack pnpm dev
```

In the inspected Windows environment, `npm run dev` from the monorepo root failed inside Turborepo with `spawn UNKNOWN`. Starting each app directly worked:

```powershell
Set-Location apps/api
npm run dev
```

In a second terminal:

```powershell
Set-Location apps/web
npm run dev
```

The web UI is at `http://localhost:3000`; the API is at `http://localhost:4000/api/v1`.

### Current inspected local status

During preparation of this report, the web app returned HTTP 200 on port 3000. The API started and its Cement RAG request returned standards from the workbook path. API startup logged that the PostgreSQL server did not contain the configured `sentinelx` database and reported use of an offline/mock fallback. Therefore, this local verification confirms the web server and one fallback-backed retrieval request, not full database-backed operation.

## 14. Testing and Evaluation

The repository includes focused Jest tests for standards lookup/recommendation, CM/L format validation and consumer guidance, and HUID format validation and hallmarking guidance. The tests use mocks or in-memory behavior for service-level checks. The README also documents commands for workspace tests, Playwright E2E tests, and RAG evaluation.

The evaluation harness loads `data/evaluation/rag_benchmark.json`, runs queries through an agent and reranker using seed standards, and computes retrieval metrics such as Recall@K and MRR. However, some reported metrics are assigned constants rather than independently evaluated: answer relevance is set to `0.94`, citation correctness to `0.98`, and the faithfulness score is based on a simple condition/constant rather than a human-reviewed or semantic verification. The README lists 88% Top-1 accuracy, 100% Top-3 accuracy, MRR 0.94, 96% grounding faithfulness, 98% citation correctness, and approximately 35 ms latency, but these figures should be treated as repository-reported prototype figures, not as independently validated results. Re-run and improve the benchmark before using these values as formal performance claims.

## 15. Known Limitations

1. **Database is not provisioned in the inspected local setup.** The configured database name was absent. Fallback search works, but persistence, database-backed retrieval, and other database-dependent features are not fully verified.
2. **Fallback data is not a production knowledge base.** Workbook and seed data coverage may be incomplete, stale, or insufficient for all products and language queries.
3. **Official verification is not established by format validation.** CM/L and HUID syntax checks do not query or authenticate against official BIS systems.
4. **External integrations are not live by default.** Live status checking for laboratories, certification applications, and official portals requires integrations not demonstrated in the local run.
5. **Freshness and legal correctness require source governance.** Authoritative data ingestion, review cadence, versioning, and correction workflows must be maintained.
6. **Evaluation needs stronger methodology.** Reported faithfulness and citation numbers include hard-coded values in the evaluation code and are not reliable standalone quality evidence.
7. **Development configuration must be hardened.** Secrets, CORS, authorization coverage, upload controls, and operational monitoring require production review.
8. **Monorepo startup on the inspected Windows environment is inconsistent.** The root Turborepo launch failed, while separate API and web commands succeeded.

## 16. Future Work

- Provision and validate PostgreSQL/pgvector in local, test, and production environments; add database health checks and migrations to startup documentation.
- Build a governed ingestion pipeline for official BIS publications, QCOs, product manuals, testing data, and recognized facilities, including source timestamps and version history.
- Add scheduled freshness checks and clearly surface source dates and uncertainty to users.
- Connect to official verification services where permitted; distinguish official verification from local format checks.
- Expand multilingual testing with representative queries, language-specific relevance evaluation, and protection for technical identifiers.
- Replace heuristic evaluation values with a reproducible benchmark, independently judged citation correctness, grounding review, latency percentiles, and regression testing.
- Complete end-to-end tests for critical user journeys and database-backed integration tests.
- Harden production authentication, authorization, CORS, secrets management, rate limiting, observability, and recovery procedures.
- Consider offline/PWA support, voice input, and digital-signature workflows after core data quality and authoritative integrations are established.

## 17. Conclusion

SentinelX is a modular prototype for making BIS-related standards and compliance information more accessible through product discovery, structured domain workflows, and evidence-oriented conversational retrieval. Its architecture combines a Next.js interface, a NestJS API, shared domain packages, Prisma/PostgreSQL persistence, and workbook/seed-data fallbacks for development.

The prototype demonstrates a working web interface and fallback-backed standards search. Its most important next steps are to provision and validate the database, establish a maintained authoritative knowledge base, strengthen end-to-end and retrieval evaluation, and clearly separate guidance from official verification. With those foundations, SentinelX can progress from a useful demonstration into a dependable compliance-support platform.
