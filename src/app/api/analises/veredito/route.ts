import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { GEMINI_MODEL, isAiGatewayReady, schemaVeredito } from "@/lib/gemini";

export const runtime = "nodejs";

export async function GET() {
  if (!isAiGatewayReady()) {
    return NextResponse.json(
      {
        error:
          "O veredito sobe pelo AI Gateway do Vercel. No deploy isso é automático; localmente rode vercel env pull.",
      },
      { status: 503 },
    );
  }

  const hoje = new Date().toISOString().slice(0, 10);

  try {
    const { output } = await generateText({
      model: GEMINI_MODEL,
      output: Output.object({ schema: schemaVeredito }),
      prompt: `Analise o dia ${hoje}. Ainda não há histórico persistido. Devolva um veredito conservador pedindo mais dados de treino e nutrição, com atenção especial a sódio em dias de rodagem.`,
    });

    return NextResponse.json({
      data: hoje,
      tipo: "diaria",
      modeloUsado: GEMINI_MODEL,
      ...output,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao gerar o veredito.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
