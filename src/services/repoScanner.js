/**
 * Repository Scanner Service
 * Scans local repositories safely, extracting AST metadata, imports, dependencies,
 * metrics, and generates a structured dependency graph.
 */

const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.github',
  '.svn',
  '.hg',
  'dist',
  'build',
  'out',
  'coverage',
  '.next',
  '.nuxt',
  'vendor',
  '.idea',
  '.vscode',
  '__pycache__',
  '.pytest_cache',
  'target',
  'bin',
  'obj'
]);

const IGNORED_FILES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'npm-debug.log',
  'yarn-debug.log',
  'yarn-error.log',
  '.DS_Store',
  'Thumbs.db'
]);

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.svg',
  '.pdf', '.zip', '.tar', '.gz', '.7z', '.rar',
  '.exe', '.dll', '.so', '.dylib', '.bin',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.mp4', '.webm', '.mp3', '.wav', '.ogg',
  '.iso', '.dmg', '.sqlite', '.db'
]);

class RepoScanner {
  /**
   * Scan a repository at given absolute or relative directory path
   */
  async scan(repoPath, options = {}) {
    const absPath = path.resolve(repoPath);

    if (!fs.existsSync(absPath)) {
      throw new Error(`Repository path not found: "${repoPath}"`);
    }

    const stat = fs.statSync(absPath);
    if (!stat.isDirectory()) {
      throw new Error(`Path is not a directory: "${repoPath}"`);
    }

    const repoName = path.basename(absPath) || 'Repository';
    const files = [];
    const directories = new Set();
    const externalDeps = new Set();
    const entryPoints = [];

    // Walk tree
    this.walk(absPath, absPath, files, directories, options);

    // Parse package.json if present
    const pkgPath = path.join(absPath, 'package.json');
    let packageInfo = null;
    if (fs.existsSync(pkgPath)) {
      try {
        const pkgData = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        packageInfo = {
          name: pkgData.name || repoName,
          version: pkgData.version || '1.0.0',
          description: pkgData.description || '',
          scripts: Object.keys(pkgData.scripts || {}),
          dependencies: Object.keys(pkgData.dependencies || {}),
          devDependencies: Object.keys(pkgData.devDependencies || {})
        };
        packageInfo.dependencies.forEach(d => externalDeps.add(d));
      } catch (e) {
        // ignore parse error
      }
    }

    // Identify entry points
    for (const f of files) {
      const lower = f.name.toLowerCase();
      if (
        lower === 'index.js' || lower === 'index.ts' ||
        lower === 'app.js' || lower === 'app.ts' ||
        lower === 'server.js' || lower === 'server.ts' ||
        lower === 'main.js' || lower === 'main.py' ||
        lower === 'index.html'
      ) {
        entryPoints.push(f.relativePath);
      }
    }

    // Build graph nodes & edges
    const { nodes, edges } = this.buildGraph(files, absPath, packageInfo);

    // Language stats & LOC
    const languages = {};
    let totalLines = 0;
    files.forEach(f => {
      const lang = this.getLanguageName(f.extension);
      languages[lang] = (languages[lang] || 0) + 1;
      totalLines += f.lines || 0;
    });

    // Modules/directories set
    const moduleNames = Array.from(directories);

    return {
      repoName: packageInfo?.name || repoName,
      repoPath: absPath,
      description: packageInfo?.description || 'Scanned local repository',
      scannedAt: new Date().toISOString(),
      stats: {
        totalFiles: files.length,
        totalDirectories: directories.size,
        totalDependencies: externalDeps.size || packageInfo?.dependencies?.length || 0,
        totalModules: moduleNames.length,
        totalLines,
        languages
      },
      entryPoints,
      files,
      directories: moduleNames,
      packageInfo,
      graph: {
        nodes,
        edges
      }
    };
  }

