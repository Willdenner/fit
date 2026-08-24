import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { analisesIa } from "@/db/schema";
import { GEMINI_MODEL, getGeminiClient, schemaVeredito } from "@/lib/gemini";

export const runtime = "nodejs";

export async function GET() {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Configure GEMINI_API_KEY para gerar o veredito periódico." },
      { status: 503 },
    );
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Configure DATABASE_URL para persistir analises_ia." },
      { status: 503 },
    );
  }

  const ai = getGeminiClient();
  const hoje = new Date().toISOString().slice(0, 10);

  const result = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Analise o dia ${hoje}. Ainda não há histórico persistido. Devolva um veredito conservador pedindo mais dados de treino e nutrição, com atenção especial a sódio em dias de rodagem.`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: schemaVeredito,
    },
  });

  const veredito = JSON.parse(result.text ?? "{}") as {
    status: "no_caminho" | "atencao" | "fora_da_meta";
    resumo: string;
    alertas: { nutriente: string; mensagem: string; severidade: "baixa" | "media" | "alta" }[];
  };

  const db = getDb();
  const [analise] = await db
    .insert(analisesIa)
    .values({
      data: hoje,
      tipo: "diaria",
      status: veredito.status,
      resumo: veredito.resumo,
      alertas: veredito.alertas ?? [],
      modeloUsado: GEMINI_MODEL,
    })
    .returning();

  return NextResponse.json(analise);
}
