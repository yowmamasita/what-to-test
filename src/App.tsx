import React, { useState, useRef, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { CoverageChart } from './components/CoverageChart';
import { RecommendationCard } from './components/RecommendationCard';
import { analyzeCoverageFile } from './utils/coverageAnalyzer';
import { FileAnalysis } from './types';
import { BarChart3, FileWarning } from 'lucide-react';

export default function App() {
  const [analysis, setAnalysis] = useState<FileAnalysis | null>(null);
  const [visibleRange, setVisibleRange] = useState<{ start: number; end: number }>({ start: 0, end: 8 });
  const recommendationsRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (content: string) => {
    const result = analyzeCoverageFile(content);
    setAnalysis(result);
  };

  const handlePageChange = (startIndex: number, endIndex: number) => {
    setVisibleRange({ start: startIndex, end: endIndex });
    
    // Scroll to the first visible recommendation
    if (recommendationsRef.current) {
      const firstCard = recommendationsRef.current.children[startIndex];
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <FileWarning className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">Coverage Analyzer</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!analysis ? (
          <div className="max-w-2xl mx-auto">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gray-700/50">
              <CoverageChart 
                data={analysis.coverageData} 
                onPageChange={handlePageChange}
              />
            </div>

            <div 
              ref={recommendationsRef}
              className="grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto pr-4 scroll-smooth"
            >
              {analysis.coverageData.map((data, index) => (
                <RecommendationCard
                  key={data.file}
                  data={data}
                  threshold={analysis.threshold}
                  isHighlighted={index >= visibleRange.start && index < visibleRange.end}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}