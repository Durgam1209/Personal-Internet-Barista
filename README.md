# ☕ personal.cafe — Your Daily AI Engineering Barista

`personal.cafe` is an automated, high-fidelity AI-curated newsletter platform that gathers, deduplicates, and synthesizes engineering preprints, RSS feeds, and GitHub trending repositories into a unified, daily coffeehouse-themed digest.

---

## 🛠️ Tech Stack

*   **Frontend**: Next.js 16 (Turbopack), Tailwind CSS, Radix UI primitives.
*   **Authentication**: Clerk Auth (with custom verification and Guest Mode support).
*   **Backend**: FastAPI (Python), Uvicorn.
*   **Database**: Supabase (PostgreSQL with Row Level Security policies).
*   **AI Curation & Deduplication**: 
    *   *Deduplication*: Scikit-Learn TF-IDF + Cosine Similarity algorithms.
    *   *Synthesis*: Anthropic Claude API (via direct client or OpenRouter gateway).
*   **Automation**: GitHub Actions (Nightly pipelines) + local orchestrators.

---

## 📂 Project Structure

```
├── ai/                      # AI Curation & Synthesis
│   └── brew.py              # TF-IDF Deduplication & Claude Curation
├── automation/              # Orchestration & MLOps Pipelines
│   ├── .github/workflows/   # Nightly runner workflow
│   └── run_pipeline.py      # E2E pipeline orchestrator
├── backend/                 # FastAPI Backend REST Gateway
│   ├── main.py              # API Routes (/digest, /health, /pipeline/log)
│   ├── save.py              # Supabase insertion connector
│   └── schema.sql           # PostgreSQL database schema & RLS policies
├── data/                    # Local cache and system log outputs
├── frontend/                # Next.js App Router UI Layout
│   ├── app/                 # Page router, layouts, sign-in, and sign-up
│   ├── components/          # Premium UI cards and animations (SunlightBeams, etc.)
│   ├── context/             # AuthContext bridging Clerk and local Guest Mode
│   ├── lib/                 # Fetch utils
│   └── proxy.ts             # Clerk Middleware routes and matchers
└── ingestion/               # Content aggregators
    └── fetch.py             # RSS & GitHub Trend Scraper
```

---

## 🚀 Setup & Local Development

### 1. Database Initialization
Create a free database on [Supabase](https://supabase.com) and run the table query in the **SQL Editor** (`>_` in the sidebar) using [schema.sql](file:///c:/Users/saiam/cafe/Personal-Internet-Barista/backend/schema.sql):

```sql
create table if not exists digests (
  id bigint generated always as identity primary key,
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  espresso jsonb not null,
  cold_brew jsonb not null,
  pastry jsonb not null
);

alter table digests enable row level security;
create policy "Allow public read access" on digests for select using (true);
create policy "Allow service insertion" on digests for insert with check (true);
```

### 2. Environment Configurations
Create a `.env` file in the project root:
```env
# Supabase Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-role-key

# AI model credentials (optional, falls back to offline dry-runs if empty)
ANTHROPIC_API_KEY=your-anthropic-key-here
# OPENROUTER_API_KEY=your-openrouter-key-here
```

Ensure your Clerk keys are present in `frontend/.env.local` (automatically handled during `clerk init`).

### 3. Run the Daily Ingestion & Curation Pipeline
To aggregate feeds, filter duplicates, synthesize the digest, and save it to Supabase:
```bash
python automation/run_pipeline.py
```

### 4. Run the Backend API Server
Start the FastAPI server:
```bash
python -m uvicorn backend.main:app --port 8000
```

### 5. Run the Frontend Dashboard
Go to the frontend directory and start the Next.js server:
```bash
cd frontend
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## ✨ Key Features & User Experience

*   **Premium Theme System**: Support for dark mode (**Espresso**) and light mode (**Latte**) tailored around beautiful warm coffeehouse aesthetics.
*   **Hybrid Authentication**: Clerk Authentication for verified email and social accounts alongside a custom local **Guest Mode** for immediate testing.
*   **Vector Similarity Deduplication**: Ingests hundreds of daily feeds and filters duplicates using cosine vector similarity matrices.
*   **Reliable Offline Fallback**: Safely defaults to local cached JSON data if external APIs or Supabase connections are unavailable, preventing system crashes.
*   **Saved Library & Timeline**: Bookmarking digests locally and looking back through historical runs in the timeline archive.
