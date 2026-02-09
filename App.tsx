
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { AppState } from './types';
import { analyzeResume } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    resumeFile: null,
    resumeBase64: null,
    jobDescription: '',
    isAnalyzing: false,
    result: null,
    error: null,
  });

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      setState(prev => ({ ...prev, error: 'Please upload a PDF file.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      setState(prev => ({
        ...prev,
        resumeFile: file,
        resumeBase64: base64String,
        error: null,
        result: null // Reset result when new file is selected
      }));
    };
    reader.onerror = () => {
      setState(prev => ({ ...prev, error: 'Failed to read file.' }));
    };
    reader.readAsDataURL(file);
  };

  const handleRunAnalysis = async () => {
    if (!state.resumeBase64 || !state.resumeFile) {
      setState(prev => ({ ...prev, error: 'Please upload a resume first.' }));
      return;
    }
    if (!state.jobDescription.trim()) {
      setState(prev => ({ ...prev, error: 'Please enter a job description for matching.' }));
      return;
    }

    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      const analysisResult = await analyzeResume(
        state.resumeBase64,
        state.resumeFile.type,
        state.jobDescription
      );
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        result: analysisResult,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: err.message || 'An unexpected error occurred during analysis.',
      }));
    }
  };

  const handleReset = () => {
    setState({
      resumeFile: null,
      resumeBase64: null,
      jobDescription: '',
      isAnalyzing: false,
      result: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <i className="fa-solid fa-briefcase text-lg"></i>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                ResumeInsight Pro
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-blue-600 transition-colors">How it works</a>
              <a href="#" className="hover:text-blue-600 transition-colors">ATS Guide</a>
              <button 
                onClick={handleReset}
                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyze Resume</h2>
              <p className="text-slate-500 text-sm mb-6">Match your profile with specific job requirements to boost your interview chances.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">1. Upload Resume (PDF)</label>
                  <FileUpload 
                    onFileSelect={handleFileSelect} 
                    selectedFile={state.resumeFile} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">2. Paste Job Description</label>
                  <textarea 
                    className="w-full h-48 p-4 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-sm resize-none"
                    placeholder="Paste the full job description here to compare..."
                    value={state.jobDescription}
                    onChange={(e) => setState(prev => ({ ...prev, jobDescription: e.target.value }))}
                  ></textarea>
                </div>

                {state.error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-3">
                    <i className="fa-solid fa-circle-exclamation mt-0.5"></i>
                    <span>{state.error}</span>
                  </div>
                )}

                <button 
                  onClick={handleRunAnalysis}
                  disabled={state.isAnalyzing}
                  className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-3 shadow-lg transition-all ${
                    state.isAnalyzing 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-blue-200'
                  }`}
                >
                  {state.isAnalyzing ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin"></i>
                      Extracting & Analyzing...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                      Match Resume & Job
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Quick Tips */}
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
              <h3 className="text-blue-800 font-bold mb-3 flex items-center gap-2">
                <i className="fa-solid fa-shield-halved"></i>
                ATS Best Practices
              </h3>
              <ul className="space-y-3 text-sm text-blue-700">
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  Avoid fancy graphics or tables that confuse ATS parsers.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  Use clear headers (Experience, Skills, Education).
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  Use standard fonts like Arial, Helvetica, or Calibri.
                </li>
              </ul>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            {!state.result && !state.isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-300 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                  <i className="fa-solid fa-chart-line text-4xl"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-400">Analysis Results Dashboard</h3>
                <p className="text-slate-400 max-w-xs mt-2">Upload your resume and enter a job description to generate your personalized ATS compatibility report.</p>
              </div>
            )}

            {state.isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm text-center">
                <div className="relative w-32 h-32 mb-8">
                   <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
                   <div className="absolute inset-0 border-8 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <i className="fa-solid fa-robot text-3xl text-blue-600"></i>
                   </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Gemini AI is Processing...</h3>
                <div className="space-y-3 max-w-sm">
                  <p className="text-slate-500 text-sm">Scanning text for keywords and semantic skills.</p>
                  <p className="text-slate-500 text-sm">Evaluating formatting consistency.</p>
                  <p className="text-slate-500 text-sm">Calculating job match percentage.</p>
                </div>
              </div>
            )}

            {state.result && <AnalysisDashboard result={state.result} />}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            Powered by Gemini AI. Your data is processed securely and never stored.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-slate-400 text-lg">
             <i className="fa-brands fa-github hover:text-slate-600 cursor-pointer"></i>
             <i className="fa-brands fa-linkedin hover:text-blue-600 cursor-pointer"></i>
             <i className="fa-brands fa-twitter hover:text-blue-400 cursor-pointer"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
