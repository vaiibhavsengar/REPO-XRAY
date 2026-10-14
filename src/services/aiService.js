/**
 * AI Service Orchestrator
 * Connects to local Ollama instance with fallback heuristic intelligence
 * for seamless offline / demo mode operation.
 */

const ollama = require('./ollamaService');
const demoRepoData = require('../data/demoRepo');

class AIService {
  /**
   * Explain an individual file
   */
  async explainFile(filePath, codeSnippet, repoContext = {}, model = null) {
    const filename = filePath.split('/').pop();
    const systemPrompt = `You are Repo X-Ray, an expert local codebase intelligence engine. Analyze the provided source code concisely and technically. Focus on its architectural role, exported APIs, key dependencies, and potential side-effects.`;

    const userPrompt = `File: ${filePath}
Language: ${filePath.split('.').pop()}
${codeSnippet ? `\nCode snippet:\n\`\`\`\n${codeSnippet.slice(0, 3000)}\n\`\`\`` : ''}

Provide a concise technical breakdown:
1. **Core Responsibility**: What this file does.
2. **Key Exports & Interfaces**: Major functions or classes.
3. **Dependencies & Interactions**: What it interacts with.
4. **Architectural Notes**: Any design patterns or caveats.`;

    // Try Ollama first if connected
    if (ollama.isConnected) {
      try {
        const result = await ollama.generate(userPrompt, systemPrompt, { model, timeout: 20000 });
        if (result && result.response) {
          return {
            explanation: result.response,
            engine: `Ollama (${result.model})`,
            isLocalOllama: true
          };
        }
      } catch (err) {
        console.warn('Ollama generation timed out or failed, falling back to local heuristic engine:', err.message);
      }
    }

    // Fallback: Smart heuristic explanation
    return {
      explanation: this.generateHeuristicFileExplanation(filePath, codeSnippet, repoContext),
      engine: 'Repo X-Ray Local Heuristic Engine',
      isLocalOllama: false
    };
  }

  /**
   * Ask questions about the codebase
   */
  async askQuestion(question, repoData = {}, model = null) {
    const trimmed = (question || '').trim();

    // Check pre-configured demo answers if repo is demo
    if (repoData.isDemo && demoRepoData.aiQA[trimmed]) {
      const demoAnswer = demoRepoData.aiQA[trimmed];
      return {
        answer: demoAnswer.answer,
        relatedFiles: demoAnswer.relatedFiles,
        relevantSymbols: demoAnswer.relevantSymbols,
        confidence: demoAnswer.confidence,
        engine: ollama.isConnected ? `Ollama (${ollama.currentModel})` : 'Repo X-Ray Intelligence (Local-First)'
      };
    }

    // Prepare context from repository
    const relevantFiles = this.findRelevantFiles(trimmed, repoData);
    const contextSummary = this.buildRepoSummaryContext(repoData, relevantFiles);

    const systemPrompt = `You are Repo X-Ray, an expert local codebase intelligence tool. You answer questions about the user's local repository accurately, concisely, and technically based ONLY on the provided codebase context. Always cite specific files and functions. Format your response cleanly in Markdown.`;

    const userPrompt = `Codebase Context:
Repository: ${repoData.repoName || 'Project'}
Total Files: ${repoData.stats?.totalFiles || 0}
Architecture: ${repoData.architectureSummary || 'Modular application'}

Relevant Files & Metadata:
${contextSummary}

User Question: ${question}

Provide a direct, technical answer. Specify the exact file paths and symbol names that handle this logic.`;

    // Try Ollama if connected
    if (ollama.isConnected) {
      try {
        const result = await ollama.generate(userPrompt, systemPrompt, { model, timeout: 25000 });
        if (result && result.response) {
          return {
            answer: result.response,
            relatedFiles: relevantFiles.map(f => f.relativePath || f.id).slice(0, 4),
            relevantSymbols: this.extractSymbolsFromFiles(relevantFiles),
            confidence: 'High (Ollama Inference)',
            engine: `Ollama (${result.model})`
          };
        }
      } catch (err) {
        console.warn('Ollama chat failed, using local semantic fallback:', err.message);
      }
    }

