/**
 * Pre-generated realistic demo repository dataset: "Stipo"
 * A complete Firebase-powered modern web application with realistic files,
 * dependencies, architecture graph, metrics, code previews, and AI Q&A answers.
 */

const demoRepoData = {
  isDemo: true,
  repoName: 'Stipo',
  subtitle: 'Firebase-powered web application',
  description: 'Enterprise workflow management & telemetry dashboard built with vanilla JavaScript, Express gateway, and Google Firebase Firestore.',
  scannedAt: '2026-10-14T19:42:10.000Z',
  scanDurationMs: 142,
  branch: 'main',
  stats: {
    totalFiles: 87,
    totalDirectories: 14,
    totalDependencies: 23,
    totalModules: 31,
    totalLines: 12480,
    languages: {
      'JavaScript': 48,
      'CSS': 14,
      'HTML': 8,
      'JSON': 11,
      'Markdown': 6
    }
  },
  entryPoints: [
    'server.js',
    'src/index.js',
    'public/index.html'
  ],
  architectureSummary: 'Frontend (Vanilla UI) → Express API Gateway → Firebase Auth → Firestore DB',
  aiInsight: 'Stipo implements a modular client-server pattern. The client layer coordinates lightweight UI components that interact with a centralized Firebase Authentication broker and Firestore data collections. The Express backend acts as an authenticated telemetry gateway with rate limiting and audit logging.',
  activityList: [
    { type: 'scan', target: 'Stipo (Full Repository)', time: '2 mins ago', status: 'Completed in 142ms' },
    { type: 'impact', target: 'src/services/auth.js', time: '14 mins ago', status: 'High Impact (14 dependents)' },
    { type: 'health', target: 'Security Signals', time: '1 hour ago', status: 'Score: 81/100 (Pass)' },
    { type: 'chat', target: '"Where is authentication handled?"', time: '3 hours ago', status: 'Answered via Local AI' },
    { type: 'graph', target: 'Architecture Map Generation', time: '5 hours ago', status: '87 nodes / 96 edges' }
  ],
  health: {
    overallScore: 77,
    label: 'AI-assisted code health scan',
    categories: {
      architecture: {
        name: 'Architecture',
        score: 86,
        summary: 'Clean structural boundaries with established service layer patterns and low cyclic coupling.',
        signals: [
          { type: 'pass', text: 'Decoupled module graph with balanced dependency distribution' },
          { type: 'pass', text: 'Clear separation of frontend UI components, API services, and data layers' },
          { type: 'pass', text: 'Single-direction dependency flow observed across client-server boundary' },
          { type: 'warning', text: 'High fan-in detected on central auth service (src/services/auth.js)' }
        ],
        issues: [
          'Central files like src/services/auth.js are depended upon by 14 consumers. Consider creating focused sub-interfaces.'
        ],
        recommendation: 'Formalize data transfer interfaces to decouple core Firebase and API services from consumer UI widgets.'
      },
      maintainability: {
        name: 'Maintainability',
        score: 78,
        summary: 'Well-organized directory layout; slight modularity debt in primary dashboard and controller files.',
        signals: [
          { type: 'pass', text: 'Modular directory organization by feature and architectural layer' },
          { type: 'pass', text: 'Consistent naming conventions and standardized file extensions' },
          { type: 'warning', text: '3 files exceed 300 lines of code: Dashboard.js, userController.js, reportBuilder.js' }
        ],
        issues: [
          'Dashboard.js combines metric rendering, event listening, and API polling in one file.'
        ],
        recommendation: 'Extract sub-components from Dashboard views and isolate database query builders into specialized hooks.'
      },
      documentation: {
        name: 'Documentation',
        score: 62,
        summary: 'Root documentation exists; internal service contracts and helper utilities need docstrings.',
        signals: [
          { type: 'pass', text: 'Root README.md present with setup instructions' },
          { type: 'pass', text: 'Package manifest includes script definitions and project metadata' },
          { type: 'warning', text: 'Submodules in services/ and components/ lack inline architectural markdown guides' }
        ],
        issues: [
          'Exported helper utilities in src/utils/helpers.js lack example usage blocks and parameter schemas.'
        ],
        recommendation: 'Generate structured documentation using Repo X-Ray README builder to document APIs and data models.'
      },
      security: {
        name: 'Security Signals',
        score: 81,
        summary: 'Good baseline security posture; ensure production secrets are strictly decoupled from client-side bundles.',
        signals: [
          { type: 'pass', text: 'No unencrypted private keys (.pem, .key, id_rsa) detected in tracked files' },
          { type: 'pass', text: 'Sensitive environment files (.env) are isolated from public repository assets' },
          { type: 'warning', text: 'Possible hardcoded demo API configuration or token placeholder in client config' },
          { type: 'pass', text: 'No dangerous runtime eval() or dynamic code execution primitives observed' }
        ],
        issues: [
          'Client Firebase initialization uses hardcoded public project keys; verify Firestore rules restrict unauthenticated reads.'
        ],
        recommendation: 'Audit client Firebase initialization config to verify Firestore security rules enforce authenticated row-level access.'
      }
    }
  },
  files: [
    {
      id: 'src/services/auth.js',
      name: 'auth.js',
      relativePath: 'src/services/auth.js',
      directory: 'src/services',
      extension: '.js',
      size: 4820,
      lines: 142,
      role: 'service',
      imports: ['./firebase.js', '../utils/helpers.js', '../utils/logger.js'],
      externalImports: ['firebase/auth'],
      exports: ['loginWithEmail', 'registerUser', 'logoutUser', 'onAuthStateChanged', 'getCurrentUserToken', 'resetPassword']
    },
    {
      id: 'src/services/firebase.js',
      name: 'firebase.js',
      relativePath: 'src/services/firebase.js',
      directory: 'src/services',
      extension: '.js',
      size: 3200,
      lines: 95,
      role: 'service',
      imports: ['../config/firebaseConfig.js', '../utils/logger.js'],
      externalImports: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
      exports: ['app', 'db', 'auth', 'initFirebase', 'getFirestoreInstance']
    },
    {
      id: 'src/services/api.js',
      name: 'api.js',
      relativePath: 'src/services/api.js',
      directory: 'src/services',
      extension: '.js',
      size: 5120,
      lines: 168,
      role: 'service',
      imports: ['./auth.js', '../config/apiConfig.js', '../utils/helpers.js'],
      externalImports: [],
      exports: ['fetchWorkspaceData', 'fetchAnalytics', 'postAuditLog', 'updateUserSettings', 'executeBatchSync']
    },
    {
      id: 'src/components/Dashboard.js',
      name: 'Dashboard.js',
      relativePath: 'src/components/Dashboard.js',
      directory: 'src/components',
      extension: '.js',
      size: 11400,
      lines: 345,
      role: 'component',
      imports: ['../services/api.js', '../services/auth.js', './Header.js', './MetricCard.js', '../utils/formatters.js'],
      externalImports: [],
      exports: ['DashboardView', 'renderDashboard', 'refreshMetrics']
    },
    {
      id: 'src/components/Header.js',
      name: 'Header.js',
      relativePath: 'src/components/Header.js',
      directory: 'src/components',
      extension: '.js',
      size: 4200,
      lines: 120,
      role: 'component',
      imports: ['../services/auth.js', './UserMenu.js', '../utils/helpers.js'],
      externalImports: [],
      exports: ['HeaderComponent', 'renderHeader', 'updateHeaderStatus']
    },
    {
      id: 'src/components/MetricCard.js',
      name: 'MetricCard.js',
      relativePath: 'src/components/MetricCard.js',
      directory: 'src/components',
      extension: '.js',
      size: 2800,
      lines: 84,
      role: 'component',
      imports: ['../utils/formatters.js'],
      externalImports: [],
      exports: ['createMetricCard', 'updateMetricValue']
    },
    {
      id: 'src/components/UserMenu.js',
      name: 'UserMenu.js',
      relativePath: 'src/components/UserMenu.js',
      directory: 'src/components',
      extension: '.js',
      size: 3400,
      lines: 98,
      role: 'component',
      imports: ['../services/auth.js', '../utils/helpers.js'],
      externalImports: [],
      exports: ['renderUserMenu', 'toggleUserDropdown']
    },
    {
      id: 'src/components/Settings.js',
      name: 'Settings.js',
      relativePath: 'src/components/Settings.js',
      directory: 'src/components',
      extension: '.js',
      size: 7800,
      lines: 230,
      role: 'component',
      imports: ['../services/api.js', '../services/auth.js', '../utils/validation.js'],
      externalImports: [],
      exports: ['SettingsView', 'savePreferences']
    },
    {
      id: 'src/components/Reports.js',
      name: 'Reports.js',
      relativePath: 'src/components/Reports.js',
      directory: 'src/components',
      extension: '.js',
      size: 8900,
      lines: 260,
      role: 'component',
      imports: ['../services/api.js', './ReportTable.js', '../utils/formatters.js', '../utils/exportCsv.js'],
      externalImports: [],
      exports: ['ReportsView', 'exportCurrentReport']
    },
    {
      id: 'src/components/ReportTable.js',
      name: 'ReportTable.js',
      relativePath: 'src/components/ReportTable.js',
      directory: 'src/components',
      extension: '.js',
      size: 4500,
      lines: 135,
      role: 'component',
      imports: ['../utils/formatters.js'],
      externalImports: [],
      exports: ['renderReportTable', 'sortReportData']
    },
    {
      id: 'src/utils/helpers.js',
      name: 'helpers.js',
      relativePath: 'src/utils/helpers.js',
      directory: 'src/utils',
      extension: '.js',
      size: 3600,
      lines: 110,
      role: 'util',
      imports: ['./logger.js'],
      externalImports: [],
      exports: ['safeJsonParse', 'debounce', 'throttle', 'uuidv4', 'sanitizeString', 'deepClone']
    },
    {
      id: 'src/utils/formatters.js',
      name: 'formatters.js',
      relativePath: 'src/utils/formatters.js',
      directory: 'src/utils',
      extension: '.js',
      size: 2900,
      lines: 90,
      role: 'util',
      imports: [],
      externalImports: [],
      exports: ['formatCurrency', 'formatRelativeDate', 'formatByteSize', 'formatPercentage']
    },
    {
      id: 'src/utils/validation.js',
      name: 'validation.js',
      relativePath: 'src/utils/validation.js',
      directory: 'src/utils',
      extension: '.js',
      size: 3100,
      lines: 88,
      role: 'util',
      imports: [],
      externalImports: [],
      exports: ['validateEmail', 'validatePasswordStrength', 'validateWorkspaceName']
    },
    {
      id: 'src/utils/logger.js',
      name: 'logger.js',
      relativePath: 'src/utils/logger.js',
      directory: 'src/utils',
      extension: '.js',
      size: 1900,
      lines: 65,
      role: 'util',
      imports: [],
      externalImports: [],
      exports: ['logger', 'logDebug', 'logInfo', 'logWarn', 'logError']
    },
    {
      id: 'src/utils/exportCsv.js',
      name: 'exportCsv.js',
      relativePath: 'src/utils/exportCsv.js',
      directory: 'src/utils',
      extension: '.js',
      size: 2200,
      lines: 70,
      role: 'util',
      imports: ['./helpers.js'],
      externalImports: [],
      exports: ['downloadAsCsv', 'jsonToCsvString']
    },
    {
      id: 'src/config/firebaseConfig.js',
      name: 'firebaseConfig.js',
      relativePath: 'src/config/firebaseConfig.js',
      directory: 'src/config',
      extension: '.js',
      size: 1400,
      lines: 42,
      role: 'config',
      imports: [],
      externalImports: [],
      exports: ['firebaseConfig', 'firestoreSettings']
    },
    {
      id: 'src/config/apiConfig.js',
      name: 'apiConfig.js',
      relativePath: 'src/config/apiConfig.js',
      directory: 'src/config',
      extension: '.js',
      size: 1200,
      lines: 36,
      role: 'config',
      imports: [],
      externalImports: [],
      exports: ['API_BASE_URL', 'TIMEOUT_MS', 'ENDPOINTS']
    },
    {
      id: 'src/controllers/userController.js',
      name: 'userController.js',
      relativePath: 'src/controllers/userController.js',
      directory: 'src/controllers',
      extension: '.js',
      size: 6700,
      lines: 195,
      role: 'controller',
      imports: ['../models/userModel.js', '../services/firebase.js', '../utils/logger.js'],
      externalImports: [],
      exports: ['getUserProfile', 'updateUserProfile', 'listTeamMembers', 'revokeUserSession']
    },
    {
      id: 'src/controllers/reportController.js',
      name: 'reportController.js',
      relativePath: 'src/controllers/reportController.js',
      directory: 'src/controllers',
      extension: '.js',
      size: 5800,
      lines: 172,
      role: 'controller',
      imports: ['../models/reportModel.js', '../utils/logger.js'],
      externalImports: [],
      exports: ['generateQuarterlyReport', 'streamReportData', 'deleteReport']
    },
    {
      id: 'src/models/userModel.js',
      name: 'userModel.js',
      relativePath: 'src/models/userModel.js',
      directory: 'src/models',
      extension: '.js',
      size: 3400,
      lines: 105,
      role: 'model',
      imports: ['../services/firebase.js'],
      externalImports: [],
      exports: ['UserSchema', 'findUserById', 'saveUserRecord', 'archiveUserRecord']
    },
    {
      id: 'src/models/reportModel.js',
      name: 'reportModel.js',
      relativePath: 'src/models/reportModel.js',
      directory: 'src/models',
      extension: '.js',
      size: 3100,
      lines: 95,
      role: 'model',
      imports: ['../services/firebase.js'],
      externalImports: [],
      exports: ['ReportSchema', 'queryReportsByWorkspace', 'createReportRecord']
    },
    {
      id: 'server.js',
      name: 'server.js',
      relativePath: 'server.js',
      directory: '.',
      extension: '.js',
      size: 4500,
      lines: 130,
      role: 'controller',
      imports: ['./src/controllers/userController.js', './src/controllers/reportController.js', './src/utils/logger.js'],
      externalImports: ['express', 'cors', 'dotenv'],
      exports: ['app', 'startServer']
    },
    {
      id: 'package.json',
      name: 'package.json',
      relativePath: 'package.json',
      directory: '.',
      extension: '.json',
      size: 1850,
      lines: 55,
      role: 'config',
      imports: [],
      externalImports: [],
      exports: []
    },
    {
      id: 'README.md',
      name: 'README.md',
      relativePath: 'README.md',
      directory: '.',
      extension: '.md',
      size: 2600,
      lines: 85,
      role: 'documentation',
      imports: [],
      externalImports: [],
      exports: []
    }
  ],
  sampleCode: {
    'src/services/auth.js': `/**
 * Stipo Authentication Broker
 * Integrates Firebase Auth with application session state.
 */
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthChanged
} from 'firebase/auth';
import { app } from './firebase.js';
import { safeJsonParse } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';

const auth = getAuth(app);
let currentUserState = null;
const listeners = new Set();

export async function loginWithEmail(email, password) {
  logger.info(\`Attempting login for \${email}\`);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    currentUserState = userCredential.user;
    notifyListeners(currentUserState);
    return { success: true, user: currentUserState };
  } catch (error) {
    logger.error('Login failed', error);
    return { success: false, error: error.message };
  }
}

export async function registerUser(email, password, displayName) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    currentUserState = credential.user;
    notifyListeners(currentUserState);
    return { success: true, user: currentUserState };
  } catch (err) {
    logger.error('Registration failed', err);
    return { success: false, error: err.message };
  }
}

export async function logoutUser() {
  await signOut(auth);
  currentUserState = null;
  notifyListeners(null);
}

export function onAuthStateChanged(callback) {
  listeners.add(callback);
  callback(currentUserState);
  return () => listeners.delete(callback);
}

function notifyListeners(user) {
  listeners.forEach(cb => {
    try { cb(user); } catch (e) { logger.warn('Listener error', e); }
  });
}

export async function getCurrentUserToken() {
  if (!auth.currentUser) return null;
  return await auth.currentUser.getIdToken();
}`,

    'src/services/firebase.js': `/**
 * Stipo Firebase Initialization
 * Centralizes client connections to Firebase Auth & Firestore DB
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig, firestoreSettings } from '../config/firebaseConfig.js';
import { logger } from '../utils/logger.js';

let appInstance = null;
let dbInstance = null;
let authInstance = null;

export function initFirebase() {
  if (!getApps().length) {
    appInstance = initializeApp(firebaseConfig);
    logger.info('Firebase initialized with project:', firebaseConfig.projectId);
  } else {
    appInstance = getApp();
  }

  dbInstance = initializeFirestore(appInstance, firestoreSettings);
  authInstance = getAuth(appInstance);

  return { app: appInstance, db: dbInstance, auth: authInstance };
}

export const app = appInstance || initFirebase().app;
export const db = dbInstance || initFirebase().db;
export const auth = authInstance || initFirebase().auth;

export function getFirestoreInstance() {
  return db;
}`,

    'src/services/api.js': `/**
 * Stipo API Client Gateway
 * Authenticated REST client communicating with Express server endpoints.
 */
import { getCurrentUserToken } from './auth.js';
import { API_BASE_URL, TIMEOUT_MS } from '../config/apiConfig.js';
import { safeJsonParse, throttle } from '../utils/helpers.js';

export async function fetchWorkspaceData(workspaceId) {
  const token = await getCurrentUserToken();
  const res = await fetch(\`\${API_BASE_URL}/api/workspaces/\${workspaceId}\`, {
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) throw new Error(\`Failed to fetch workspace: \${res.statusText}\`);
  return await res.json();
}

export async function fetchAnalytics(timeRange = '7d') {
  const token = await getCurrentUserToken();
  const res = await fetch(\`\${API_BASE_URL}/api/analytics?range=\${timeRange}\`, {
    headers: { 'Authorization': \`Bearer \${token}\` }
  });
  return await res.json();
}

export const postAuditLog = throttle(async (event, metadata) => {
  const token = await getCurrentUserToken();
  await fetch(\`\${API_BASE_URL}/api/audit\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ event, metadata, timestamp: Date.now() })
  });
}, 1000);`,

    'src/components/Dashboard.js': `/**
 * Stipo Metric Dashboard Component
 * Renders telemetry, workspace cards, and live activity feed.
 */
import { fetchAnalytics, fetchWorkspaceData } from '../services/api.js';
import { onAuthStateChanged } from '../services/auth.js';
import { renderHeader } from './Header.js';
import { createMetricCard, updateMetricValue } from './MetricCard.js';
import { formatCurrency, formatRelativeDate } from '../utils/formatters.js';

export class DashboardView {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentData = null;
    this.init();
  }

  async init() {
    renderHeader(document.getElementById('header-slot'));

    onAuthStateChanged(user => {
      if (!user) {
        this.renderLoginPrompt();
      } else {
        this.loadMetrics();
      }
    });
  }

  async loadMetrics() {
    this.container.innerHTML = '<div class="loader">Loading metrics...</div>';
    try {
      const data = await fetchAnalytics('30d');
      this.currentData = data;
      this.render();
    } catch (err) {
      this.container.innerHTML = \`<div class="error">\${err.message}</div>\`;
    }
  }

  render() {
    this.container.innerHTML = \`
      <div class="metrics-grid">
        <div id="metric-revenue"></div>
        <div id="metric-users"></div>
        <div id="metric-conversion"></div>
      </div>
    \`;

    createMetricCard('metric-revenue', 'Revenue', formatCurrency(this.currentData.revenue), '+12.4%');
    createMetricCard('metric-users', 'Active Sessions', this.currentData.activeUsers, '+5.1%');
    createMetricCard('metric-conversion', 'Conversion Rate', this.currentData.conversionRate + '%', '-0.2%');
  }
}`,

    'src/components/Header.js': `/**
 * Header Component
 * Top bar with logo, workspace switcher, and user session badge.
 */
import { onAuthStateChanged, logoutUser } from '../services/auth.js';
import { renderUserMenu } from './UserMenu.js';
import { debounce } from '../utils/helpers.js';

export function renderHeader(targetEl) {
  if (!targetEl) return;
  targetEl.innerHTML = \`
    <header class="app-header">
      <div class="brand">
        <span class="logo">Stipo</span>
      </div>
      <div id="user-menu-slot"></div>
    </header>
  \`;

  onAuthStateChanged(user => {
    const slot = document.getElementById('user-menu-slot');
    if (slot) {
      renderUserMenu(slot, user);
    }
  });
}`,

    'src/utils/helpers.js': `/**
 * Core Utilities
 * Generic helper methods for data parsing, timing, and formatting.
 */
import { logger } from './logger.js';

export function safeJsonParse(jsonString, fallback = null) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    logger.warn('Failed to parse JSON string', e);
    return fallback;
  }
}

export function debounce(fn, delayMs = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delayMs);
  };
}

export function throttle(fn, limitMs = 300) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limitMs);
    }
  };
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}`,

    'server.js': `/**
 * Stipo Express Server & API Gateway
 */
const express = require('express');
const cors = require('cors');
const { getUserProfile, updateUserProfile } = require('./src/controllers/userController.js');
const { generateQuarterlyReport } = require('./src/controllers/reportController.js');
const { logger } = require('./src/utils/logger.js');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Telemetry & Profile Routes
app.get('/api/workspaces/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Main Production Workspace', activeUsers: 42 });
});

app.get('/api/analytics', (req, res) => {
  res.json({ revenue: 48900, activeUsers: 1240, conversionRate: 3.4 });
});

app.get('/api/user/profile', getUserProfile);
app.post('/api/user/profile', updateUserProfile);
app.get('/api/reports/quarterly', generateQuarterlyReport);

app.listen(PORT, () => {
  logger.info(\`Stipo API Gateway listening on port \${PORT}\`);
});

module.exports = { app };`,

    'package.json': `{
  "name": "stipo",
  "version": "2.4.0",
  "description": "Firebase-powered telemetry and workspace dashboard",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "lint": "eslint src/"
  },
  "dependencies": {
    "express": "^4.19.2",
    "firebase": "^10.12.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.1.0",
    "eslint": "^9.2.0"
  }
}`,

    'README.md': `# Stipo

See inside your codebase with Stipo — an enterprise telemetry and workspace dashboard.

## Tech Stack
- Frontend: Vanilla JavaScript, CSS3
- Backend: Node.js & Express
- Auth & Database: Google Firebase (Auth & Cloud Firestore)

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Configure environment:
Copy \`.env.example\` to \`.env\` and provide Firebase configuration.

3. Run locally:
\`\`\`bash
npm start
\`\`\`
`
  },
  graph: {
    nodes: [
      { data: { id: 'src/services/auth.js', label: 'auth.js', path: 'src/services/auth.js', directory: 'src/services', role: 'service', size: 4820, lines: 142, exportsCount: 6, importsCount: 3, type: 'file' } },
      { data: { id: 'src/services/firebase.js', label: 'firebase.js', path: 'src/services/firebase.js', directory: 'src/services', role: 'service', size: 3200, lines: 95, exportsCount: 5, importsCount: 2, type: 'file' } },
      { data: { id: 'src/services/api.js', label: 'api.js', path: 'src/services/api.js', directory: 'src/services', role: 'service', size: 5120, lines: 168, exportsCount: 5, importsCount: 3, type: 'file' } },
      { data: { id: 'src/components/Dashboard.js', label: 'Dashboard.js', path: 'src/components/Dashboard.js', directory: 'src/components', role: 'component', size: 11400, lines: 345, exportsCount: 3, importsCount: 5, type: 'file' } },
      { data: { id: 'src/components/Header.js', label: 'Header.js', path: 'src/components/Header.js', directory: 'src/components', role: 'component', size: 4200, lines: 120, exportsCount: 3, importsCount: 3, type: 'file' } },
      { data: { id: 'src/components/MetricCard.js', label: 'MetricCard.js', path: 'src/components/MetricCard.js', directory: 'src/components', role: 'component', size: 2800, lines: 84, exportsCount: 2, importsCount: 1, type: 'file' } },
      { data: { id: 'src/components/UserMenu.js', label: 'UserMenu.js', path: 'src/components/UserMenu.js', directory: 'src/components', role: 'component', size: 3400, lines: 98, exportsCount: 2, importsCount: 2, type: 'file' } },
      { data: { id: 'src/components/Settings.js', label: 'Settings.js', path: 'src/components/Settings.js', directory: 'src/components', role: 'component', size: 7800, lines: 230, exportsCount: 2, importsCount: 3, type: 'file' } },
      { data: { id: 'src/components/Reports.js', label: 'Reports.js', path: 'src/components/Reports.js', directory: 'src/components', role: 'component', size: 8900, lines: 260, exportsCount: 2, importsCount: 4, type: 'file' } },
      { data: { id: 'src/components/ReportTable.js', label: 'ReportTable.js', path: 'src/components/ReportTable.js', directory: 'src/components', role: 'component', size: 4500, lines: 135, exportsCount: 2, importsCount: 1, type: 'file' } },
      { data: { id: 'src/utils/helpers.js', label: 'helpers.js', path: 'src/utils/helpers.js', directory: 'src/utils', role: 'util', size: 3600, lines: 110, exportsCount: 6, importsCount: 1, type: 'file' } },
      { data: { id: 'src/utils/formatters.js', label: 'formatters.js', path: 'src/utils/formatters.js', directory: 'src/utils', role: 'util', size: 2900, lines: 90, exportsCount: 4, importsCount: 0, type: 'file' } },
      { data: { id: 'src/utils/validation.js', label: 'validation.js', path: 'src/utils/validation.js', directory: 'src/utils', role: 'util', size: 3100, lines: 88, exportsCount: 3, importsCount: 0, type: 'file' } },
      { data: { id: 'src/utils/logger.js', label: 'logger.js', path: 'src/utils/logger.js', directory: 'src/utils', role: 'util', size: 1900, lines: 65, exportsCount: 5, importsCount: 0, type: 'file' } },
      { data: { id: 'src/utils/exportCsv.js', label: 'exportCsv.js', path: 'src/utils/exportCsv.js', directory: 'src/utils', role: 'util', size: 2200, lines: 70, exportsCount: 2, importsCount: 1, type: 'file' } },
      { data: { id: 'src/config/firebaseConfig.js', label: 'firebaseConfig.js', path: 'src/config/firebaseConfig.js', directory: 'src/config', role: 'config', size: 1400, lines: 42, exportsCount: 2, importsCount: 0, type: 'file' } },
      { data: { id: 'src/config/apiConfig.js', label: 'apiConfig.js', path: 'src/config/apiConfig.js', directory: 'src/config', role: 'config', size: 1200, lines: 36, exportsCount: 3, importsCount: 0, type: 'file' } },
      { data: { id: 'src/controllers/userController.js', label: 'userController.js', path: 'src/controllers/userController.js', directory: 'src/controllers', role: 'controller', size: 6700, lines: 195, exportsCount: 4, importsCount: 3, type: 'file' } },
      { data: { id: 'src/controllers/reportController.js', label: 'reportController.js', path: 'src/controllers/reportController.js', directory: 'src/controllers', role: 'controller', size: 5800, lines: 172, exportsCount: 3, importsCount: 2, type: 'file' } },
      { data: { id: 'src/models/userModel.js', label: 'userModel.js', path: 'src/models/userModel.js', directory: 'src/models', role: 'model', size: 3400, lines: 105, exportsCount: 4, importsCount: 1, type: 'file' } },
      { data: { id: 'src/models/reportModel.js', label: 'reportModel.js', path: 'src/models/reportModel.js', directory: 'src/models', role: 'model', size: 3100, lines: 95, exportsCount: 3, importsCount: 1, type: 'file' } },
      { data: { id: 'server.js', label: 'server.js', path: 'server.js', directory: '.', role: 'controller', size: 4500, lines: 130, exportsCount: 2, importsCount: 3, type: 'file' } }
    ],
    edges: [
      { data: { id: 'auth->firebase', source: 'src/services/auth.js', target: 'src/services/firebase.js', label: 'imports' } },
      { data: { id: 'auth->helpers', source: 'src/services/auth.js', target: 'src/utils/helpers.js', label: 'imports' } },
      { data: { id: 'auth->logger', source: 'src/services/auth.js', target: 'src/utils/logger.js', label: 'imports' } },
      { data: { id: 'firebase->config', source: 'src/services/firebase.js', target: 'src/config/firebaseConfig.js', label: 'imports' } },
      { data: { id: 'firebase->logger', source: 'src/services/firebase.js', target: 'src/utils/logger.js', label: 'imports' } },
      { data: { id: 'api->auth', source: 'src/services/api.js', target: 'src/services/auth.js', label: 'imports' } },
      { data: { id: 'api->config', source: 'src/services/api.js', target: 'src/config/apiConfig.js', label: 'imports' } },
      { data: { id: 'api->helpers', source: 'src/services/api.js', target: 'src/utils/helpers.js', label: 'imports' } },
      { data: { id: 'dashboard->api', source: 'src/components/Dashboard.js', target: 'src/services/api.js', label: 'imports' } },
      { data: { id: 'dashboard->auth', source: 'src/components/Dashboard.js', target: 'src/services/auth.js', label: 'imports' } },
      { data: { id: 'dashboard->header', source: 'src/components/Dashboard.js', target: 'src/components/Header.js', label: 'imports' } },
      { data: { id: 'dashboard->metriccard', source: 'src/components/Dashboard.js', target: 'src/components/MetricCard.js', label: 'imports' } },
      { data: { id: 'dashboard->formatters', source: 'src/components/Dashboard.js', target: 'src/utils/formatters.js', label: 'imports' } },
      { data: { id: 'header->auth', source: 'src/components/Header.js', target: 'src/services/auth.js', label: 'imports' } },
      { data: { id: 'header->usermenu', source: 'src/components/Header.js', target: 'src/components/UserMenu.js', label: 'imports' } },
      { data: { id: 'header->helpers', source: 'src/components/Header.js', target: 'src/utils/helpers.js', label: 'imports' } },
      { data: { id: 'usermenu->auth', source: 'src/components/UserMenu.js', target: 'src/services/auth.js', label: 'imports' } },
      { data: { id: 'usermenu->helpers', source: 'src/components/UserMenu.js', target: 'src/utils/helpers.js', label: 'imports' } },
      { data: { id: 'settings->api', source: 'src/components/Settings.js', target: 'src/services/api.js', label: 'imports' } },
      { data: { id: 'settings->auth', source: 'src/components/Settings.js', target: 'src/services/auth.js', label: 'imports' } },
      { data: { id: 'settings->validation', source: 'src/components/Settings.js', target: 'src/utils/validation.js', label: 'imports' } },
      { data: { id: 'reports->api', source: 'src/components/Reports.js', target: 'src/services/api.js', label: 'imports' } },
      { data: { id: 'reports->reporttable', source: 'src/components/Reports.js', target: 'src/components/ReportTable.js', label: 'imports' } },
      { data: { id: 'reports->formatters', source: 'src/components/Reports.js', target: 'src/utils/formatters.js', label: 'imports' } },
      { data: { id: 'reports->exportcsv', source: 'src/components/Reports.js', target: 'src/utils/exportCsv.js', label: 'imports' } },
      { data: { id: 'reporttable->formatters', source: 'src/components/ReportTable.js', target: 'src/utils/formatters.js', label: 'imports' } },
      { data: { id: 'metriccard->formatters', source: 'src/components/MetricCard.js', target: 'src/utils/formatters.js', label: 'imports' } },
      { data: { id: 'exportcsv->helpers', source: 'src/utils/exportCsv.js', target: 'src/utils/helpers.js', label: 'imports' } },
      { data: { id: 'helpers->logger', source: 'src/utils/helpers.js', target: 'src/utils/logger.js', label: 'imports' } },
      { data: { id: 'usercontroller->usermodel', source: 'src/controllers/userController.js', target: 'src/models/userModel.js', label: 'imports' } },
      { data: { id: 'usercontroller->firebase', source: 'src/controllers/userController.js', target: 'src/services/firebase.js', label: 'imports' } },
      { data: { id: 'usercontroller->logger', source: 'src/controllers/userController.js', target: 'src/utils/logger.js', label: 'imports' } },
      { data: { id: 'reportcontroller->reportmodel', source: 'src/controllers/reportController.js', target: 'src/models/reportModel.js', label: 'imports' } },
      { data: { id: 'reportcontroller->logger', source: 'src/controllers/reportController.js', target: 'src/utils/logger.js', label: 'imports' } },
      { data: { id: 'usermodel->firebase', source: 'src/models/userModel.js', target: 'src/services/firebase.js', label: 'imports' } },
      { data: { id: 'reportmodel->firebase', source: 'src/models/reportModel.js', target: 'src/services/firebase.js', label: 'imports' } },
      { data: { id: 'server->usercontroller', source: 'server.js', target: 'src/controllers/userController.js', label: 'imports' } },
      { data: { id: 'server->reportcontroller', source: 'server.js', target: 'src/controllers/reportController.js', label: 'imports' } },
      { data: { id: 'server->logger', source: 'server.js', target: 'src/utils/logger.js', label: 'imports' } }
    ]
  },
  aiQA: {
    'Where is authentication handled?': {
      answer: `Authentication is primarily handled in:

\`src/services/auth.js\`

The login flow wraps the official Firebase Web SDK (v10) via \`signInWithEmailAndPassword\` and \`createUserWithEmailAndPassword\`. It provides listener hooks (\`onAuthStateChanged\`) that synchronize reactive session state to UI components like \`Dashboard.js\`, \`Header.js\`, and \`UserMenu.js\`. For authenticated backend API requests, \`getCurrentUserToken()\` fetches fresh Firebase ID tokens.`,
      relatedFiles: ['src/services/auth.js', 'src/services/firebase.js', 'src/components/Dashboard.js'],
      relevantSymbols: ['loginWithEmail', 'onAuthStateChanged', 'getCurrentUserToken', 'signInWithEmailAndPassword'],
      confidence: 'High (Direct AST match)'
    },
    'How does the dashboard load data?': {
      answer: `The dashboard coordinates data fetching in \`src/components/Dashboard.js\`:

1. When initialized, it subscribes to \`onAuthStateChanged\` in \`src/services/auth.js\`.
2. Upon user verification, \`DashboardView.loadMetrics()\` invokes \`fetchAnalytics('30d')\` and \`fetchWorkspaceData()\` from \`src/services/api.js\`.
3. The API client attaches an Authorization Bearer token obtained from Firebase Auth.
4. Data is mapped to sub-widgets (\`MetricCard.js\`) using formatting utilities (\`formatters.js\`).`,
      relatedFiles: ['src/components/Dashboard.js', 'src/services/api.js', 'src/components/MetricCard.js', 'src/utils/formatters.js'],
      relevantSymbols: ['loadMetrics', 'fetchAnalytics', 'createMetricCard', 'formatCurrency'],
      confidence: 'High (Direct AST match)'
    },
    'What depends on firebase.js?': {
      answer: `\`src/services/firebase.js\` is the core database & cloud SDK nexus.

Direct dependents (5 modules):
- \`src/services/auth.js\` (Firebase Auth client initialization)
- \`src/controllers/userController.js\` (Server-side user verification)
- \`src/models/userModel.js\` (Firestore user collection reads/writes)
- \`src/models/reportModel.js\` (Firestore report storage)

Transitively, any UI component reading user data or making authenticated calls depends on this module.`,
      relatedFiles: ['src/services/firebase.js', 'src/services/auth.js', 'src/models/userModel.js', 'src/models/reportModel.js'],
      relevantSymbols: ['initFirebase', 'getFirestoreInstance', 'db', 'auth'],
      confidence: 'High (Dependency graph verified)'
    },
    'Explain the application architecture.': {
      answer: `Stipo follows a **Layered Client-Server Architecture** with a Managed Cloud Data Plane:

- **Presentation Layer**: Vanilla JavaScript component classes (\`Dashboard.js\`, \`Header.js\`, \`Reports.js\`, \`Settings.js\`) using zero frameworks for maximum speed and minimal memory footprint.
- **Service & Broker Layer**: \`api.js\` (HTTP client gateway) and \`auth.js\` (Firebase Authentication lifecycle orchestrator).
- **Backend API Gateway**: Express.js in \`server.js\` handling route dispatching, input sanitation, and audit logging.
- **Persistence & Cloud**: Google Firebase (Firestore for JSON document storage and Firebase Auth for secure identity tokens).`,
      relatedFiles: ['server.js', 'src/services/auth.js', 'src/services/api.js', 'src/services/firebase.js', 'src/components/Dashboard.js'],
      relevantSymbols: ['initFirebase', 'DashboardView', 'app', 'loginWithEmail'],
      confidence: 'High (Architecture blueprint verified)'
    },
    'What would break if I remove auth.js?': {
      answer: `Removing \`src/services/auth.js\` causes a **CRITICAL SYSTEM FAILURE** across 14 dependent files:

- **Authentication Breaks**: Users can no longer log in, register, or renew JWT tokens.
- **API Requests Fail**: \`src/services/api.js\` relies on \`getCurrentUserToken()\` for all HTTP authorization headers; all backend endpoints will respond with 401 Unauthorized.
- **UI Components Crash**: \`Dashboard.js\`, \`Header.js\`, \`UserMenu.js\`, and \`Settings.js\` directly import auth change listeners.

**Impact Severity: HIGH (Blast radius: 64% of application flows).**`,
      relatedFiles: ['src/services/auth.js', 'src/services/api.js', 'src/components/Dashboard.js', 'src/components/Header.js'],
      relevantSymbols: ['getCurrentUserToken', 'onAuthStateChanged', 'loginWithEmail'],
      confidence: 'High (Transitive dependency traversal)'
    }
  }
};

module.exports = demoRepoData;
