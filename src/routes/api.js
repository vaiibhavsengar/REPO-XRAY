/**
 * Repo X-Ray Express API Routes
 */

const express = require('express');
const router = express.Router();
const ollama = require('../services/ollamaService');
const repoScanner = require('../services/repoScanner');
const impactAnalyzer = require('../services/impactAnalyzer');
const healthScanner = require('../services/healthScanner');
const aiService = require('../services/aiService');
const demoRepoData = require('../data/demoRepo');

// --- Ollama Management ---

router.get('/ollama/status', async (req, res) => {
  try {
    const status = await ollama.checkStatus();
    res.json(status);
  } catch (err) {
    res.json({
      connected: false,
      url: ollama.baseUrl,
      error: err.message || 'Failed to check Ollama status',
      models: []
    });
  }
});

router.get('/ollama/models', async (req, res) => {
  try {
    const models = await ollama.listModels();
    res.json({ models });
  } catch (err) {
    res.status(500).json({ error: err.message, models: [] });
  }
});

router.post('/ollama/connect', async (req, res) => {
  const { url, model } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Ollama URL is required' });
  }

  ollama.setEndpoint(url, model);
  const status = await ollama.checkStatus(url);
  if (model && status.connected) {
    ollama.currentModel = model;
  }
  res.json(status);
});

// --- Repository Scanning ---

router.get('/demo/repository', (req, res) => {
  res.json(demoRepoData);
});

router.post('/repository/scan', async (req, res) => {
  const { repoPath } = req.body;
  if (!repoPath) {
    return res.status(400).json({ error: 'Repository path is required' });
  }

  try {
    const startTime = Date.now();
    const scanResult = await repoScanner.scan(repoPath);
    const durationMs = Date.now() - startTime;

    // Run health evaluation
    const health = healthScanner.evaluate(scanResult);

    res.json({
      ...scanResult,
      scanDurationMs: durationMs,
      health
    });
  } catch (err) {
    res.status(400).json({
      error: err.message || 'Repository could not be scanned. Please verify directory path.'
    });
  }
});

router.post('/repository/file-content', (req, res) => {
  const { repoPath, filePath, isDemo } = req.body;

  if (isDemo) {
    const sample = demoRepoData.sampleCode[filePath];
    if (sample) {
      return res.json({
        content: sample,
        lines: sample.split('\n').length,
        truncated: false,
        path: filePath
      });
    }
    // Return placeholder if not in key samples
    return res.json({
      content: `// Source preview for: ${filePath}\n// File is part of the Stipo demonstration repository.\n\nexport const fileMetadata = {\n  path: "${filePath}",\n  layer: "Modular Architecture",\n  verified: true\n};\n`,
      lines: 8,
      truncated: false,
      path: filePath
    });
  }

  if (!repoPath || !filePath) {
    return res.status(400).json({ error: 'repoPath and filePath are required' });
  }

  try {
    const fileData = repoScanner.readFileContent(repoPath, filePath);
    res.json(fileData);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// --- AI Analysis & Intelligence ---

router.post('/ai/explain', async (req, res) => {
  const { filePath, codeSnippet, repoContext, model } = req.body;
  if (!filePath) {
    return res.status(400).json({ error: 'filePath is required' });
  }

  try {
    const explanation = await aiService.explainFile(filePath, codeSnippet, repoContext, model);
    res.json(explanation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/ai/ask', async (req, res) => {
  const { question, repoData, model } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const answer = await aiService.askQuestion(question, repoData || demoRepoData, model);
    res.json(answer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/ai/impact', (req, res) => {
  const { filePath, graphData, filesList } = req.body;
  if (!filePath) {
    return res.status(400).json({ error: 'filePath is required' });
  }

  try {
    const graphToUse = graphData || demoRepoData.graph;
    const filesToUse = filesList || demoRepoData.files;
    const impact = impactAnalyzer.analyze(filePath, graphToUse, filesToUse);
    res.json(impact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/ai/health', (req, res) => {
  const { repoData } = req.body;
  try {
    const health = healthScanner.evaluate(repoData || demoRepoData);
    res.json(health);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/ai/readme', async (req, res) => {
  const { repoData, model } = req.body;
  try {
    const readme = await aiService.generateReadme(repoData || demoRepoData, model);
    res.json(readme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/ai/project-explain', async (req, res) => {
  const { repoData, model } = req.body;
  try {
    const result = await aiService.explainProject(repoData || demoRepoData, model);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
