/**
 * Repo X-Ray — Frontend Application Controller
 * High-polish vanilla JavaScript client handling state, views, Cytoscape graph,
 * file explorer, AI Q&A chat, impact analysis, health metrics, and Ollama integration.
 */

(function () {
  'use strict';

  // --- State Management ---
  const state = {
    currentRepo: null,
    isDemo: true,
    currentView: 'overview',
    selectedFile: 'src/services/auth.js',
    ollama: {
      connected: false,
      url: 'http://localhost:11434',
      currentModel: 'qwen2.5-coder',
      models: []
    },
    cy: null,
    impactCy: null,
    activeDocsTab: 'deepdive',
    deepDiveContent: '',
    readmeContent: ''
  };

  // --- DOM Element References ---
  const el = {
    // Top Bar
    topRepoName: document.getElementById('top-repo-name'),
    topRepoBranch: document.getElementById('top-repo-branch'),
    topRepoBadge: document.getElementById('top-repo-badge'),
    aiStatusDot: document.getElementById('ai-status-dot'),
    aiStatusText: document.getElementById('ai-status-text'),
    btnOpenAiModal: document.getElementById('btn-open-ai-modal'),
    btnOpenRepoModal: document.getElementById('btn-open-repo-modal'),
    btnQuickScan: document.getElementById('btn-quick-scan'),
    btnLoadDemo: document.getElementById('btn-load-demo'),
    btnBrandHome: document.getElementById('btn-brand-home'),

    // Sidebar
    navItems: document.querySelectorAll('.sidebar-nav .nav-item'),
    sidebarAiDot: document.getElementById('sidebar-ai-dot'),
    sidebarAiLabel: document.getElementById('sidebar-ai-label'),
    btnSidebarConnect: document.getElementById('btn-sidebar-connect'),

    // Views
    viewPanels: document.querySelectorAll('.view-panel'),

    // Overview
    overviewTitle: document.getElementById('overview-repo-title'),
    overviewBadge: document.getElementById('overview-badge'),
    overviewSubtitle: document.getElementById('overview-repo-subtitle'),
    btnHeroExploreArch: document.getElementById('btn-hero-explore-arch'),
    btnHeroAsk: document.getElementById('btn-hero-ask'),
    statFiles: document.getElementById('stat-files'),
    statLines: document.getElementById('stat-lines'),
    statDirs: document.getElementById('stat-dirs'),
    statDeps: document.getElementById('stat-deps'),
    statModules: document.getElementById('stat-modules'),
    overviewFlow: document.getElementById('overview-flow-container'),
    overviewAiInsight: document.getElementById('overview-ai-insight'),
    overviewActivityList: document.getElementById('overview-activity-list'),
    overviewOverallScore: document.getElementById('overview-overall-score'),
    barArchScore: document.getElementById('bar-arch-score'),
    barArchFill: document.getElementById('bar-arch-fill'),
    barMaintScore: document.getElementById('bar-maint-score'),
    barMaintFill: document.getElementById('bar-maint-fill'),
    barDocsScore: document.getElementById('bar-docs-score'),
    barDocsFill: document.getElementById('bar-docs-fill'),
    barSecScore: document.getElementById('bar-sec-score'),
    barSecFill: document.getElementById('bar-sec-fill'),
    btnViewHealthDeepdive: document.getElementById('btn-view-health-deepdive'),

    // Graph View
    graphSearch: document.getElementById('graph-search'),
    graphRoleFilter: document.getElementById('graph-role-filter'),
    graphLayoutSelect: document.getElementById('graph-layout-select'),
    btnGraphFit: document.getElementById('btn-graph-fit'),
    btnGraphReset: document.getElementById('btn-graph-reset'),
    cyContainer: document.getElementById('cy'),
    inspector: document.getElementById('graph-node-inspector'),
    inspectorTitle: document.getElementById('inspector-title'),
    inspectorPath: document.getElementById('inspector-path'),
    inspectorRole: document.getElementById('inspector-role'),
    inspectorStats: document.getElementById('inspector-stats'),
    inspectorImports: document.getElementById('inspector-imports'),
    inspectorUsedBy: document.getElementById('inspector-used-by'),
    inspectorImpactBadge: document.getElementById('inspector-impact-badge'),
    inspectorAiSummary: document.getElementById('inspector-ai-summary'),
    btnInspectorExplain: document.getElementById('btn-inspector-explain'),
    btnInspectorImpact: document.getElementById('btn-inspector-impact'),
    btnInspectorPreview: document.getElementById('btn-inspector-preview'),
    btnCloseInspector: document.getElementById('btn-close-inspector'),

    // Explorer View
    explorerTree: document.getElementById('explorer-tree'),
    explorerFileCount: document.getElementById('explorer-file-count'),
    codeBreadcrumb: document.getElementById('code-breadcrumb'),
    codeDisplay: document.getElementById('code-display'),
    codeAiDrawer: document.getElementById('code-ai-drawer'),
    codeAiToggle: document.getElementById('code-ai-toggle'),
    codeAiArrow: document.getElementById('code-ai-arrow'),
    codeAiContent: document.getElementById('code-ai-content'),
    btnCodeExplain: document.getElementById('btn-code-explain'),
    btnCodeImpact: document.getElementById('btn-code-impact'),

    // AI Chat View
    suggestedPromptsRow: document.getElementById('suggested-prompts-row'),
    chatStream: document.getElementById('chat-stream'),
    chatInput: document.getElementById('chat-input'),
    btnChatSend: document.getElementById('btn-chat-send'),
    chatEngineLabel: document.getElementById('chat-engine-label'),

    // Impact Analysis View
    impactFileSelect: document.getElementById('impact-file-select'),
    btnRunImpact: document.getElementById('btn-run-impact'),
    impactLevelBadge: document.getElementById('impact-level-badge'),
    impactDirectCount: document.getElementById('impact-direct-count'),
    impactTotalCount: document.getElementById('impact-total-count'),
    impactAreasList: document.getElementById('impact-areas-list'),
    impactDependentsList: document.getElementById('impact-dependents-list'),
    impactRecommendationsList: document.getElementById('impact-recommendations-list'),
    impactSubgraph: document.getElementById('impact-subgraph'),

    // Health View
    healthOverallScore: document.getElementById('health-overall-score'),
    healthScoreArch: document.getElementById('health-score-arch'),
    healthSummaryArch: document.getElementById('health-summary-arch'),
    healthSignalsArch: document.getElementById('health-signals-arch'),
    healthScoreMaint: document.getElementById('health-score-maint'),
    healthSummaryMaint: document.getElementById('health-summary-maint'),
    healthSignalsMaint: document.getElementById('health-signals-maint'),
    healthScoreDocs: document.getElementById('health-score-docs'),
    healthSummaryDocs: document.getElementById('health-summary-docs'),
    healthSignalsDocs: document.getElementById('health-signals-docs'),
    healthScoreSec: document.getElementById('health-score-sec'),
    healthSummarySec: document.getElementById('health-summary-sec'),
    healthSignalsSec: document.getElementById('health-signals-sec'),
    healthPriorityRecs: document.getElementById('health-priority-recs'),

    // Docs View
    docsPreviewArea: document.getElementById('docs-preview-area'),
    btnDocsExplainProject: document.getElementById('btn-docs-explain-project'),
    btnDocsGenerateReadme: document.getElementById('btn-docs-generate-readme'),
    btnDocsCopyMd: document.getElementById('btn-docs-copy-md'),
    btnSubtabDeepdive: document.getElementById('btn-subtab-deepdive'),
    btnSubtabReadme: document.getElementById('btn-subtab-readme'),

    // Modals
    modalAi: document.getElementById('modal-ai-connection'),
    btnCloseAiModal: document.getElementById('btn-close-ai-modal'),
    btnCancelAiModal: document.getElementById('btn-cancel-ai-modal'),
    btnSaveAiConnection: document.getElementById('btn-save-ai-connection'),
    btnTestOllama: document.getElementById('btn-test-ollama'),
    inputOllamaUrl: document.getElementById('input-ollama-url'),
    selectOllamaModel: document.getElementById('select-ollama-model'),
    modalAiStatusDot: document.getElementById('modal-ai-status-dot'),
    modalAiStatusText: document.getElementById('modal-ai-status-text'),

    modalScan: document.getElementById('modal-scan-repo'),
    btnCloseScanModal: document.getElementById('btn-close-scan-modal'),
    btnCancelScanModal: document.getElementById('btn-cancel-scan-modal'),
    inputRepoPath: document.getElementById('input-repo-path'),
    btnSetCurrentRepo: document.getElementById('btn-set-current-repo'),
    btnSetDemoRepo: document.getElementById('btn-set-demo-repo'),
    btnStartScan: document.getElementById('btn-start-scan'),

    // Welcome Screen
    welcomeScreen: document.getElementById('welcome-screen'),
    welcomeBtnConnectAi: document.getElementById('welcome-btn-connect-ai'),
    welcomeBtnExploreDemo: document.getElementById('welcome-btn-explore-demo'),

    // Scanning Overlay
    scanOverlay: document.getElementById('scan-progress-overlay'),
    scanSubtext: document.getElementById('scan-progress-subtext'),
    stepReading: document.getElementById('step-reading'),
    stepGraph: document.getElementById('step-graph'),
    stepArch: document.getElementById('step-arch'),
    stepAi: document.getElementById('step-ai'),

    // Toast
    toastContainer: document.getElementById('toast-container')
  };

  // ==========================================================================
  // Initialization
  // ==========================================================================

  async function init() {
    bindEvents();
    checkOllamaConnection();
    await loadDemoRepository();

    // Check first visit preference (allow dismiss)
    const hasVisited = localStorage.getItem('repo_xray_visited');
    if (!hasVisited) {
      el.welcomeScreen.classList.add('active');
    }
  }

  // ==========================================================================
  // Event Listeners
  // ==========================================================================

  function bindEvents() {
    // Navigation
    el.navItems.forEach(item => {
      item.addEventListener('click', () => {
        const viewId = item.getAttribute('data-view');
        switchView(viewId);
      });
    });

    // Top Bar quick actions
    el.btnBrandHome.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('overview');
    });

    el.btnLoadDemo.addEventListener('click', () => {
      loadDemoRepository();
      showToast('Loaded Stipo Demo Repository');
    });

    el.btnQuickScan.addEventListener('click', () => {
      openModal(el.modalScan);
    });

    el.btnOpenRepoModal.addEventListener('click', () => {
      openModal(el.modalScan);
    });

    el.btnOpenAiModal.addEventListener('click', () => {
      openModal(el.modalAi);
    });

    el.btnSidebarConnect.addEventListener('click', () => {
      openModal(el.modalAi);
    });

    // Hero buttons
    el.btnHeroExploreArch.addEventListener('click', () => switchView('architecture'));
    el.btnHeroAsk.addEventListener('click', () => switchView('ai-analysis'));
    el.btnViewHealthDeepdive.addEventListener('click', () => switchView('health'));

    // Welcome screen CTAs
    el.welcomeBtnExploreDemo.addEventListener('click', () => {
      el.welcomeScreen.classList.remove('active');
      localStorage.setItem('repo_xray_visited', 'true');
      loadDemoRepository();
    });

    el.welcomeBtnConnectAi.addEventListener('click', () => {
      el.welcomeScreen.classList.remove('active');
      localStorage.setItem('repo_xray_visited', 'true');
      openModal(el.modalAi);
    });

    // Modals Close/Cancel
    el.btnCloseAiModal.addEventListener('click', () => closeModal(el.modalAi));
    el.btnCancelAiModal.addEventListener('click', () => closeModal(el.modalAi));
    el.btnCloseScanModal.addEventListener('click', () => closeModal(el.modalScan));
    el.btnCancelScanModal.addEventListener('click', () => closeModal(el.modalScan));

    // Ollama Modal Actions
    el.btnTestOllama.addEventListener('click', testOllamaConnectionInModal);
    el.btnSaveAiConnection.addEventListener('click', saveAiConnection);

    // Repo Scan Actions
    el.btnSetCurrentRepo.addEventListener('click', () => {
      el.inputRepoPath.value = 'c:\\Users\\ADMIN\\Desktop\\Repo X-Ray';
    });

    el.btnSetDemoRepo.addEventListener('click', () => {
      closeModal(el.modalScan);
      loadDemoRepository();
      showToast('Loaded Stipo Demo Repository');
    });

    el.btnStartScan.addEventListener('click', executeLocalRepoScan);

    // Graph Toolbar
    el.graphSearch.addEventListener('input', handleGraphSearch);
    el.graphRoleFilter.addEventListener('change', handleGraphRoleFilter);
    el.graphLayoutSelect.addEventListener('change', handleGraphLayoutChange);
    el.btnGraphFit.addEventListener('click', () => state.cy && state.cy.fit(null, 40));
    el.btnGraphReset.addEventListener('click', () => state.cy && state.cy.reset());

    // Graph Inspector
    el.btnCloseInspector.addEventListener('click', () => {
      el.inspector.classList.add('hidden');
    });
    el.btnInspectorExplain.addEventListener('click', explainInspectorFile);
    el.btnInspectorImpact.addEventListener('click', () => {
      if (state.selectedFile) {
        el.impactFileSelect.value = state.selectedFile;
        switchView('impact');
        runImpactAnalysis(state.selectedFile);
      }
    });
    el.btnInspectorPreview.addEventListener('click', () => {
      if (state.selectedFile) {
        switchView('explorer');
        openFileInExplorer(state.selectedFile);
      }
    });

    // Explorer AI Drawer toggle
    el.codeAiToggle.addEventListener('click', () => {
      el.codeAiDrawer.classList.toggle('collapsed');
      el.codeAiArrow.textContent = el.codeAiDrawer.classList.contains('collapsed') ? '▼' : '▲';
    });

    el.btnCodeExplain.addEventListener('click', explainActiveExplorerFile);
    el.btnCodeImpact.addEventListener('click', () => {
      if (state.selectedFile) {
        el.impactFileSelect.value = state.selectedFile;
        switchView('impact');
        runImpactAnalysis(state.selectedFile);
      }
    });

    // AI Chat
    el.suggestedPromptsRow.addEventListener('click', (e) => {
      const chip = e.target.closest('.question-chip');
      if (chip) {
        const question = chip.getAttribute('data-q');
        el.chatInput.value = question;
        submitChatQuestion(question);
      }
    });

    el.btnChatSend.addEventListener('click', () => {
      const q = el.chatInput.value.trim();
      if (q) submitChatQuestion(q);
    });

    el.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const q = el.chatInput.value.trim();
        if (q) submitChatQuestion(q);
      }
    });

    // Impact Analysis
    el.btnRunImpact.addEventListener('click', () => {
      const target = el.impactFileSelect.value;
      if (target) runImpactAnalysis(target);
    });

    // Docs View Actions
    el.btnDocsExplainProject.addEventListener('click', generateProjectDeepDive);
    el.btnDocsGenerateReadme.addEventListener('click', generateReadmeDraft);
    el.btnDocsCopyMd.addEventListener('click', copyCurrentMarkdown);
    el.btnSubtabDeepdive.addEventListener('click', () => setDocsTab('deepdive'));
    el.btnSubtabReadme.addEventListener('click', () => setDocsTab('readme'));
  }

  // ==========================================================================
  // View Routing
  // ==========================================================================

  function switchView(viewId) {
    state.currentView = viewId;

    // Update sidebar navigation
    el.navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update visible view panel
    el.viewPanels.forEach(panel => {
      if (panel.id === `view-${viewId}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // View-specific initialization / resize triggers
    if (viewId === 'architecture') {
      setTimeout(() => {
        if (state.cy) {
          state.cy.resize();
          state.cy.fit(null, 40);
        } else {
          initArchitectureGraph();
        }
      }, 50);
    } else if (viewId === 'impact') {
      setTimeout(() => {
        if (state.impactCy) {
          state.impactCy.resize();
          state.impactCy.fit(null, 30);
        } else {
          runImpactAnalysis(state.selectedFile || 'src/services/auth.js');
        }
      }, 50);
    } else if (viewId === 'docs') {
      if (!state.deepDiveContent && !state.readmeContent) {
        generateProjectDeepDive();
      }
    }
  }

  // ==========================================================================
  // Ollama Connection Service
  // ==========================================================================

  async function checkOllamaConnection() {
    try {
      const res = await fetch('/api/ollama/status');
      const data = await res.json();

      if (data.connected) {
        state.ollama.connected = true;
        state.ollama.url = data.url;
        state.ollama.currentModel = data.currentModel || 'qwen2.5-coder';
        state.ollama.models = data.models || [];
        updateOllamaUI(true);
      } else {
        state.ollama.connected = false;
        updateOllamaUI(false, data.error);
      }
    } catch (e) {
      state.ollama.connected = false;
      updateOllamaUI(false, 'Local Ollama not reachable');
    }
  }

  function updateOllamaUI(isOnline, message = '') {
    if (isOnline) {
      el.aiStatusDot.className = 'status-dot online';
      el.aiStatusText.textContent = `LOCAL AI: ${state.ollama.currentModel}`;
      el.sidebarAiDot.className = 'status-dot online';
      el.sidebarAiLabel.textContent = `Ollama (${state.ollama.currentModel})`;
      el.btnSidebarConnect.textContent = 'Configure';
      el.chatEngineLabel.textContent = `Ollama (${state.ollama.currentModel})`;
    } else {
      el.aiStatusDot.className = 'status-dot offline';
      el.aiStatusText.textContent = 'LOCAL AI: Offline';
      el.sidebarAiDot.className = 'status-dot offline';
      el.sidebarAiLabel.textContent = 'Ollama Offline';
      el.btnSidebarConnect.textContent = 'Connect Ollama';
      el.chatEngineLabel.textContent = 'Local Heuristic Engine';
    }
  }

  async function testOllamaConnectionInModal() {
    const url = el.inputOllamaUrl.value.trim() || 'http://localhost:11434';
    el.modalAiStatusDot.className = 'status-dot connecting';
    el.modalAiStatusText.textContent = 'Connecting to Ollama...';

    try {
      const res = await fetch('/api/ollama/status');
      const data = await res.json();

      if (data.connected) {
        el.modalAiStatusDot.className = 'status-dot online';
        el.modalAiStatusText.textContent = `Connected ✓ (${data.models.length} models installed)`;

        // Populate model dropdown
        if (data.models.length > 0) {
          el.selectOllamaModel.innerHTML = '';
          data.models.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.name;
            opt.textContent = m.name;
            if (m.name.includes('qwen') || m.name.includes('coder')) opt.selected = true;
            el.selectOllamaModel.appendChild(opt);
          });
        }
      } else {
        el.modalAiStatusDot.className = 'status-dot offline';
        el.modalAiStatusText.textContent = data.error || 'Ollama unavailable. Run "ollama serve".';
      }
    } catch (err) {
      el.modalAiStatusDot.className = 'status-dot offline';
      el.modalAiStatusText.textContent = 'Ollama unavailable at ' + url;
    }
  }

  async function saveAiConnection() {
    const url = el.inputOllamaUrl.value.trim();
    const model = el.selectOllamaModel.value;

    try {
      const res = await fetch('/api/ollama/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, model })
      });
      const data = await res.json();

      if (data.connected) {
        state.ollama.connected = true;
        state.ollama.url = url;
        state.ollama.currentModel = model;
        updateOllamaUI(true);
        closeModal(el.modalAi);
        showToast(`Connected to Ollama (${model})`);
      } else {
        showToast(data.error || 'Could not connect to Ollama', 'warning');
      }
    } catch (e) {
      showToast('Connection failed: ' + e.message, 'warning');
    }
  }

  // ==========================================================================
  // Repository Loading & Scanning
  // ==========================================================================

  async function loadDemoRepository() {
    try {
      const res = await fetch('/api/demo/repository');
      const data = await res.json();
      applyRepositoryData(data, true);
    } catch (err) {
      console.error('Failed to load demo repo:', err);
      showToast('Could not load demo dataset', 'error');
    }
  }

  async function executeLocalRepoScan() {
    const repoPath = el.inputRepoPath.value.trim();
    if (!repoPath) {
      showToast('Please specify a repository path', 'warning');
      return;
    }

    closeModal(el.modalScan);
    showScanProgress(true);

    try {
      // Step 1: Reading files
      setScanStep(1, 'Reading filesystem and parsing file manifests...');
      await sleep(350);

      // Step 2: Building graph
      setScanStep(2, 'Tracing imports, exports, and module relationships...');
      await sleep(300);

      // API request
      const res = await fetch('/api/repository/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoPath })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Scan failed');
      }

      const scanResult = await res.json();

      // Step 3: Analyzing architecture
      setScanStep(3, 'Calculating dependency depth and coupling metrics...');
      await sleep(300);

      // Step 4: Preparing AI context
      setScanStep(4, 'Indexing symbols for local AI queries...');
      await sleep(250);

      showScanProgress(false);
      applyRepositoryData(scanResult, false);
      showToast(`Scanned ${scanResult.stats.totalFiles} files in ${scanResult.scanDurationMs}ms`);
      switchView('overview');
    } catch (err) {
      showScanProgress(false);
      showToast(err.message, 'error');
    }
  }

  function applyRepositoryData(data, isDemo = false) {
    state.currentRepo = data;
    state.isDemo = isDemo;

    // Top Header info
    el.topRepoName.textContent = data.repoName || 'Repository';
    el.topRepoBranch.textContent = data.branch || 'main';
    if (isDemo) {
      el.topRepoBadge.textContent = 'Demo Repository';
      el.topRepoBadge.style.display = 'inline-block';
      el.overviewBadge.textContent = 'Demo Repository';
      el.overviewBadge.style.display = 'inline-block';
    } else {
      el.topRepoBadge.textContent = 'Local Workspace';
      el.topRepoBadge.style.display = 'inline-block';
      el.overviewBadge.textContent = 'Local Workspace';
      el.overviewBadge.style.display = 'inline-block';
    }

    // Overview Hero
    el.overviewTitle.textContent = data.repoName || 'Repository';
    el.overviewSubtitle.textContent = data.description || 'Local codebase analyzed with Repo X-Ray.';

    // Overview Stats
    const stats = data.stats || {};
    el.statFiles.textContent = stats.totalFiles || data.files?.length || 0;
    el.statLines.textContent = `${(stats.totalLines || 0).toLocaleString()} LOC indexed`;
    el.statDirs.textContent = stats.totalDirectories || data.directories?.length || 0;
    el.statDeps.textContent = stats.totalDependencies || 0;
    el.statModules.textContent = stats.totalModules || 0;

    // Flow & AI Insight
    if (data.architectureSummary) {
      const parts = data.architectureSummary.split('→').map(p => p.trim());
      el.overviewFlow.innerHTML = parts.map((part, idx) => `
        <span class="flow-node">${escapeHtml(part)}</span>
        ${idx < parts.length - 1 ? '<span class="flow-arrow">→</span>' : ''}
      `).join('');
    } else {
      el.overviewFlow.innerHTML = `
        <span class="flow-node">Client Modules</span>
        <span class="flow-arrow">→</span>
        <span class="flow-node">Service Controllers</span>
        <span class="flow-arrow">→</span>
        <span class="flow-node">Data Models</span>
      `;
    }

    if (data.aiInsight) {
      el.overviewAiInsight.textContent = data.aiInsight;
    } else {
      el.overviewAiInsight.textContent = `${data.repoName} contains ${stats.totalFiles || 0} files. Analyzed locally with safe regex AST parsing and dependency tracing.`;
    }

    // Health overview
    const health = data.health || {};
    const overall = health.overallScore || 77;
    el.overviewOverallScore.textContent = `Overall ${overall}/100`;
    el.healthOverallScore.textContent = overall;

    const cats = health.categories || {};
    if (cats.architecture) {
      el.barArchScore.textContent = cats.architecture.score;
      el.barArchFill.style.width = cats.architecture.score + '%';
      el.healthScoreArch.textContent = `${cats.architecture.score}/100`;
      el.healthSummaryArch.textContent = cats.architecture.summary;
      renderSignals(el.healthSignalsArch, cats.architecture.signals);
    }
    if (cats.maintainability) {
      el.barMaintScore.textContent = cats.maintainability.score;
      el.barMaintFill.style.width = cats.maintainability.score + '%';
      el.healthScoreMaint.textContent = `${cats.maintainability.score}/100`;
      el.healthSummaryMaint.textContent = cats.maintainability.summary;
      renderSignals(el.healthSignalsMaint, cats.maintainability.signals);
    }
    if (cats.documentation) {
      el.barDocsScore.textContent = cats.documentation.score;
      el.barDocsFill.style.width = cats.documentation.score + '%';
      el.healthScoreDocs.textContent = `${cats.documentation.score}/100`;
      el.healthSummaryDocs.textContent = cats.documentation.summary;
      renderSignals(el.healthSignalsDocs, cats.documentation.signals);
    }
    if (cats.security) {
      el.barSecScore.textContent = cats.security.score;
      el.barSecFill.style.width = cats.security.score + '%';
      el.healthScoreSec.textContent = `${cats.security.score}/100`;
      el.healthSummarySec.textContent = cats.security.summary;
      renderSignals(el.healthSignalsSec, cats.security.signals);
    }

    // Populate Health Priority Recommendations
    renderHealthRecommendations(cats);

    // Populate File Selectors
    populateImpactFileSelector(data.files || []);

    // Build Explorer Tree
    renderExplorerTree(data.files || []);

    // Re-initialize Architecture Graph if active or ready
    if (state.cy) {
      state.cy.destroy();
      state.cy = null;
    }
    if (state.currentView === 'architecture') {
      initArchitectureGraph();
    }

    // Reset Docs cached content
    state.deepDiveContent = '';
    state.readmeContent = '';

    // Select initial file
    const initial = (data.files && data.files[0]?.relativePath) || 'src/services/auth.js';
    state.selectedFile = initial;
    openFileInExplorer(initial);
  }

  function renderSignals(targetEl, signals = []) {
    if (!targetEl) return;
    targetEl.innerHTML = signals.map(s => `
      <div class="signal-row ${s.type}">
        <span>${s.type === 'pass' ? '✓' : '⚠'}</span>
        <span>${escapeHtml(s.text)}</span>
      </div>
    `).join('');
  }

  function renderHealthRecommendations(cats) {
    const recs = [];
    Object.values(cats).forEach(cat => {
      if (cat.recommendation) {
        recs.push(`
          <div style="background:var(--bg-surface-elevated); padding:10px 14px; border-radius:var(--radius-md); border-left:3px solid var(--accent-primary);">
            <strong style="color:var(--text-primary); font-size:12px; display:block; margin-bottom:2px;">${escapeHtml(cat.name)}:</strong>
            ${escapeHtml(cat.recommendation)}
          </div>
        `);
      }
    });
    el.healthPriorityRecs.innerHTML = recs.join('');
  }

  // ==========================================================================
  // Architecture Graph (Cytoscape.js)
  // ==========================================================================

  function initArchitectureGraph() {
    if (!window.cytoscape) {
      console.error('Cytoscape library not loaded');
      return;
    }

    const graphData = state.currentRepo?.graph || { nodes: [], edges: [] };
    const elements = [...graphData.nodes, ...graphData.edges];

    state.cy = window.cytoscape({
      container: el.cyContainer,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'font-family': 'var(--font-sans)',
            'font-size': '11px',
            'color': '#cbd5e1',
            'text-valign': 'bottom',
            'text-margin-y': 5,
            'background-color': '#475569',
            'border-width': 1.5,
            'border-color': '#1e293b',
            'width': 28,
            'height': 28,
            'transition-property': 'background-color, border-color, border-width',
            'transition-duration': '0.15s'
          }
        },
        {
          selector: 'node[role = "service"]',
          style: { 'background-color': '#3b82f6', 'border-color': '#1d4ed8' }
        },
        {
          selector: 'node[role = "component"]',
          style: { 'background-color': '#10b981', 'border-color': '#047857' }
        },
        {
          selector: 'node[role = "controller"]',
          style: { 'background-color': '#f59e0b', 'border-color': '#b45309' }
        },
        {
          selector: 'node[role = "model"]',
          style: { 'background-color': '#8b5cf6', 'border-color': '#6d28d9' }
        },
        {
          selector: 'node[role = "util"]',
          style: { 'background-color': '#0ea5e9', 'border-color': '#0284c7' }
        },
        {
          selector: 'node[role = "config"]',
          style: { 'background-color': '#64748b', 'border-color': '#334155' }
        },
        {
          selector: 'node:selected',
          style: {
            'border-color': '#ffffff',
            'border-width': 3,
            'shadow-blur': 12,
            'shadow-color': 'rgba(255, 255, 255, 0.4)'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#283347',
            'target-arrow-color': '#3a4b66',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 0.8
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': '#3b82f6',
            'target-arrow-color': '#3b82f6',
            'width': 2.5
          }
        }
      ],
      layout: {
        name: el.graphLayoutSelect.value || 'cose',
        animate: false,
        padding: 50
      }
    });

    // Node click handler -> Open Inspector
    state.cy.on('tap', 'node', function (evt) {
      const node = evt.target;
      inspectGraphNode(node.data());
    });

    // Background click -> Deselect
    state.cy.on('tap', function (evt) {
      if (evt.target === state.cy) {
        // clicked background
      }
    });

    state.cy.fit(null, 40);
  }

  function inspectGraphNode(nodeData) {
    state.selectedFile = nodeData.id || nodeData.path;

    el.inspector.classList.remove('hidden');
    el.inspectorTitle.textContent = nodeData.label || nodeData.id;
    el.inspectorPath.textContent = nodeData.path || nodeData.id;
    el.inspectorRole.textContent = (nodeData.role || 'module').toUpperCase();
    el.inspectorStats.textContent = `${nodeData.lines || 100} lines • ${Math.round((nodeData.size || 2048) / 1024 * 10) / 10} KB`;

    // Calculate consumers and dependencies
    const outgoing = [];
    const incoming = [];

    if (state.cy) {
      const node = state.cy.getElementById(nodeData.id);
      if (node.length) {
        node.outgoers('edge').forEach(e => {
          outgoing.push(e.data('target').split('/').pop());
        });
        node.incomers('edge').forEach(e => {
          incoming.push(e.data('source').split('/').pop());
        });
      }
    }

    el.inspectorImports.innerHTML = outgoing.length > 0
      ? outgoing.map(f => `<span class="chip" data-node="${escapeHtml(f)}" title="Click to inspect">${escapeHtml(f)}</span>`).join('')
      : '<span style="font-size:11px; color:var(--text-muted);">None</span>';

    el.inspectorUsedBy.innerHTML = incoming.length > 0
      ? incoming.map(f => `<span class="chip" data-node="${escapeHtml(f)}" title="Click to inspect">${escapeHtml(f)}</span>`).join('')
      : '<span style="font-size:11px; color:var(--text-muted);">Leaf node (no internal consumers)</span>';

    // Click on dependency chips to jump in graph
    const bindChipJump = (container) => {
      container.querySelectorAll('.chip[data-node]').forEach(chip => {
        chip.addEventListener('click', () => {
          const name = chip.getAttribute('data-node');
          if (state.cy) {
            const match = state.cy.nodes().filter(n => (n.data('label') === name || n.data('id').endsWith('/' + name) || n.data('id') === name));
            if (match.length > 0) {
              state.cy.center(match[0]);
              state.cy.nodes().unselect();
              match[0].select();
              inspectGraphNode(match[0].data());
            }
          }
        });
      });
    };
    bindChipJump(el.inspectorImports);
    bindChipJump(el.inspectorUsedBy);

    // Impact level
    const isHigh = incoming.length >= 4 || nodeData.id.includes('auth') || nodeData.id.includes('firebase');
    const isMed = incoming.length >= 2;
    el.inspectorImpactBadge.className = `impact-level-pill ${isHigh ? 'high' : (isMed ? 'medium' : 'low')}`;
    el.inspectorImpactBadge.textContent = isHigh ? 'HIGH IMPACT' : (isMed ? 'MEDIUM IMPACT' : 'LOW IMPACT');

    el.inspectorAiSummary.textContent = `Encapsulates ${nodeData.role || 'modular'} logic for ${nodeData.label}. Consumed by ${incoming.length} dependent module(s).`;
  }

  function handleGraphSearch(e) {
    if (!state.cy) return;
    const term = e.target.value.toLowerCase().trim();
    if (!term) {
      state.cy.elements().removeClass('faded');
      return;
    }

    state.cy.batch(() => {
      state.cy.elements().addClass('faded');
      const matches = state.cy.nodes().filter(n => {
        return (n.data('label') || '').toLowerCase().includes(term) || (n.data('id') || '').toLowerCase().includes(term);
      });
      matches.removeClass('faded');
      matches.connectedEdges().removeClass('faded');
      if (matches.length > 0) {
        state.cy.center(matches[0]);
      }
    });
  }

  function handleGraphRoleFilter(e) {
    if (!state.cy) return;
    const role = e.target.value;
    if (role === 'all') {
      state.cy.nodes().show();
      state.cy.edges().show();
    } else {
      state.cy.nodes().forEach(n => {
        if (n.data('role') === role) {
          n.show();
        } else {
          n.hide();
        }
      });
      state.cy.edges().forEach(e => {
        if (e.source().visible() && e.target().visible()) {
          e.show();
        } else {
          e.hide();
        }
      });
    }
  }

  function handleGraphLayoutChange(e) {
    if (!state.cy) return;
    const layoutName = e.target.value;
    state.cy.layout({
      name: layoutName,
      animate: true,
      animationDuration: 400,
      padding: 40
    }).run();
  }

  // ==========================================================================
  // Project Explorer View
  // ==========================================================================

  function renderExplorerTree(files = []) {
    el.explorerFileCount.textContent = `${files.length} files`;
    if (!files.length) {
      el.explorerTree.innerHTML = '<div style="padding:12px; font-size:12px; color:var(--text-muted);">No files detected.</div>';
      return;
    }

    // Group files by directory
    const tree = {};
    files.forEach(f => {
      const parts = f.relativePath.split('/');
      let current = tree;
      for (let i = 0; i < parts.length - 1; i++) {
        const dir = parts[i];
        if (!current[dir]) current[dir] = { __isDir: true, __children: {} };
        current = current[dir].__children;
      }
      const fileName = parts[parts.length - 1];
      current[fileName] = { __isDir: false, file: f };
    });

    el.explorerTree.innerHTML = buildTreeHtml(tree);

    // Bind click events on tree items
    el.explorerTree.querySelectorAll('.tree-node[data-path]').forEach(nodeEl => {
      nodeEl.addEventListener('click', () => {
        el.explorerTree.querySelectorAll('.tree-node').forEach(n => n.classList.remove('active'));
        nodeEl.classList.add('active');
        const filePath = nodeEl.getAttribute('data-path');
        openFileInExplorer(filePath);
      });
    });
  }

  function buildTreeHtml(node, depth = 0) {
    let html = '';
    const indent = depth * 12;

    const entries = Object.keys(node).sort((a, b) => {
      const aIsDir = node[a].__isDir;
      const bIsDir = node[b].__isDir;
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });

    entries.forEach(name => {
      const item = node[name];
      if (item.__isDir) {
        html += `
          <div class="tree-node" style="padding-left: ${indent + 8}px; font-weight:600; color:var(--text-secondary);">
            <svg class="tree-node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>${escapeHtml(name)}</span>
          </div>
          ${buildTreeHtml(item.__children, depth + 1)}
        `;
      } else {
        const f = item.file;
        const iconSvg = getFileIconSvg(f.extension);
        html += `
          <div class="tree-node" data-path="${escapeHtml(f.relativePath)}" style="padding-left: ${indent + 12}px;">
            ${iconSvg}
            <span>${escapeHtml(name)}</span>
          </div>
        `;
      }
    });

    return html;
  }

  async function openFileInExplorer(filePath) {
    state.selectedFile = filePath;

    // Update Breadcrumb
    const parts = filePath.split('/');
    el.codeBreadcrumb.innerHTML = parts.map((p, idx) => {
      const isLast = idx === parts.length - 1;
      return `<span>${escapeHtml(p)}</span>${!isLast ? '<span style="color:var(--text-muted);">/</span>' : ''}`;
    }).join(' ');

    // Fetch file content
    try {
      const res = await fetch('/api/repository/file-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoPath: state.currentRepo?.repoPath,
          filePath,
          isDemo: state.isDemo
        })
      });

      if (!res.ok) throw new Error('File preview failed');
      const data = await res.json();

      el.codeDisplay.textContent = data.content;
      el.codeDisplay.className = `language-${getPrismLanguage(filePath)}`;
      if (window.Prism) {
        window.Prism.highlightElement(el.codeDisplay);
      }
    } catch (e) {
      el.codeDisplay.textContent = `// Could not load content for ${filePath}\n// ${e.message}`;
    }

    // Reset AI drawer preview
    el.codeAiContent.innerHTML = `Click <strong>"Explain File"</strong> to perform an AI-powered architectural inspection of <code>${escapeHtml(filePath)}</code>.`;
  }

  async function explainActiveExplorerFile() {
    if (!state.selectedFile) return;
    el.codeAiDrawer.classList.remove('collapsed');
    el.codeAiArrow.textContent = '▲';
    el.codeAiContent.innerHTML = '<em>Analyzing code structure with local AI...</em>';

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: state.selectedFile,
          codeSnippet: el.codeDisplay.textContent,
          model: state.ollama.currentModel
        })
      });

      const data = await res.json();
      el.codeAiContent.innerHTML = `
        <div style="font-size:11px; color:var(--text-muted); margin-bottom:6px;">Engine: ${escapeHtml(data.engine || 'Local AI')}</div>
        <div>${renderMarkdownHtml(data.explanation || 'No explanation generated.')}</div>
      `;
    } catch (err) {
      el.codeAiContent.innerHTML = `<span style="color:var(--color-danger);">Analysis failed: ${escapeHtml(err.message)}</span>`;
    }
  }

  async function explainInspectorFile() {
    if (!state.selectedFile) return;
    switchView('explorer');
    await openFileInExplorer(state.selectedFile);
    explainActiveExplorerFile();
  }

  // ==========================================================================
  // AI Codebase Chat ("Ask your codebase")
  // ==========================================================================

  async function submitChatQuestion(question) {
    if (!question) return;

    // Append user message
    appendChatMessage('user', question);
    el.chatInput.value = '';

    // Append AI loading bubble
    const loadingId = 'ai-loading-' + Date.now();
    appendChatLoading(loadingId);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          repoData: state.currentRepo,
          model: state.ollama.currentModel
        })
      });

      const data = await res.json();
      removeChatLoading(loadingId);

      appendChatAnswer(data);
    } catch (e) {
      removeChatLoading(loadingId);
      appendChatMessage('ai', `I encountered an error querying the codebase: ${e.message}`, 'Error');
    }
  }

  function appendChatMessage(type, text, senderLabel = null) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${type}-msg`;

    const label = senderLabel || (type === 'user' ? 'Developer' : 'Repo X-Ray Intelligence');
    bubble.innerHTML = `
      <div class="chat-msg-header">
        <span>${escapeHtml(label)}</span>
        <span>Just now</span>
      </div>
      <div class="chat-msg-body">
        ${escapeHtml(text)}
      </div>
    `;

    el.chatStream.appendChild(bubble);
    el.chatStream.scrollTop = el.chatStream.scrollHeight;
  }

  function appendChatLoading(id) {
    const bubble = document.createElement('div');
    bubble.id = id;
    bubble.className = 'chat-bubble ai-msg';
    bubble.innerHTML = `
      <div class="chat-msg-header">
        <span>Repo X-Ray Intelligence</span>
        <span>Local Processing</span>
      </div>
      <div class="chat-msg-body" style="color:var(--text-secondary); font-style:italic;">
        Analyzing codebase context & tracing relevant modules...
      </div>
    `;
    el.chatStream.appendChild(bubble);
    el.chatStream.scrollTop = el.chatStream.scrollHeight;
  }

  function removeChatLoading(id) {
    const elLoad = document.getElementById(id);
    if (elLoad) elLoad.remove();
  }

  function appendChatAnswer(data) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble ai-msg';

    const relatedFilesHtml = (data.relatedFiles || []).length > 0 ? `
      <div class="chat-references-row">
        <span class="inspector-label">Referenced Files (Click to inspect):</span>
        <div class="chip-list">
          ${data.relatedFiles.map(f => `<span class="chip chat-file-link" data-file="${escapeHtml(f)}">${escapeHtml(f)}</span>`).join('')}
        </div>
      </div>
    ` : '';

    const symbolsHtml = (data.relevantSymbols || []).length > 0 ? `
      <div style="margin-top:6px; font-size:11px; color:var(--text-muted);">
        Symbols: ${data.relevantSymbols.map(s => `<code>${escapeHtml(s)}</code>`).join(' ')}
      </div>
    ` : '';

    bubble.innerHTML = `
      <div class="chat-msg-header">
        <span>${escapeHtml(data.engine || 'Repo X-Ray Intelligence')}</span>
        <span>${escapeHtml(data.confidence || 'Local AST Match')}</span>
      </div>
      <div class="chat-msg-body">
        ${renderMarkdownHtml(data.answer)}
      </div>
      ${relatedFilesHtml}
      ${symbolsHtml}
    `;

    // Make file chips clickable
    bubble.querySelectorAll('.chat-file-link').forEach(chip => {
      chip.addEventListener('click', () => {
        const targetFile = chip.getAttribute('data-file');
        switchView('explorer');
        openFileInExplorer(targetFile);
      });
    });

    el.chatStream.appendChild(bubble);
    el.chatStream.scrollTop = el.chatStream.scrollHeight;
  }

  // ==========================================================================
  // Impact Analysis View
  // ==========================================================================

  function populateImpactFileSelector(files = []) {
    el.impactFileSelect.innerHTML = '';
    files.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.relativePath;
      opt.textContent = `${f.relativePath} (${f.role})`;
      if (f.relativePath === 'src/services/auth.js') opt.selected = true;
      el.impactFileSelect.appendChild(opt);
    });
  }

  async function runImpactAnalysis(targetFile) {
    if (!targetFile) return;

    try {
      const res = await fetch('/api/ai/impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: targetFile,
          graphData: state.currentRepo?.graph,
          filesList: state.currentRepo?.files
        })
      });

      const data = await res.json();
      renderImpactResults(data);
    } catch (err) {
      showToast('Impact analysis error: ' + err.message, 'error');
    }
  }

  function renderImpactResults(data) {
    // Impact level badge
    el.impactLevelBadge.className = `impact-level-pill ${data.impactLevel.toLowerCase()}`;
    el.impactLevelBadge.textContent = data.impactLevel;

    // Counts
    el.impactDirectCount.textContent = data.stats.directDependentsCount;
    el.impactTotalCount.textContent = data.stats.totalAffectedFilesCount;

    // Affected areas
    el.impactAreasList.innerHTML = (data.affectedAreas || []).map(area => `
      <span class="chip" style="color:var(--text-primary); font-weight:500;">${escapeHtml(area)}</span>
    `).join('');

    // Dependents
    el.impactDependentsList.innerHTML = (data.directDependents || []).length > 0
      ? data.directDependents.map(f => `<span class="chip" style="cursor:pointer;" onclick="app.jumpToFile('${f}')">${escapeHtml(f)}</span>`).join('')
      : '<span style="font-size:12px; color:var(--text-muted);">None</span>';

    // Recommendations
    el.impactRecommendationsList.innerHTML = (data.recommendations || []).map(r => `
      <div style="background:var(--bg-surface-elevated); padding:8px 12px; border-radius:var(--radius-md); border-left:3px solid ${data.impactColor};">
        ${escapeHtml(r)}
      </div>
    `).join('');

    // Render Subgraph Cytoscape
    renderImpactSubgraph(data.subGraph);
  }

  function renderImpactSubgraph(subGraphData) {
    if (!window.cytoscape || !subGraphData) return;

    if (state.impactCy) {
      state.impactCy.destroy();
      state.impactCy = null;
    }

    const elements = [...(subGraphData.nodes || []), ...(subGraphData.edges || [])];

    state.impactCy = window.cytoscape({
      container: el.impactSubgraph,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'font-size': '10px',
            'color': '#cbd5e1',
            'text-valign': 'bottom',
            'background-color': '#f59e0b',
            'width': 22,
            'height': 22
          }
        },
        {
          selector: 'node[?isTarget]',
          style: {
            'background-color': '#ef4444',
            'width': 34,
            'height': 34,
            'border-width': 3,
            'border-color': '#ffffff'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#475569',
            'target-arrow-color': '#475569',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 30
      }
    });

    state.impactCy.fit(null, 30);
  }

  // ==========================================================================
  // Documentation & README Generator View
  // ==========================================================================

  function setDocsTab(tab) {
    state.activeDocsTab = tab;
    if (tab === 'deepdive') {
      el.btnSubtabDeepdive.classList.add('active');
      el.btnSubtabReadme.classList.remove('active');
      el.docsPreviewArea.innerHTML = renderMarkdownHtml(state.deepDiveContent || 'Click "Explain Project" to synthesize deep-dive architecture specs.');
    } else {
      el.btnSubtabReadme.classList.add('active');
      el.btnSubtabDeepdive.classList.remove('active');
      el.docsPreviewArea.innerHTML = renderMarkdownHtml(state.readmeContent || 'Click "Generate README" to generate structured markdown.');
    }
  }

  async function generateProjectDeepDive() {
    el.docsPreviewArea.innerHTML = '<em>Synthesizing repository architecture documentation with local AI...</em>';
    try {
      const res = await fetch('/api/ai/project-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoData: state.currentRepo,
          model: state.ollama.currentModel
        })
      });

      const data = await res.json();
      state.deepDiveContent = data.content;
      setDocsTab('deepdive');
    } catch (e) {
      el.docsPreviewArea.innerHTML = `<span style="color:var(--color-danger);">Failed to generate documentation: ${escapeHtml(e.message)}</span>`;
    }
  }

  async function generateReadmeDraft() {
    el.docsPreviewArea.innerHTML = '<em>Drafting production README markdown with local AI...</em>';
    try {
      const res = await fetch('/api/ai/readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoData: state.currentRepo,
          model: state.ollama.currentModel
        })
      });

      const data = await res.json();
      state.readmeContent = data.markdown;
      setDocsTab('readme');
    } catch (e) {
      el.docsPreviewArea.innerHTML = `<span style="color:var(--color-danger);">Failed to generate README: ${escapeHtml(e.message)}</span>`;
    }
  }

  function copyCurrentMarkdown() {
    const textToCopy = state.activeDocsTab === 'deepdive' ? state.deepDiveContent : state.readmeContent;
    if (!textToCopy) {
      showToast('No generated markdown to copy', 'warning');
      return;
    }
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Markdown copied to clipboard ✓');
    }).catch(() => {
      showToast('Failed to copy to clipboard', 'error');
    });
  }

  // ==========================================================================
  // Progress Overlay & Step Indicators
  // ==========================================================================

  function showScanProgress(show) {
    if (show) {
      el.scanOverlay.classList.add('active');
    } else {
      el.scanOverlay.classList.remove('active');
    }
  }

  function setScanStep(stepNum, subtext) {
    el.scanSubtext.textContent = subtext;
    const steps = [el.stepReading, el.stepGraph, el.stepArch, el.stepAi];

    steps.forEach((stepEl, idx) => {
      const curr = idx + 1;
      if (curr < stepNum) {
        stepEl.className = 'scan-step-item completed';
        stepEl.querySelector('.step-indicator').textContent = '✓';
      } else if (curr === stepNum) {
        stepEl.className = 'scan-step-item active';
        stepEl.querySelector('.step-indicator').textContent = '●';
      } else {
        stepEl.className = 'scan-step-item';
        stepEl.querySelector('.step-indicator').textContent = '○';
      }
    });
  }

  // ==========================================================================
  // Modals & UI Utilities
  // ==========================================================================

  function openModal(modalEl) {
    modalEl.classList.add('active');
  }

  function closeModal(modalEl) {
    modalEl.classList.remove('active');
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    el.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderMarkdownHtml(md) {
    if (!md) return '';
    let html = escapeHtml(md);

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, (match, p1) => {
      return `<pre><code>${p1}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Lists
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Paragraph line breaks
    html = html.replace(/\n\n/g, '<br><br>');

    return html;
  }

  function getPrismLanguage(path) {
    const ext = path.split('.').pop().toLowerCase();
    switch (ext) {
      case 'js':
      case 'mjs': return 'javascript';
      case 'ts': return 'typescript';
      case 'json': return 'json';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'py': return 'python';
      case 'md': return 'markdown';
      default: return 'javascript';
    }
  }

  function getFileIconSvg(ext) {
    return `<svg class="tree-node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>`;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Global helper for inline chip clicks
  window.app = {
    jumpToFile: (filePath) => {
      switchView('explorer');
      openFileInExplorer(filePath);
    }
  };

  // Launch app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
