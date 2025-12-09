import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

// Initialize the client
// IMPORTANT: We create a new instance per request in the component if strictly following guidelines 
// to ensure key freshness, but for a global service, we can init here if the env var is static.
// However, to be safe with potential dynamic key updates in some environments, 
// we'll instantiate inside the function or assume process.env.API_KEY is stable.
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Edits an image using Gemini 2.5 Flash Image model based on a text prompt.
 * 
 * @param base64Image The raw base64 string of the image (without data URI prefix).
 * @param mimeType The MIME type of the image (e.g., 'image/png').
 * @param prompt The text instruction for editing.
 * @returns A promise that resolves to the data URI of the generated image.
 */
export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Iterate through parts to find the image
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini API.");
    }

    const parts = candidates[0].content.parts;
    let generatedImageBase64: string | null = null;

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        generatedImageBase64 = part.inlineData.data;
        break; 
      }
    }

    if (!generatedImageBase64) {
      // Sometimes models might refuse and return text explaining why.
      const textPart = parts.find(p => p.text);
      if (textPart && textPart.text) {
        throw new Error(`Model returned text instead of image: ${textPart.text}`);
      }
      throw new Error("Model did not return an image.");
    }

    // Return as a usable Data URI
    return `data:image/png;base64,${generatedImageBase64}`;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to process image.");
  }
};