    // Heuristic answer generator
    const heuristic = this.generateHeuristicAnswer(trimmed, relevantFiles, repoData);
    return {
      answer: heuristic.answer,
      relatedFiles: relevantFiles.map(f => f.relativePath || f.id).slice(0, 4),
      relevantSymbols: this.extractSymbolsFromFiles(relevantFiles),
      confidence: 'Medium (Local AST Heuristic)',
      engine: 'Repo X-Ray Local Analysis Engine'
    };
  }

  /**
   * Generate comprehensive technical project explanation
   */
  async explainProject(repoData, model = null) {
    const systemPrompt = `You are Repo X-Ray. Generate a deep-dive technical architecture analysis of this codebase.`;
    const prompt = `Repository: ${repoData.repoName}
Description: ${repoData.description || 'N/A'}
Stats: ${JSON.stringify(repoData.stats)}
Entry Points: ${(repoData.entryPoints || []).join(', ')}

Structure an in-depth technical explanation with sections:
- **Project Overview**
- **Architecture & System Design**
- **Main Features & Capabilities**
- **Entry Points & Execution Flow**
- **Data Layer & State Management**
- **Authentication & Security**
- **External Dependencies & Services**
- **Important Modules & Responsibilities**`;

    if (ollama.isConnected) {
      try {
        const res = await ollama.generate(prompt, systemPrompt, { model, timeout: 30000 });
        if (res && res.response) {
          return {
            content: res.response,
            engine: `Ollama (${res.model})`
          };
        }
      } catch (e) {
        console.warn('Ollama explainProject failed, using structured template:', e.message);
      }
    }

    return {
      content: this.generateProjectExplanationTemplate(repoData),
      engine: 'Repo X-Ray Architecture Synthesizer'
    };
  }

  /**
   * Generate README draft based on repository analysis
   */
  async generateReadme(repoData, model = null) {
    const prompt = `Generate a complete, professional, production-ready README.md for the repository "${repoData.repoName}".
Description: ${repoData.description}
Files: ${repoData.stats?.totalFiles || 0}
Languages: ${JSON.stringify(repoData.stats?.languages || {})}
Dependencies: ${JSON.stringify(repoData.packageInfo?.dependencies || [])}
Scripts: ${JSON.stringify(repoData.packageInfo?.scripts || [])}
Entry points: ${(repoData.entryPoints || []).join(', ')}

Include these exact markdown sections:
# Project Title
> Tagline

## Overview
## Features
## Tech Stack
## Architecture
## Installation
## Configuration
## Usage
## Project Structure
## License`;

    if (ollama.isConnected) {
      try {
        const res = await ollama.generate(prompt, 'You are an expert technical writer and software architect.', { model, timeout: 30000 });
        if (res && res.response) {
          return {
            markdown: res.response,
            engine: `Ollama (${res.model})`
          };
        }
      } catch (e) {
        console.warn('Ollama generateReadme failed, generating structured markdown:', e.message);
      }
    }

    return {
      markdown: this.generateStructuredReadmeTemplate(repoData),
      engine: 'Repo X-Ray Documentation Engine'
    };
  }

  // --- Helper Methods & Local Intelligence ---

  findRelevantFiles(query, repoData) {
    const q = query.toLowerCase();
    const files = repoData.files || [];

    const scored = files.map(f => {
      let score = 0;
      const pathLower = (f.relativePath || f.name).toLowerCase();
      const nameLower = f.name.toLowerCase();

      // Check name tokens
      if (pathLower.includes(q)) score += 10;
      if (nameLower.includes(q)) score += 8;

      const tokens = q.split(/\W+/).filter(t => t.length > 2);
      tokens.forEach(tok => {
        if (pathLower.includes(tok)) score += 3;
        if (f.role && f.role.includes(tok)) score += 2;
        if (f.exports && f.exports.some(e => e.toLowerCase().includes(tok))) score += 4;
        if (f.imports && f.imports.some(i => i.toLowerCase().includes(tok))) score += 2;
      });

      return { file: f, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.filter(s => s.score > 0).map(s => s.file).slice(0, 6);
  }

  buildRepoSummaryContext(repoData, relevantFiles) {
    if (!relevantFiles || relevantFiles.length === 0) {
      return (repoData.files || []).slice(0, 5).map(f => `- ${f.relativePath} (${f.role})`).join('\n');
    }

    return relevantFiles.map(f => {
      const exportsStr = (f.exports || []).slice(0, 5).join(', ');
      const importsStr = (f.imports || []).slice(0, 4).join(', ');
      return `- File: ${f.relativePath} | Role: ${f.role} | Exports: [${exportsStr}] | Imports: [${importsStr}]`;
    }).join('\n');
  }

  extractSymbolsFromFiles(files) {
    const symbols = [];
    files.forEach(f => {
      if (f.exports && Array.isArray(f.exports)) {
        symbols.push(...f.exports.slice(0, 3));
      }
    });
    return [...new Set(symbols)].slice(0, 5);
  }

  generateHeuristicFileExplanation(filePath, codeSnippet, repoContext) {
    const name = filePath.split('/').pop();
    const ext = name.split('.').pop();
    const lower = filePath.toLowerCase();

    let roleDescription = 'Modular utility or functional component';
    if (lower.includes('auth')) roleDescription = 'Authentication & security credential lifecycle coordinator';
    else if (lower.includes('firebase')) roleDescription = 'Cloud database & Firebase service initializer';
    else if (lower.includes('api')) roleDescription = 'REST / HTTP API gateway client and transport layer';
    else if (lower.includes('dash')) roleDescription = 'User telemetry and dashboard metrics visualization view';
    else if (lower.includes('model')) roleDescription = 'Data entity schema definition and persistence interface';
    else if (lower.includes('controller')) roleDescription = 'Request dispatcher, routing controller, and business logic coordinator';
    else if (lower.includes('util') || lower.includes('helper')) roleDescription = 'Pure utility routines and shared helper functions';

    return `### Architectural Role
**${name}** serves as a **${roleDescription}** within the \`${filePath.split('/').slice(0, -1).join('/') || '.'}\` subsystem.

### Key Responsibilities
- Encapsulates modular logic for \`${name.replace(/\.[^/.]+$/, '')}\`.
- Isolates side-effects and maintains clean boundaries with neighboring layers.
- Exposes standardized interfaces consumed by downstream modules.

### Dependencies & Data Flow
- Receives configuration or parameters from parent controllers.
- Interacts with adjacent utilities and services via structured function calls.
- Emits events or returns formatted payloads to UI presentation elements.

### Maintenance & Health Notes
- Keep exported API contracts backwards-compatible when modifying signature parameters.
- Verify error handling and null-checks on asynchronous return promises.`;
  }

  generateHeuristicAnswer(query, relevantFiles, repoData) {
    const fileListStr = relevantFiles.map(f => `\`${f.relativePath || f.name}\``).join(', ');

    if (relevantFiles.length === 0) {
      return {
        answer: `Based on an inspection of **${repoData.repoName || 'this repository'}**, no single file was an exact match for "${query}".

However, the application architecture is organized into:
- **Services & APIs**: Coordinates external communications and authentication.
- **Components & Views**: Handles user interface rendering and state.
- **Utilities & Config**: Manages environment variables and shared transformations.

Try searching for specific filenames like \`auth.js\`, \`Dashboard.js\`, or \`server.js\`.`
      };
    }

    const primary = relevantFiles[0];
    return {
      answer: `Regarding **"${query}"**:

This functionality is primarily anchored in **\`${primary.relativePath || primary.name}\`** (Role: *${primary.role}*).

${primary.exports && primary.exports.length > 0 ? `Key symbols and exported routines include:
${primary.exports.slice(0, 4).map(e => `- \`${e}\``).join('\n')}` : ''}

Related modules involved in this operational flow:
${relevantFiles.slice(1).map(f => `- \`${f.relativePath || f.name}\`: ${f.role} module`).join('\n')}

All data transitions adhere to local modular separation, maintaining isolation across client and backend boundaries.`
    };
  }

  generateProjectExplanationTemplate(repoData) {
    return `# Architecture Deep Dive: ${repoData.repoName}

## 1. Project Overview
**${repoData.repoName}** is a ${repoData.description || 'modern application'} structured as a high-performance, modular system. It contains **${repoData.stats?.totalFiles || 0} files** across **${repoData.stats?.totalDirectories || 0} directories** with **${repoData.stats?.totalDependencies || 0} external dependencies**.

## 2. Architecture & System Design
The application enforces a **unidirectional dependency pattern**:
- **Presentation Layer**: Client-side component classes decoupled from direct database operations.
- **Service Layer**: Dedicated API and Authentication brokers (\`src/services/\`) providing singletons and reactive subscriptions.
- **Backend & Controller Layer**: Request dispatchers and middleware ensuring request validation.
- **Persistence & Cloud**: Managed database integration with isolated configuration files.

## 3. Main Features & Capabilities
- **Decoupled Architecture**: High cohesion, low coupling across UI widgets and backend controllers.
- **Local-First Security**: Zero leakage of sensitive environment variables to client builds.
- **Interactive Telemetry**: Real-time metrics synchronization and structured reporting.

## 4. Key Entry Points
${(repoData.entryPoints || []).map(ep => `- \`${ep}\`: Primary bootstrap and listener initialization`).join('\n')}

## 5. Data Layer & State Management
Persistent data models are segregated in dedicated schemas. State changes flow through observable event listeners to update connected views without tight coupling.

## 6. Authentication & Security
User identity lifecycle is managed through explicit token verification. Endpoints guard against unauthorized access using token bearer headers.`;
  }

  generateStructuredReadmeTemplate(repoData) {
    const name = repoData.repoName || 'Project';
    const desc = repoData.description || 'A modern modular application.';
    const deps = repoData.packageInfo?.dependencies || ['express'];
    const scripts = repoData.packageInfo?.scripts || ['start'];

    return `# ${name}

> ${desc}

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)
[![Local AI Compatible](https://img.shields.io/badge/Ollama-Ready-green.svg)](#local-ai)

---

## Overview
**${name}** is engineered for reliability, modularity, and rapid local iteration. Analyzed and mapped with [Repo X-Ray](https://github.com/).

## Features
- **Clean Service Architecture**: Strict separation of concerns between UI, services, and storage.
- **Reactive State Flow**: Observable patterns for real-time telemetry and user state.
- **Modular Directory Layout**: Easy navigation and low cognitive load for contributors.

## Tech Stack
- **Runtime**: Node.js
${Object.entries(repoData.stats?.languages || {}).map(([lang, count]) => `- **${lang}**: ${count} source files`).join('\n')}
${deps.length > 0 ? `- **Core Dependencies**: ${deps.slice(0, 6).join(', ')}` : ''}

## Architecture
\`\`\`
Client (UI Views) ──> Service Broker (API & Auth) ──> Backend Server ──> Database Engine
\`\`\`

## Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd ${name.toLowerCase().replace(/\s+/g, '-')}

# Install local dependencies
npm install
\`\`\`

## Configuration
Copy the sample environment file and configure variables:
\`\`\`bash
cp .env.example .env
\`\`\`

## Usage
\`\`\`bash
# Run application
${scripts.includes('dev') ? 'npm run dev' : 'npm start'}
\`\`\`

## Project Structure
\`\`\`text
${(repoData.files || []).slice(0, 12).map(f => f.relativePath).join('\n')}
\`\`\`

## License
Distributed under the MIT License. See \`LICENSE\` for more information.
`;
  }
}

module.exports = new AIService();
