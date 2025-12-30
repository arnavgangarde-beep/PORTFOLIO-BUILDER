
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI client using the environment variable directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhanceBio = async (name: string, title: string, currentBio: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As an expert career coach, write a professional and compelling "About Me" summary for a portfolio website. 
    Name: ${name}
    Current Title: ${title}
    Draft Notes: ${currentBio}
    
    Make it professional yet personable. Keep it between 2-3 paragraphs.`,
  });
  return response.text;
};

export const generateProjectStory = async (title: string, description: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Convert this project description into a structured story using the Problem-Approach-Solution-Outcome framework.
    Project: ${title}
    Description: ${description}
    
    Format the output as a JSON object with keys: problem, approach, solution, outcome.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          problem: { type: Type.STRING },
          approach: { type: Type.STRING },
          solution: { type: Type.STRING },
          outcome: { type: Type.STRING }
        },
        required: ["problem", "approach", "solution", "outcome"]
      }
    }
  });
  
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return null;
  }
};

export const suggestBrandKeywords = async (title: string, bio: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on this professional profile, suggest 5-8 short "Personal Brand Keywords" or punchy phrases (e.g., "Full-stack Evangelist", "Data-driven Strategist", "UX Perfectionist").
    Title: ${title}
    Bio: ${bio}
    
    Return only a comma-separated list.`,
  });
  const text = response.text || '';
  return text.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
};

export const enhanceProjectDescription = async (title: string, description: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Rewrite this project description for a professional portfolio. Make it focus on impact, technologies used, and technical challenges solved.
    Project: ${title}
    Current Description: ${description}`,
  });
  return response.text;
};

export const suggestSkills = async (title: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `List 10 highly relevant skills (technical and soft) for a professional with the title: ${title}. Return only a comma-separated list.`,
  });
  const text = response.text || '';
  return text.split(',').map(s => s.trim());
};
