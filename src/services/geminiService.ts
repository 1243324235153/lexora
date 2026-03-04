import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
Du är Lexora, en AI-baserad juristassistent för företag och organisationer.
Ditt uppdrag är att göra juridik begriplig, kontextuell och handlingsbar för företag.
Du hjälper till att tolka lagar, regler och krav i relation till den egna verksamheten.

När en användare ställer en fråga, svara på ett professionellt, tydligt och strukturerat sätt.
Använd klarspråk (svenska).
Du ska ge tolkningar, sammanfattningar och rekommendationer, men du måste också vara tydlig med att du är ett beslutsstöd och inte ger slutgiltig juridisk rådgivning.
`;

export interface LexoraResponse {
  summary: string;
  legislation: string;
  interpretation: string;
  recommendations: string[];
  riskLevel: "Låg" | "Medel" | "Hög";
}

export async function askLexora(prompt: string): Promise<LexoraResponse | string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "Kort sammanfattning av svaret.",
            },
            legislation: {
              type: Type.STRING,
              description: "Relevant lagstiftning (hänvisa till lagrum).",
            },
            interpretation: {
              type: Type.STRING,
              description: "Kontextuell tolkning (vad det betyder för företaget).",
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Rekommendationer / Nästa steg.",
            },
            riskLevel: {
              type: Type.STRING,
              description: "Bedömd risknivå (Låg, Medel, Hög).",
            },
          },
          required: ["summary", "legislation", "interpretation", "recommendations", "riskLevel"],
        },
      },
    });
    
    if (!response.text) return "Kunde inte generera ett svar.";
    return JSON.parse(response.text) as LexoraResponse;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Ett fel uppstod vid kommunikation med Lexora. Vänligen försök igen senare.";
  }
}
