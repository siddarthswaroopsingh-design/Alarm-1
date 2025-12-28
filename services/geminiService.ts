
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getDetailedSystemStats = async (lat?: number, lng?: number): Promise<string> => {
  try {
    const locationStr = lat && lng ? `Latitude: ${lat}, Longitude: ${lng}` : "Current User Location";
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform an urgent planetary data sweep for: ${locationStr}. 
      Use Google Search to find:
      1. Current Temperature
      2. Air Quality Index (AQI)
      3. Wind Speed/Direction
      4. Sunrise and Sunset times
      5. Recommendation for outer activity.
      
      CRITICAL: Add a final section titled "NEURAL MOTIVATION" with a single, powerful 1-sentence motivation line in the style of a futuristic sci-fi commander (e.g., 'The stars do not wait for the hesitant. Forge your destiny.').
      
      Format as a concise high-tech system report.`,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      }
    });
    return response.text || "Systems operational. Environmental sensors unresponsive.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to planetary sensors. Local telemetry only.";
  }
};

export const generateVoiceAnnouncement = async (text: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Announce with a calm, futuristic AI voice: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    return undefined;
  }
};
