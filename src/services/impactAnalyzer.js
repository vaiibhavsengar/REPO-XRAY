/**
 * Impact Analyzer Service
 * Calculates the ripple effect, blast radius, and dependency risks of modifying or deleting a file.
 */

class ImpactAnalyzer {
  /**
   * Analyze the impact of changing targetFilePath in the repository graph
   */
  analyze(targetFilePath, graphData, filesList = []) {
    const nodes = graphData?.nodes || [];
    const edges = graphData?.edges || [];

    // Normalize target path
    const target = targetFilePath.replace(/\\/g, '/');

    // Build adjacency maps
    // incoming: target is imported by source (source -> target in graph)
    const reverseAdj = new Map(); // target -> [sources that import target]
    const forwardAdj = new Map(); // source -> [targets that source imports]

    edges.forEach(e => {
      const src = e.data.source;
      const tgt = e.data.target;

      if (!forwardAdj.has(src)) forwardAdj.set(src, new Set());
      forwardAdj.get(src).add(tgt);

      if (!reverseAdj.has(tgt)) reverseAdj.set(tgt, new Set());
      reverseAdj.get(tgt).add(src);
    });

    // 1. Direct Dependents (Who imports target directly)
    const directDependents = Array.from(reverseAdj.get(target) || []);

    // 2. Transitive Dependents (BFS traversal of reverse graph)
    const visited = new Set([target]);
    const queue = [...directDependents.map(f => ({ file: f, depth: 1 }))];
    const transitiveMap = new Map(); // file -> depth

    directDependents.forEach(f => {
      visited.add(f);
      transitiveMap.set(f, 1);
    });

    while (queue.length > 0) {
      const { file, depth } = queue.shift();
      const callers = reverseAdj.get(file);
      if (callers) {
        for (const caller of callers) {
          if (!visited.has(caller)) {
            visited.add(caller);
            transitiveMap.set(caller, depth + 1);
            queue.push({ file: caller, depth: depth + 1 });
          }
        }
      }
    }

    const allDependentFiles = Array.from(transitiveMap.keys());
    const outgoingDependencies = Array.from(forwardAdj.get(target) || []);

    // 3. Compute Blast Radius & Severity
    const totalRepoFiles = Math.max(nodes.length, 1);
    const affectedRatio = (allDependentFiles.length + 1) / totalRepoFiles;

    let impactLevel = 'LOW';
    let impactColor = '#10b981'; // emerald

    const isCoreService = target.includes('auth') || target.includes('firebase') || target.includes('db') || target.includes('api') || target.includes('config');
    const isEntryPoint = target.includes('index') || target.includes('app') || target.includes('server');

    if (affectedRatio > 0.15 || allDependentFiles.length >= 8 || isCoreService || isEntryPoint) {
      impactLevel = 'HIGH';
      impactColor = '#ef4444'; // rose/red
    } else if (affectedRatio > 0.05 || allDependentFiles.length >= 3) {
      impactLevel = 'MEDIUM';
      impactColor = '#f59e0b'; // amber
    }

    // 4. Affected Functional Areas
    const areas = new Set();
    const filesToExamine = [target, ...allDependentFiles];
    filesToExamine.forEach(f => {
      const lower = f.toLowerCase();
      if (lower.includes('auth') || lower.includes('login') || lower.includes('token')) areas.add('Authentication');
      if (lower.includes('dash') || lower.includes('overview') || lower.includes('metric')) areas.add('Dashboard');
      if (lower.includes('user') || lower.includes('profile') || lower.includes('account')) areas.add('User Profile');
      if (lower.includes('session') || lower.includes('cookie') || lower.includes('state')) areas.add('Session Management');
      if (lower.includes('api') || lower.includes('client') || lower.includes('fetch')) areas.add('API Gateway');
      if (lower.includes('fire') || lower.includes('db') || lower.includes('store')) areas.add('Data Layer');
      if (lower.includes('setting') || lower.includes('pref')) areas.add('Settings');
      if (lower.includes('nav') || lower.includes('header') || lower.includes('sidebar')) areas.add('Navigation UI');
      if (lower.includes('util') || lower.includes('help')) areas.add('Core Utilities');
    });

    if (areas.size === 0) {
      areas.add('Module Core');
    }

    // 5. Build Sub-graph for Impact Visualizer
    const subNodes = [];
    const subEdges = [];
    const subNodeIds = new Set([target, ...allDependentFiles]);

    nodes.forEach(n => {
      if (subNodeIds.has(n.data.id)) {
        subNodes.push({
          ...n,
          data: {
            ...n.data,
            isTarget: n.data.id === target,
            depth: n.data.id === target ? 0 : (transitiveMap.get(n.data.id) || 1)
          }
        });
      }
    });

    edges.forEach(e => {
      if (subNodeIds.has(e.data.source) && subNodeIds.has(e.data.target)) {
        subEdges.push(e);
      }
    });

    // 6. Actionable recommendations before changing
    const recommendations = this.generateRecommendations(target, impactLevel, directDependents.length, allDependentFiles.length, Array.from(areas));

    return {
      targetFile: target,
      impactLevel,
      impactColor,
      stats: {
        directDependentsCount: directDependents.length,
        totalAffectedFilesCount: allDependentFiles.length,
        outgoingDependenciesCount: outgoingDependencies.length,
        blastRadiusPercentage: Math.round(affectedRatio * 100),
        maxDependencyDepth: Math.max(0, ...Array.from(transitiveMap.values()))
      },
      affectedAreas: Array.from(areas),
      directDependents,
      transitiveDependents: allDependentFiles.map(file => ({
        file,
        depth: transitiveMap.get(file)
      })),
      outgoingDependencies,
      recommendations,
      subGraph: {
        nodes: subNodes,
        edges: subEdges
      }
    };
  }

  generateRecommendations(target, impactLevel, directCount, totalCount, areas) {
    const list = [];

    if (impactLevel === 'HIGH') {
      list.push(`High blast radius: Modifying this file directly impacts ${directCount} direct consumers and cascades to ${totalCount} files across ${areas.slice(0, 3).join(', ')}.`);
      list.push('Preserve existing exported function signatures and interfaces to prevent silent runtime breakage.');
      list.push('Stage changes behind a feature flag or deprecation warning before modifying core behavior.');
      list.push(`Ensure regression test suites covering ${areas.slice(0, 2).join(' and ')} pass in local environment.`);
    } else if (impactLevel === 'MEDIUM') {
      list.push(`Moderate blast radius: ${directCount} direct modules consume symbols from this file.`);
      list.push('Review parameter types and return contracts in consumers before committing changes.');
      list.push('Run integration checks for ' + areas.join(', '));
    } else {
      list.push('Low blast radius: This file has minimal dependents and changes are well-isolated.');
      list.push('Check local component imports and syntax tests.');
    }

    return list;
  }
}

module.exports = new ImpactAnalyzer();
