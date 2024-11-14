import type { CoverageData, FileAnalysis } from '../types';

export function analyzeCoverageFile(content: string, threshold: number = 80): FileAnalysis {
  const lines = content.split('\n');
  const coverageMap = new Map<string, {
    total: number;
    covered: number;
    uncoveredBlocks: string[];
  }>();

  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(' ');
    if (parts.length < 2) continue;

    const fileRange = parts[0];
    const [file] = fileRange.split(':');
    const statements = parseInt(parts[1]);
    const count = parseInt(parts[2]);

    if (!coverageMap.has(file)) {
      coverageMap.set(file, { total: 0, covered: 0, uncoveredBlocks: [] });
    }

    const fileData = coverageMap.get(file)!;
    fileData.total += statements;
    if (count > 0) {
      fileData.covered += statements;
    } else {
      fileData.uncoveredBlocks.push(fileRange);
    }
  }

  const coverageData: CoverageData[] = [];
  coverageMap.forEach((data, file) => {
    const coverage = (data.covered / data.total) * 100;
    const impactScore = calculateImpactScore(coverage, data.total, data.uncoveredBlocks.length);
    
    coverageData.push({
      file,
      coverage,
      totalStatements: data.total,
      uncoveredBlocks: data.uncoveredBlocks,
      impactScore,
    });
  });

  // Sort by impact score descending
  coverageData.sort((a, b) => b.impactScore - a.impactScore);

  return {
    coverageData,
    threshold,
  };
}

function calculateImpactScore(coverage: number, totalStatements: number, uncoveredBlocks: number): number {
  return (100 - coverage) * Math.log(totalStatements + 1) * Math.log(uncoveredBlocks + 1);
}