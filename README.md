# Repo X-Ray

> **"See inside your codebase."**

Repo X-Ray is a polished **local-first AI codebase intelligence tool** that connects directly to your own [Ollama](https://ollama.com) installation and maps local repositories. It visualizes architecture, dependency graphs, calculates change impact blast radii, audits code health, and allows you to query your codebase in natural language — completely offline, with **zero proprietary cloud AI APIs** and **zero cloud data leakage**.

---

## Why Local AI?

Most AI developer tools require uploading proprietary source code, credentials, and business logic to third-party cloud APIs. Repo X-Ray runs entirely on your own workstation:

- **100% Privacy & Data Sovereignty**: Source files, AST parse trees, and prompt contexts stay on your local disk.
- **Offline Capable**: Works with zero internet connectivity once your local model is loaded.
- **No Cloud API Keys or Subscription Fees**: Connects to your existing Ollama instance (`http://localhost:11434`) using open-weight models like `qwen2.5-coder`, `llama3.2`, or `gemma3`.
- **Ultra-Fast AST Heuristics**: Combines deterministic static parsing with local LLM reasoning for instant insights.

---

## Features

1. **First-Run Onboarding & Demo Mode**:
   - Immediate zero-configuration exploration via the realistic **Stipo** demo repository (87 files, 14 directories, 23 dependencies, Firebase + Express stack).
   - Seamlessly switch to real repository scanning at any time.

2. **Interactive Architecture Dependency Map**:
   - Full-screen interactive graph powered by **Cytoscape.js**.
   - Nodes represent files, services, components, controllers, models, and config files with color-coded architectural roles.
   - Edges trace real `import`, `require`, and dependency links.
   - Interactive layouts: Force-Directed (Cose), Hierarchical Tree (Breadthfirst), Concentric Rings, and Circular.
   - Node Inspector slide-over drawer: displays outgoing dependencies, incoming consumers, impact ratings, and direct action triggers.

3. **Project Explorer & Code Inspector**:
   - Clean VS Code-inspired file tree with language-specific icons.
   - Syntax-highlighted code viewer (PrismJS) with line numbers and breadcrumb navigation.
   - Integrated "AI Code Analysis" drawer for on-demand file role explanation.

4. **"Ask Your Codebase" (AI Chat)**:
   - Developer-first query interface with instant suggested prompt chips:
     - *"Where is authentication handled?"*
     - *"How does the dashboard load data?"*
     - *"What depends on firebase.js?"*
     - *"Explain the application architecture."*
     - *"What would break if I remove auth.js?"*
   - Cites exact file references and exported symbols with one-click navigation to the file explorer.

5. **Signature Change Impact Analysis**:
   - Select any file to compute its **Blast Radius**:
     - Direct incoming dependents.
     - Transitive (cascading) dependents via reverse BFS traversal.
     - Affected functional areas (e.g., *Authentication*, *Dashboard*, *User Profile*, *Session Management*).
     - Visual sub-graph highlighting ripple effects.
     - Actionable *"Recommended before changing"* advisory checklist.

6. **AI-Assisted Code Health Scan**:
   - Holistic heuristic evaluation across 4 pillars:
     - **Architecture & Coupling** (86/100)
     - **Maintainability & Modularity** (78/100)
     - **Documentation Coverage** (62/100)
     - **Security Signals** (81/100)
   - Color-coded passing signals (`✓`), detected warnings (`⚠`), and actionable recommendations.

7. **Documentation & README Generator**:
   - **Architecture Deep-Dive**: Synthesizes a technical system spec detailing entry points, state layers, and modular flows.
   - **README Generator**: Generates clean, production-ready markdown documentation with a single click and instant clipboard copying.

---

## Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────┐
│                   Repo X-Ray UI                        │
│   Vanilla HTML5 + CSS3 + JavaScript (No Frameworks)    │
│   Cytoscape.js (Graph) + PrismJS (Syntax Highlighting) │
└───────────────────────────┬────────────────────────────┘
                            │ REST / HTTP
┌───────────────────────────▼────────────────────────────┐
│                 Node.js / Express Server               │
│   - Safe Local Repository Scanner (AST regex parser)   │
│   - Impact Analyzer (BFS reverse dependency graph)     │
│   - Health Scanner (Coupling, size, security signals)  │
│   - Local Heuristic Intelligence Engine                │
└───────────────────────────┬────────────────────────────┘
                            │ Local API (11434)
┌───────────────────────────▼────────────────────────────┐
│                Local Ollama Service                    │
│   - qwen2.5-coder / llama3.2 / gemma3                  │
│   - Zero third-party telemetry                         │
└────────────────────────────────────────────────────────┘
```

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3 with Apple + Samsung One UI + Linear dark aesthetic.
- **Backend**: Node.js, Express.
- **Graph Engine**: Cytoscape.js (bundled locally for 100% offline usage).
- **Syntax Highlighting**: PrismJS (bundled locally).
- **AI Engine**: Ollama HTTP API (`http://localhost:11434`), default model: `qwen2.5-coder`.

---

## Ollama Setup

To run local AI models with Repo X-Ray:

1. **Install Ollama**:
   Download from [ollama.com](https://ollama.com).

2. **Start the local server**:
   ```bash
   ollama serve
   ```

3. **Pull a coding model** (Recommended: `qwen2.5-coder`):
   ```bash
   ollama pull qwen2.5-coder
   ```
   *Alternative models*: `llama3.2`, `gemma3`, `deepseek-coder`.

4. **Verify Ollama is reachable**:
   ```bash
   curl http://localhost:11434/api/tags
   ```

---

## Installation & Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/repo-x-ray.git
   cd "Repo X-Ray"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the application**:
   ```bash
   npm start
   ```

4. **Open in browser**:
   Navigate to:
   ```text
   http://localhost:3888
   ```

---

## Demo Mode

If you do not have Ollama installed or running, **Repo X-Ray includes a full offline demo mode**:
- Click **"Explore Demo"** on the onboarding screen or top header.
- The pre-generated **Stipo** application dataset is loaded with 87 files, complete dependency relationships, live Cytoscape graph nodes, pre-computed health audits, and responsive codebase Q&A answers.

---

## Security & Privacy Guarantee

- **No Remote Telemetry**: Repo X-Ray never uploads code or prompts to OpenAI, Anthropic, Google Gemini, or external telemetry servers.
- **Path Traversal Protection**: Filesystem reading is strictly confined to the selected root directory.
- **Secret Filtering**: Sensitive files matching `.env`, `.env.*`, `.pem`, `.key`, `id_rsa`, and private certificate formats are automatically excluded from AST scans and prompts.

---

## Limitations & Disclaimer

> [!NOTE]
> Repo X-Ray is an open-source demo/prototype developed for AI challenges. AI-generated code analysis, dependency inferences, and code health signals are heuristic and probabilistic. The health scan is not a certified penetration test or formal regulatory audit.

---

## Roadmap

- [ ] AST parsing via Tree-sitter for multi-language semantic call graphs (Go, Rust, Java).
- [ ] Direct git diff integration for PR blast radius previews.
- [ ] Interactive refactoring suggestions with downloadable git patch files.
- [ ] Embeddings-based local vector store (Chromem-js / sqlite-vss) for multi-million LOC codebases.

---

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

A simple project made by Vaibhav Sengar for lovely developers.