  /**
   * Recursive directory walker
   */
  walk(currentDir, rootDir, files, directories, options, depth = 0) {
    if (depth > (options.maxDepth || 14)) return;
    if (files.length >= (options.maxFiles || 2500)) return;

    let entries;
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch (e) {
      return; // permission denied or unreadable
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

      // Check ignore
      if (entry.name.startsWith('.env') && !entry.name.endsWith('.example')) {
        continue; // Never read secrets
      }

      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(entry.name)) continue;
        directories.add(relPath);
        this.walk(fullPath, rootDir, files, directories, options, depth + 1);
      } else if (entry.isFile()) {
        if (IGNORED_FILES.has(entry.name)) continue;
        const ext = path.extname(entry.name).toLowerCase();
        if (BINARY_EXTENSIONS.has(ext)) continue;

        try {
          const stat = fs.statSync(fullPath);
          // Skip files larger than 1MB
          if (stat.size > 1024 * 1024) continue;

          // Read content to extract imports, lines, exports
          let content = '';
          let lines = 0;
          try {
            content = fs.readFileSync(fullPath, 'utf8');
            lines = content.split('\n').length;
          } catch (e) {
            // binary or encoding issue
          }

          const role = this.inferRole(relPath, entry.name, ext);
          const { imports, exports, externalImports } = this.parseImports(content, ext, relPath);

          files.push({
            id: relPath,
            name: entry.name,
            relativePath: relPath,
            directory: path.dirname(relPath).replace(/\\/g, '/'),
            extension: ext,
            size: stat.size,
            lines,
            role,
            imports,
            externalImports,
            exports
          });
        } catch (e) {
          // ignore unreadable file
        }
      }
    }
  }

  /**
   * Infer architectural role of a file
   */
  inferRole(relPath, fileName, ext) {
    const lower = relPath.toLowerCase();
    const name = fileName.toLowerCase();

    if (name.includes('test') || name.includes('spec') || lower.includes('/__tests__/')) return 'test';
    if (name.startsWith('readme') || ext === '.md' || lower.includes('/docs/')) return 'documentation';
    if (lower.includes('service') || lower.includes('client') || lower.includes('api') || name.includes('auth')) return 'service';
    if (lower.includes('component') || lower.includes('view') || lower.includes('ui') || ext === '.html' || ext === '.vue') return 'component';
    if (lower.includes('controller') || lower.includes('route') || lower.includes('handler')) return 'controller';
    if (lower.includes('model') || lower.includes('schema') || lower.includes('entity') || lower.includes('db')) return 'model';
    if (lower.includes('util') || lower.includes('helper') || lower.includes('tool')) return 'util';
    if (name.includes('config') || ext === '.json' || ext === '.yaml' || ext === '.yml' || name.startsWith('.')) return 'config';
    if (ext === '.css' || ext === '.scss' || ext === '.less') return 'style';

    return 'module';
  }

  /**
   * Parse imports and exports from file content
   */
  parseImports(content, ext, filePath) {
    const imports = [];
    const externalImports = [];
    const exports = [];

    if (!content) return { imports, exports, externalImports };

    // JS / TS / JSX / TSX
    if (['.js', '.mjs', '.cjs', '.ts', '.jsx', '.tsx'].includes(ext)) {
      // ES6 imports: import ... from '...'
      const es6Regex = /import\s+(?:[\w\s{},*]+from\s+)?['"]([^'"]+)['"]/g;
      let match;
      while ((match = es6Regex.exec(content)) !== null) {
        const importTarget = match[1];
        if (importTarget.startsWith('.')) {
          imports.push(importTarget);
        } else {
          externalImports.push(importTarget.split('/')[0]);
        }
      }

      // dynamic import('...')
      const dynamicRegex = /import\(['"]([^'"]+)['"]\)/g;
      while ((match = dynamicRegex.exec(content)) !== null) {
        if (match[1].startsWith('.')) {
          imports.push(match[1]);
        } else {
          externalImports.push(match[1].split('/')[0]);
        }
      }

      // CommonJS require('...')
      const cjsRegex = /require\(['"]([^'"]+)['"]\)/g;
      while ((match = cjsRegex.exec(content)) !== null) {
        if (match[1].startsWith('.')) {
          imports.push(match[1]);
        } else {
          externalImports.push(match[1].split('/')[0]);
        }
      }

      // Exports
      const exportRegex = /export\s+(?:default\s+)?(?:class|function|const|let|var|interface|type)\s+([a-zA-Z0-9_$]+)/g;
      while ((match = exportRegex.exec(content)) !== null) {
        exports.push(match[1]);
      }
    }

    // Python
    if (ext === '.py') {
      const pyFrom = /^from\s+([a-zA-Z0-9_.]+)\s+import/gm;
      let match;
      while ((match = pyFrom.exec(content)) !== null) {
        imports.push(match[1]);
      }
      const pyImport = /^import\s+([a-zA-Z0-9_.]+)/gm;
      while ((match = pyImport.exec(content)) !== null) {
        imports.push(match[1]);
      }
    }

    return {
      imports: [...new Set(imports)],
      externalImports: [...new Set(externalImports)],
      exports: [...new Set(exports)]
    };
  }

  /**
   * Build Cytoscape graph nodes and edges
   */
  buildGraph(files, absRoot, packageInfo) {
    const fileMap = new Map();
    files.forEach(f => fileMap.set(f.relativePath, f));

    const nodes = [];
    const edges = [];
    const edgeSet = new Set();

    // Map of directories
    const dirModules = new Set();

    // Add nodes for files
    files.forEach(f => {
      dirModules.add(f.directory);
      nodes.push({
        data: {
          id: f.relativePath,
          label: f.name,
          path: f.relativePath,
          directory: f.directory,
          role: f.role,
          size: f.size,
          lines: f.lines,
          exportsCount: f.exports.length,
          importsCount: f.imports.length,
          type: 'file'
        }
      });
    });

    // Create edges based on local imports
    files.forEach(sourceFile => {
      sourceFile.imports.forEach(imp => {
        // Resolve target relative path
        const resolved = this.resolveImportPath(sourceFile.relativePath, imp, fileMap);
        if (resolved) {
          const edgeId = `${sourceFile.relativePath}->${resolved}`;
          if (!edgeSet.has(edgeId)) {
            edgeSet.add(edgeId);
            edges.push({
              data: {
                id: edgeId,
                source: sourceFile.relativePath,
                target: resolved,
                label: 'imports',
                type: 'import'
              }
            });
          }
        }
      });
    });

    return { nodes, edges };
  }

  /**
   * Resolve an import string relative to source file
   */
  resolveImportPath(sourcePath, importStr, fileMap) {
    const sourceDir = path.dirname(sourcePath);
    const candidateBase = path.normalize(path.join(sourceDir, importStr)).replace(/\\/g, '/');

    // Exact match
    if (fileMap.has(candidateBase)) return candidateBase;

    // Check with standard extensions
    const exts = ['.js', '.jsx', '.ts', '.tsx', '.json', '.mjs'];
    for (const ext of exts) {
      const candidate = candidateBase + ext;
      if (fileMap.has(candidate)) return candidate;
    }

    // Check index file
    for (const ext of exts) {
      const candidate = path.join(candidateBase, 'index' + ext).replace(/\\/g, '/');
      if (fileMap.has(candidate)) return candidate;
    }

    return null;
  }

  /**
   * Get clean language name
   */
  getLanguageName(ext) {
    switch (ext) {
      case '.js':
      case '.mjs':
      case '.cjs': return 'JavaScript';
      case '.ts': return 'TypeScript';
      case '.jsx': return 'React JSX';
      case '.tsx': return 'React TSX';
      case '.py': return 'Python';
      case '.html': return 'HTML';
      case '.css':
      case '.scss': return 'CSS';
      case '.json': return 'JSON';
      case '.md': return 'Markdown';
      case '.sh': return 'Shell';
      default: return ext ? ext.substring(1).toUpperCase() : 'Plain';
    }
  }

  /**
   * Read safe file snippet for code preview
   */
  readFileContent(repoPath, relativeFilePath, maxLines = 1500) {
    const absPath = path.resolve(repoPath, relativeFilePath);
    const resolvedRoot = path.resolve(repoPath);

    // Prevent path traversal
    if (!absPath.startsWith(resolvedRoot)) {
      throw new Error('Access denied: path traversal detected');
    }

    if (!fs.existsSync(absPath)) {
      throw new Error('File not found');
    }

    const content = fs.readFileSync(absPath, 'utf8');
    const lines = content.split('\n');
    const truncated = lines.length > maxLines;
    const finalContent = truncated ? lines.slice(0, maxLines).join('\n') + '\n\n// ... [Content truncated for preview]' : content;

    return {
      content: finalContent,
      lines: lines.length,
      truncated,
      path: relativeFilePath
    };
  }
}

module.exports = new RepoScanner();
