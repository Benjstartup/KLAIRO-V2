# Klairo Architecture Instruction Block

## Product identity
Klairo is a cheaper, cleaner, and better competitor to TrendSpider for active US equity traders.

Klairo is NOT "just an AI assistant for traders."
Klairo IS a trader workflow OS.

The core product loop is:
scan -> open chart -> understand setup -> save idea -> create alert -> revisit/manage setup

The product should optimize for speed, clarity, trust, and workflow compression.

## Non-negotiable product principles
- Do not copy proprietary TrendSpider code, branding, copywriting, or unique branded expression verbatim.
- It is acceptable to build feature-parity workflows and similar user outcomes.
- Klairo must feel cleaner, more intuitive, and less cluttered than TrendSpider.
- Klairo is a decision-support platform, not an autonomous trading system.
- AI must be grounded in real chart, symbol, scan, and indicator context.
- Never present hallucinated confidence or fabricated market reasoning.
- Prefer editable structured outputs over opaque free-text magic.
- Ruthless scope control is mandatory. Do not overbuild.

## MVP definition
Klairo v1 is a web-based active-trader workspace for US equities that combines:
- charting
- scanner
- AI setup analysis
- alerts
- saved workflows / setup journal

If a proposed feature does not strengthen one of those five areas, it is probably out of scope for MVP.

## Explicitly out of MVP scope
Do NOT build these unless explicitly requested:
- live broker execution
- full automation / live bots
- native mobile app
- options chain / options flow
- crypto / futures / forex expansion
- alternative data feeds
- AI strategy lab / predictive ML platform
- proprietary Raindrop-like chart clones
- custom scripting language
- institutional team admin features
- social trading features

## Phase roadmap
Build in this order unless explicitly told otherwise:

### Phase 0 - Architecture shell
- app shell
- auth
- database schema
- protected workspace
- observability
- analytics hooks
- billing placeholder
- environment/config structure

### Phase 1 - Charting foundation
- symbol search
- market data adapter
- candlestick chart
- timeframe selector
- volume
- indicators: SMA, EMA, VWAP, RSI, MACD
- save/load chart state
- drawing tools only if lightweight

### Phase 2 - Watchlists + scanner
- watchlists CRUD
- scanner builder UI
- scan filters
- save scans
- run scans
- scan results table
- convert results to watchlist

### Phase 3 - AI wedge
- AI chart context explainer
- natural-language-to-scan conversion
- natural-language-to-alert conversion
- setup summary
- "why this ticker is interesting" grounded explanation

### Phase 4 - Alerts
- price alerts
- indicator alerts
- scan alerts
- watchlist alerts
- email + in-app delivery
- alert history
- edit / disable / snooze

### Phase 5 - Setup journal
- save setup
- setup notes
- tags
- status tracking
- daily review workflow

### Later only
- backtesting
- automated technical analysis
- paper bots
- broker integrations

## Primary user
The primary user is an active US equity trader who wants to:
- discover setups faster
- understand chart context faster
- monitor opportunities without clutter
- keep a repeatable workflow

Optimize for this user first. Do not drift into general investing, long-term portfolio management, or beginner education products.

## Core product modules
The architecture should separate these concerns clearly:

### 1. Market data layer
Responsibilities:
- symbol search
- OHLCV retrieval
- timeframe aggregation
- indicator input data
- quote caching

Rules:
- abstract the data provider behind interfaces
- do not couple core business logic to a single vendor
- begin with US equities only
- prioritize correctness and caching

### 2. Charting layer
Responsibilities:
- render candles and volume
- render indicators and overlays
- support timeframe switching
- persist chart preferences/state
- support future annotations

Rules:
- charting must feel fast and trustworthy
- preserve clear separation between chart rendering and indicator calculation
- no bloated UI
- default layout should be excellent without customization

### 3. Scan engine
Responsibilities:
- define structured scan rules
- run scans against a symbol universe
- save scans
- return typed results
- support future AI compilation from plain English

Rules:
- scan engine logic must live in typed application code, not only in prompts
- each scan condition should be composable and testable
- results should be deterministic for the same inputs

### 4. Alert engine
Responsibilities:
- evaluate alert rules
- schedule checks
- persist alert state/history
- notify users

Rules:
- alerts must be reliable and auditable
- false positives and silent failures are unacceptable
- use idempotent job patterns where possible

### 5. AI orchestration layer
Responsibilities:
- convert plain English into structured scan definitions
- convert plain English into structured alert definitions
- explain chart/setup context using real inputs
- summarize setups and notes

Rules:
- AI outputs must compile into typed internal schemas
- never let critical business logic exist only inside prompt text
- always ground AI responses in real symbol/timeframe/indicator/scan context
- prefer "here is what the data suggests" over predictive certainty
- AI should explain, not pretend to know the future

### 6. Persistence layer
Store at minimum:
- users
- workspaces
- watchlists
- saved scans
- alerts
- saved setups
- notes
- preferences

## Recommended engineering defaults
Unless explicitly instructed otherwise, prefer:
- TypeScript
- clean modular architecture
- strong typing and schema validation
- server-side business logic for core workflows
- client components only where necessary
- small reusable UI components
- explicit loading/error/empty states
- background jobs for async alerting / scan refresh
- analytics and error monitoring from the start

## UI / UX rules
- default to a clean professional trading UI
- avoid clutter and over-decoration
- design for dense information without feeling messy
- one strong default workspace is better than endless configurability
- users should reach value quickly:
  - open ticker
  - understand setup
  - save / alert / move on
- every important screen must answer:
  - what is happening?
  - why does it matter?
  - what should I do next?

## Coding rules
- do not make unrelated changes
- do not rewrite large files unnecessarily
- inspect relevant files first, then make a minimal plan, then implement
- preserve existing architecture unless intentionally refactoring
- prefer explicitness over cleverness
- add comments only where they genuinely help
- keep components focused and reasonably small
- avoid tight coupling
- avoid duplicated business logic
- use typed schemas for all structured AI inputs/outputs
- validate all external and user inputs
- handle failure cases explicitly

## Quality bar
Before finishing any substantial task:
- ensure the code compiles
- run relevant tests if present
- add tests for critical logic when reasonable
- check for type safety
- check for broken imports
- check for obvious UX regressions
- check that the feature still matches Klairo's MVP scope

## What to optimize for
Prioritize in this order:
1. correctness
2. trust
3. speed to useful output
4. clarity
5. extensibility
6. visual polish

Do not sacrifice correctness and trust for flashy AI behavior.

## Product positioning guardrails
Klairo should feel like:
- TrendSpider-level workflow ambition
- cleaner and easier to use
- AI-native in the right places
- cheaper and more focused

Klairo should NOT feel like:
- a random chatbot attached to charts
- a bloated terminal for every market under the sun
- an over-automated black box
- a copy-paste clone with proprietary wording

## Instruction for task execution
For any new task:
1. identify which Klairo module it belongs to
2. verify whether it is in MVP scope
3. inspect the relevant files
4. propose the smallest correct implementation
5. implement cleanly
6. verify the result

If a request conflicts with the MVP roadmap, flag it and recommend the leaner path first.