/**
 * Repo X-Ray Server
 * Local-First AI Codebase Intelligence Tool
 */

const express = require('express');
const path = require('path');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 3888;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', apiRoutes);

// Fallback route to index.html for SPA behavior
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start listening
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`  REPO X-RAY — See inside your codebase.`);
  console.log(`  Local AI Intelligence Server`);
  console.log(`  Running at: http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});

module.exports = app;
