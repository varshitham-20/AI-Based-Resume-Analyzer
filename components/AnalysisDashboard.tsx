
import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisDashboardProps {
  result: AnalysisResult;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 border-green-200 bg-green-50';
    if (score >= 60) return 'text-yellow-600 border-yellow-200 bg-yellow-50';
    return 'text-red-600 border-red-200 bg-red-50';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center ${getScoreColor(result.score)}`}>
          <span className="text-sm font-medium uppercase tracking-wider mb-1">ATS Score</span>
          <span className="text-5xl font-bold">{result.score}</span>
          <div className="w-full bg-white/50 h-2 rounded-full mt-4 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${getScoreBarColor(result.score)}`} 
              style={{ width: `${result.score}%` }}
            ></div>
          </div>
        </div>
        
        <div className="md:col-span-2 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase">
              {result.domain}
            </span>
            <span className="text-slate-400 text-sm italic">Domain Classified</span>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed italic">
            "{result.summary}"
          </p>
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
            <i className="fa-solid fa-check-circle text-green-500"></i>
            Matched Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.matchedSkills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors">
                {skill}
              </span>
            ))}
            {result.matchedSkills.length === 0 && <p className="text-slate-400 text-sm italic">No matching skills found.</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
            <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
            Missing Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.missingSkills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                {skill}
              </span>
            ))}
            {result.missingSkills.length === 0 && <p className="text-slate-400 text-sm italic">You have all the key skills mentioned!</p>}
          </div>
        </div>
      </div>

      {/* Detailed Insights */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <i className="fa-solid fa-lightbulb text-blue-500"></i>
          Strategic Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h5 className="text-sm font-bold text-green-700 uppercase mb-3">Core Strengths</h5>
            <ul className="space-y-2">
              {result.strengths.map((str, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-600">
                  <i className="fa-solid fa-circle-check text-green-500 mt-1"></i>
                  {str}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-bold text-red-700 uppercase mb-3">Areas to Improve</h5>
            <ul className="space-y-2">
              {result.weaknesses.map((weak, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-600">
                  <i className="fa-solid fa-circle-xmark text-red-400 mt-1"></i>
                  {weak}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Formatting and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-pen-nib text-indigo-500"></i>
            Formatting Review
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed">
            {result.formattingFeedback}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-rocket text-purple-500"></i>
            Growth Roadmap
          </h4>
          <ul className="space-y-3">
            {result.improvementSuggestions.map((sug, idx) => (
              <li key={idx} className="p-3 bg-purple-50 rounded-xl text-xs font-medium text-purple-800 border border-purple-100">
                {sug}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
