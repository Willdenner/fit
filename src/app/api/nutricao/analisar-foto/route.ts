import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { GEMINI_MODEL, isAiGatewayReady, schemaFotoRefeicao } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAiGatewayReady()) {
    return NextResponse.json(
      {
        error:
          "A análise de IA sobe pelo AI Gateway do Vercel. No deploy isso é automático; localmente rode vercel env pull.",
      },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const foto = form.get("foto");

  if (!(foto instanceof File)) {
    return NextResponse.json({ error: "Envie uma foto da refeição." }, { status: 400 });
  }

  const bytes = new Uint8Array(await foto.arrayBuffer());

  try {
    const { output } = await generateText({
      model: GEMINI_MODEL,
      output: Output.object({ schema: schemaFotoRefeicao }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: bytes,
              mediaType: foto.type || "image/jpeg",
            },
            {
              type: "text",
              text: "Estime os itens, porções e valores nutricionais desta refeição. Destaque sódio quando visível.",
            },
          ],
        },
      ],
    });

    return NextResponse.json(output);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao analisar a foto.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
