import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CoverageData } from '../types';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface CoverageChartProps {
  data: CoverageData[];
  onPageChange: (startIndex: number, endIndex: number) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-xl bg-gray-800/70 p-4 rounded-lg border border-gray-700/50 shadow-xl">
        <p className="text-gray-200 font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(1)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function CoverageChart({ data, onPageChange }: CoverageChartProps) {
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const chartData = data.slice(startIndex, endIndex).map(item => ({
    name: item.file.split('/').pop(),
    coverage: item.coverage,
    impact: item.impactScore,
  }));

  useEffect(() => {
    onPageChange(startIndex, endIndex);
  }, [currentPage, onPageChange, startIndex, endIndex]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-200 font-medium">Coverage Overview</h3>
        <button
          className="text-gray-400 hover:text-gray-200 relative group"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info className="w-5 h-5" />
          {showInfo && (
            <div className="absolute right-0 top-full mt-2 w-80 p-4 rounded-lg backdrop-blur-xl bg-gray-800/70 border border-gray-700/50 shadow-xl z-10">
              <h4 className="text-gray-200 font-medium mb-2">How we calculate impact:</h4>
              <p className="text-sm text-gray-300 mb-3">
                Impact Score = (100 - coverage%) × log(total statements + 1) × log(uncovered blocks + 1)
              </p>
              <p className="text-sm text-gray-400">
                This formula prioritizes files with low coverage, high complexity (statements), and many uncovered blocks.
              </p>
            </div>
          )}
        </button>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              stroke="#8884d8"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#82ca9d"
              tick={{ fill: '#9CA3AF' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar yAxisId="left" dataKey="coverage" fill="#8884d8" name="Coverage %" />
            <Bar yAxisId="right" dataKey="impact" fill="#82ca9d" name="Impact Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="p-2 rounded-full hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-gray-300" />
          </button>
          <span className="text-gray-300">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="p-2 rounded-full hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      )}
    </div>
  );
}