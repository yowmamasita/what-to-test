import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import type { CoverageData } from '../types';

interface RecommendationCardProps {
  data: CoverageData;
  threshold: number;
  isHighlighted: boolean;
}

export function RecommendationCard({ data, threshold, isHighlighted }: RecommendationCardProps) {
  const getIcon = () => {
    if (data.coverage < 50) return <AlertCircle className="w-6 h-6 text-red-400" />;
    if (data.coverage < threshold) return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
    return <CheckCircle className="w-6 h-6 text-green-400" />;
  };

  const getRecommendation = () => {
    if (data.coverage < 50) {
      return "Critical: Prioritize adding comprehensive tests";
    } else if (data.coverage < threshold) {
      return "Warning: Add tests for uncovered blocks";
    }
    return "Good coverage maintained";
  };

  return (
    <div className={`
      transition-all duration-200 ease-in-out
      ${isHighlighted 
        ? 'bg-gray-800/50 backdrop-blur-sm border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
        : 'bg-gray-800/30 border-gray-700/50 opacity-50'
      }
      rounded-lg p-6 border
    `}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <h3 className="text-lg font-semibold text-white">{data.file.split('/').pop()}</h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">{data.coverage.toFixed(1)}%</span>
          <p className="text-sm text-gray-400">Coverage</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <p className="text-gray-300">{getRecommendation()}</p>
        
        <div className="mt-4">
          <h4 className="font-medium mb-2 text-gray-200">Impact Metrics:</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Total Statements</p>
              <p className="font-medium text-gray-200">{data.totalStatements}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Impact Score</p>
              <p className="font-medium text-gray-200">{data.impactScore.toFixed(0)}</p>
            </div>
          </div>
        </div>

        {data.uncoveredBlocks.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2 text-gray-200">Uncovered Blocks:</h4>
            <div className="bg-gray-900/50 backdrop-blur-sm p-3 rounded-md">
              <ul className="text-sm text-gray-300 space-y-1">
                {data.uncoveredBlocks.slice(0, 3).map((block, index) => (
                  <li key={index} className="font-mono">{block}</li>
                ))}
                {data.uncoveredBlocks.length > 3 && (
                  <li className="text-gray-500">
                    ...and {data.uncoveredBlocks.length - 3} more
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}