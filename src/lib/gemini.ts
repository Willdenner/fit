import { z } from "zod";

export const GEMINI_MODEL = "google/gemini-3.6-flash";

export function isAiGatewayReady() {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY ||
      process.env.VERCEL_OIDC_TOKEN ||
      process.env.VERCEL,
  );
}

export const schemaFotoRefeicao = z.object({
  itens: z.array(
    z.object({
      nome: z.string(),
      gramas_estimadas: z.number(),
      confianca: z.enum(["baixa", "media", "alta"]),
    }),
  ),
  kcal_total: z.number(),
  proteina_g: z.number(),
  carboidrato_g: z.number(),
  gordura_g: z.number(),
  sodio_mg: z.number(),
});

export const schemaVeredito = z.object({
  status: z.enum(["no_caminho", "atencao", "fora_da_meta"]),
  resumo: z.string(),
  alertas: z.array(
    z.object({
      nutriente: z.string(),
      mensagem: z.string(),
      severidade: z.enum(["baixa", "media", "alta"]),
    }),
  ),
});
