
export interface AnalysisResult {
  score: number;
  domain: string;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  formattingFeedback: string;
}

export interface AppState {
  resumeFile: File | null;
  resumeBase64: string | null;
  jobDescription: string;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}
