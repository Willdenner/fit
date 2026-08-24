import { NextResponse } from "next/server";
import { GEMINI_MODEL, getGeminiClient, isGeminiReady, schemaVeredito } from "@/lib/gemini";

export const runtime = "nodejs";

export async function GET() {
  if (!isGeminiReady()) {
    return NextResponse.json(
      {
        error:
          "Defina GEMINI_API_KEY nas variáveis de ambiente do Vercel (Production, Preview e Development).",
      },
      { status: 503 },
    );
  }

  const hoje = new Date().toISOString().slice(0, 10);

  try {
    const result = await getGeminiClient().models.generateContent({
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

    return NextResponse.json({
      data: hoje,
      tipo: "diaria",
      modeloUsado: GEMINI_MODEL,
      ...veredito,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao gerar o veredito.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
