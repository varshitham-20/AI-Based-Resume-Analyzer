
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.NUMBER,
      description: "ATS compatibility score from 0 to 100 based on the job description match.",
    },
    domain: {
      type: Type.STRING,
      description: "The professional domain of the resume (e.g., Data Science, Web Development).",
    },
    summary: {
      type: Type.STRING,
      description: "A professional summary of the candidate's profile in relation to the role.",
    },
    matchedSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of technical and soft skills found in the resume that match the job description.",
    },
    missingSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Crucial skills found in the job description but missing from the resume.",
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key strengths identified in the resume content.",
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Identified areas of improvement or missing context in the resume.",
    },
    improvementSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Actionable tips to improve the resume impact and ATS ranking.",
    },
    formattingFeedback: {
      type: Type.STRING,
      description: "Feedback on resume structure, readability, and ATS-friendliness.",
    },
  },
  required: [
    "score",
    "domain",
    "summary",
    "matchedSkills",
    "missingSkills",
    "strengths",
    "weaknesses",
    "improvementSuggestions",
    "formattingFeedback"
  ],
};

export async function analyzeResume(
  base64Data: string,
  mimeType: string,
  jobDescription: string
): Promise<AnalysisResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: `Act as an expert ATS (Applicant Tracking System) and Senior Technical Recruiter. 
              Analyze the provided resume against this Job Description:
              
              --- JOB DESCRIPTION ---
              ${jobDescription}
              --- END JOB DESCRIPTION ---
              
              Perform a deep analysis of the resume content, structure, and keyword matching.
              Calculate an ATS score from 0-100.
              Identify specific skills present and missing.
              Classify the domain.
              Provide constructive feedback for improvement.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    if (!response.text) {
      throw new Error("Failed to get analysis from Gemini.");
    }

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
}
