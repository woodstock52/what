
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TaxQueryResponse, GroundingSource } from "../types";

const MODEL_NAME = 'gemini-3-pro-preview';

export const queryTaxExpert = async (prompt: string): Promise<TaxQueryResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const systemInstruction = `You are a world-class UAE Tax Consultant and Legal Expert specializing in Federal Tax Authority (FTA) regulations. 
Your goal is to provide precise, accurate, and comprehensive answers regarding:
1. UAE Corporate Tax (Federal Decree-Law No. 47 of 2022 and related decisions).
2. UAE Value Added Tax (VAT) (Federal Decree-Law No. 8 of 2017 and its amendments).
3. UAE Excise Tax (Federal Decree-Law No. 7 of 2017).
4. Administrative Penalties and Tax Procedures.

STRUCTURE YOUR RESPONSE:
- **Direct Answer**: A clear summary of the tax treatment.
- **Legal Basis**: Explicitly cite the Decree-Law, Executive Regulation, or Public Clarification. Include the Article Number and Clause Number.
- **Practical Implementation**: Step-by-step guidance on how the taxpayer should apply this (e.g., registration, filing, documentation).

CRITICAL RULES:
- Use Google Search grounding to verify the LATEST updates from the FTA website (tax.gov.ae).
- Be extremely precise with law titles and article numbers.
- IF YOU ARE UNCERTAIN or the information is not publicly available/finalized by the FTA, explicitly state: "Based on current available public information, I cannot provide a definitive legal basis for this specific query. I recommend consulting the official FTA portal or a registered tax agent."
- DO NOT HALLUCINATE article numbers.
- Answer in the same language as the user's query (English or Chinese).`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.2, // Lower temperature for more factual consistency
      },
    });

    const answer = response.text || "I apologize, but I couldn't generate a response at this time.";
    
    // Extract grounding sources
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          // Avoid duplicates
          if (!sources.find(s => s.uri === chunk.web.uri)) {
            sources.push({
              title: chunk.web.title,
              uri: chunk.web.uri
            });
          }
        }
      });
    }

    return { answer, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to communicate with the Tax Expert service. Please try again later.");
  }
};
