import { GoogleGenAI, type Schema } from "@google/genai";

export const GEMINI_MODEL = "gemini-3.6-flash";

export function isGeminiReady() {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  return new GoogleGenAI({ apiKey });
}

export const schemaFotoRefeicao = {
  type: "object",
  properties: {
    itens: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nome: { type: "string" },
          gramas_estimadas: { type: "number" },
          confianca: { type: "string", enum: ["baixa", "media", "alta"] },
        },
        required: ["nome", "gramas_estimadas", "confianca"],
      },
    },
    kcal_total: { type: "number" },
    proteina_g: { type: "number" },
    carboidrato_g: { type: "number" },
    gordura_g: { type: "number" },
    sodio_mg: { type: "number" },
  },
  required: [
    "itens",
    "kcal_total",
    "proteina_g",
    "carboidrato_g",
    "gordura_g",
    "sodio_mg",
  ],
} as unknown as Schema;

export const schemaVeredito = {
  type: "object",
  properties: {
    status: {
      type: "string",
      enum: ["no_caminho", "atencao", "fora_da_meta"],
    },
    resumo: { type: "string" },
    alertas: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nutriente: { type: "string" },
          mensagem: { type: "string" },
          severidade: { type: "string", enum: ["baixa", "media", "alta"] },
        },
        required: ["nutriente", "mensagem", "severidade"],
      },
    },
  },
  required: ["status", "resumo", "alertas"],
} as unknown as Schema;
