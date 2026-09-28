# SentinelX 
[Demo Website](https://sentinelx.netlify.app/)

## 1. Project Information

- **Project Title:** SentinelX – AI-Powered Intelligent Assistant for Indian Standards & BIS Services
- **PS ID:** SIH26107
- **PS Title:** AI-powered Intelligent Assistant for Indian Standards and BIS Services for Industries and Consumers
- **Category:** Software
- **Theme:** Smart Automation

## 2. Problem Statement

The Bureau of Indian Standards (BIS) publishes thousands of Indian Standards (IS) and regulates product certification, compulsory registration (CRS), hallmarking of precious metals, laboratory recognition (LIMS), and consumer protection. Indian manufacturers, MSMEs, startups, exporters, students, and citizens frequently struggle with:

1. **Standard Applicability** – determining which Indian Standard applies to a given product, material grade, or capacity.
2. **Certification Schemes** – navigating Scheme I (ISI Mark), Scheme II (CRS), Scheme IV (Certificate of Conformity), or FMCS.
3. **Mandatory vs. Voluntary Status** – identifying whether a Quality Control Order (QCO) legally mandates certification before retail sale.
4. **Testing Schedules** – uncovering sampling frequencies, acceptance parameters, and required test equipment.
5. **Recognized Laboratories** – locating NABL/BIS-accredited testing facilities for specific IS testing scopes.
6. **Hallmarking & HUID** – understanding fineness grades and verifying 6-digit alphanumeric HUID codes.
7. **Consumer Verification** – spotting counterfeit ISI marks and verifying CM/L numbers on the BIS Care platform.

## 3. Proposed Solution

**SentinelX** is an evidence-backed, conversational, multi-step AI decision-support platform built around the core principle **"Retrieve First → Reason Second → Cite Everything."** The system never fabricates Indian Standard numbers, clause numbers, certification procedures, testing limits, or laboratory accreditations — if authoritative evidence is absent from the knowledge base, it explicitly states that the requirement cannot be verified.

Users interact through a 3-panel AI workspace to get grounded, citation-backed answers on standards applicability, certification roadmaps, testing requirements, accredited labs, hallmarking, and consumer protection, in English, Hinglish, and all 22 Eighth-Schedule Indian languages.

## 4. Key Features

- **3-Panel AI Workspace (`/chat`)** – conversational interface with citation badges, confidence indicators, and a grounded evidence drawer (standard number, clause, section, page, source URL, verbatim excerpt).
- **"Find My Standard" Product Profiler (`/standards/recommend`)** – step-by-step profiler matching products to standards with match reasons.
- **Certification Schemes & Compliance Roadmap (`/certification`)** – interactive timelines for Scheme I (ISI Mark), Scheme II (CRS), and Hallmarking.
- **Testing Requirements Database (`/testing`)** – routine vs. type tests, acceptance criteria, sampling rules, and apparatus requirements.
- **BIS Recognized Laboratories Finder (`/laboratories`)** – searchable directory filterable by state, city, standard, and testing capability.
- **Gold & Silver Hallmarking Assistant (`/hallmarking`)** – fineness grade explainer and HUID validator.
- **Consumer Protection & ISI Mark Hub (`/consumer`)** – CM/L licence validation and counterfeit-detection checklist.
- **Downloadable BIS Compliance Report (`/reports`)** – printable PDF covering product profile, standards, certification timeline, and evidence.
- **Analytics & Observability Dashboard (`/dashboard`)** – query intent, latency, and zero-hallucination accuracy tracking.
- **Multilingual Indic Language Pipeline** – full support for 22 Eighth-Schedule Indian languages plus English and Hinglish, with protection for technical identifiers (`IS 10500`, `Clause 4.2`, `CM/L-1234567`, `HUID`).

## 5. Technology Stack

| Layer | Technologies |
|---|---|
| **Monorepo** | Turborepo, pnpm workspaces, TypeScript 5.5 |
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui, TanStack Query, Lucide React, Recharts |
| **Backend API** | NestJS, TypeScript, REST APIs, Passport JWT, bcrypt, class-validator, Swagger/OpenAPI |
| **Database & Vector** | PostgreSQL 16, pgvector extension, Prisma ORM |
| **AI & RAG** | Provider abstraction (Gemini / OpenAI / deterministic local engine), multilingual embeddings, cross-encoder reranking, grounding validator |
| **Multilingual** | Indic language pipeline supporting all 22 Eighth-Schedule Indian languages + English + Hinglish |
| **Testing** | Jest, ts-jest, Supertest, Playwright E2E |
| **Containerization** | Docker, Docker Compose |

## 6. Architecture

```text
User (MSME / Consumer / Researcher)
  |
  v
apps/web (Next.js App Router + Tailwind + shadcn/ui)
  |
  v
apps/api (NestJS API Gateway)
  |
  +--> Auth & RBAC
  +--> AI Agent Orchestrator & Tool Caller
  +--> Hybrid RAG Engine ---> packages/ai
  |                            |
  |                            +--> Indic Language Detector
  |                            +--> IS Token & Clause Preserver
  |                            +--> PostgreSQL + pgvector / BM25 Index
  |                            +--> Hybrid Cross-Encoder Reranker
  |                            +--> Zero-Hallucination Grounding Validator
  |                            +--> Traceable Citation Generator
  |
  +--> Standards, Certification, Testing, Labs,
       Hallmarking, Consumer, Reports, Analytics services
```

## 7. Repository Structure

```text
sentinelx/
├── apps/
│   ├── web/                     # Next.js App Router web application
│   │   ├── app/                 # Routes: /chat, /standards, /certification, /testing, etc.
│   │   ├── components/          # Header, Footer, Providers
│   │   ├── e2e/                 # Playwright E2E test suites
│   │   └── Dockerfile
│   └── api/                     # NestJS backend API gateway
│       ├── src/                 # Auth, Standards, Certification, Testing, Labs, Hallmarking, RAG, etc.
│       ├── test/                # Jest integration & unit test suites
│       └── Dockerfile
├── packages/
│   ├── shared-types/            # Shared TypeScript domain types, enums, DTOs
│   ├── api-client/               # Typed REST client (TanStack Query compatible)
│   ├── ai/                      # RAG engine, multilingual tokenizer, reranker, prompts, agent tools
│   ├── ui/                      # Design system (EvidencePanel, Badges, Cards, AshokaMotif)
│   ├── typescript-config/       # Shared tsconfig definitions
│   └── eslint-config/           # Shared ESLint rules
├── prisma/
│   └── schema.prisma            # PostgreSQL schema with pgvector and domain models
├── scripts/
│   ├── seed/                    # Authoritative BIS seed datasets
│   ├── evaluation/              # RAG precision, Recall@K, faithfulness evaluation
│   └── ingestion/                # Structure-aware chunking pipeline
├── data/
│   └── evaluation/
│       └── rag_benchmark.json   # Ground-truth evaluation benchmark queries
├── docs/
│   └── architecture.md
├── submission/
│   ├── PRESENTATION.md
│   └── DEMO.md
├── assets/
│   └── screenshots/
│       └── README.md
├── docker-compose.yml            # Multi-container orchestration (Postgres+pgvector, API, Web)
├── turbo.json                    # Turborepo task pipeline
├── pnpm-workspace.yaml           # pnpm workspace definition
└── LICENSE
```

### What goes where?

| Item | Location |
|---|---|
| Source code | `apps/`, `packages/` |
| Architecture / technical documentation | `docs/` |
| Project screenshots / prototype photos | `assets/screenshots/` |
| Final PPT / presentation | `submission/` |
| Demo video link | `submission/DEMO.md` |
| Project overview | `README.md` |

## 8. Presentation

The link for SIH presentation is as follows:
[presentation](https://drive.google.com/file/d/1L7gKgEvSyIDqS0fG5OhOFgO_MFWGXOtl/view?usp=sharing)

## 9. Demo Video

[demo-video](https://drive.google.com/file/d/1EnS0QGpDIGhGzfqF7aX_yZfmO1pi1Qb4/view?usp=sharing)

## 10. Screenshots / Prototype Photos
[screenshots](assets/screenshots)

Homepage: 
![Homepage](assets/screenshots/01-home.jpeg)


Standards page: 
![Standards](assets/screenshots/02-standards.jpeg)


Certifications: 
![Certifications](assets/screenshots/03-certification.jpeg)


Consumer:
![consumer](assets/screenshots/05-consumer.jpeg)


AI_Chat: 
![ai_chat](assets/screenshots/06-ai_chat.jpeg)


Lab:
![labs](assets/screenshots/07-labs.jpeg)


Reports: 
![report](assets/screenshots/08-report.jpeg)



## 11. Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **pnpm**: v9.0.0 or higher (`npm install -g pnpm`)
- **Docker**: (optional, for running PostgreSQL + pgvector)

### Steps
```bash
git clone https://github.com/pratik-me/sih-26107
cd sentinelx

# Install all monorepo packages
pnpm install

# Configure environment variables
cp .env.example .env

# Start PostgreSQL with pgvector (optional if not using Docker)
docker compose up postgres -d
```

Default local settings operate with high-accuracy grounded deterministic fallbacks, allowing immediate testing even before connecting external cloud keys.

### BIS Workbook Ingestion

Place the source workbook at `data/bis_dataset.xlsx` (or provide a path through `BIS_XLSX_PATH`). The repository includes the supplied prototype workbook and ingests its `BIS_Standards`, `Industry_Info`, and `Consumer_Info` sheets dynamically; the `README` sheet is treated as metadata and skipped.

After PostgreSQL and pgvector are running, create the knowledge base with:

```bash
pnpm ingest:xlsx
```

The command preserves worksheet names, original column names, row numbers, products, standards, categories, and source URLs in chunk metadata. Re-running it replaces the previous `BIS Dataset - <sheet>` records, preventing duplicate vectors. It uses the configured embedding provider and falls back to the local deterministic provider when cloud credentials are unavailable.

## 12. Run

```bash
# Concurrently start Next.js web (port 3000) and NestJS API (port 4000)
pnpm dev
```

- **Web Portal**: http://localhost:3000
- **API Server**: http://localhost:4000/api/v1
- **Swagger Documentation**: http://localhost:4000/api/docs

To launch the complete application with Docker Compose instead:
```bash
docker compose up --build -d
```

### Testing
```bash
# Unit & integration tests across packages and apps
pnpm test

# RAG evaluation (precision, Recall@K, MRR, grounding faithfulness)
pnpm eval:rag

# Playwright E2E tests
pnpm --filter @bis/web run test:e2e
```

**Benchmark Results:**
- Top-1 Recommendation Accuracy: 88%
- Top-3 Recommendation Accuracy: 100%
- Mean Reciprocal Rank (MRR): 0.94
- Grounding Faithfulness Rate: 96%
- Citation Correctness Rate: 98%
- Average Total Latency: ~35 ms

## 13. Future Scope

- Expand the recognized laboratories directory with live NABL API integration.
- Add offline/PWA support for low-connectivity rural areas.
- Extend the compliance report generator to support digital signatures for official submission.
- Integrate directly with the Manakonline portal for CM/L application status tracking.
- Add voice-based query support for the 22 Indic languages.
