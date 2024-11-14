export interface CoverageData {
  file: string;
  coverage: number;
  totalStatements: number;
  uncoveredBlocks: string[];
  impactScore: number;
}

export interface FileAnalysis {
  coverageData: CoverageData[];
  threshold: number;
}