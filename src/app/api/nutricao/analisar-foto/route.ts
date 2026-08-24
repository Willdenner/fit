import { NextResponse } from "next/server";
import { GEMINI_MODEL, getGeminiClient, isGeminiReady, schemaFotoRefeicao } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isGeminiReady()) {
    return NextResponse.json(
      {
        error:
          "Defina GEMINI_API_KEY nas variáveis de ambiente do Vercel (Production, Preview e Development).",
      },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const foto = form.get("foto");

  if (!(foto instanceof File)) {
    return NextResponse.json({ error: "Envie uma foto da refeição." }, { status: 400 });
  }

  const bytes = Buffer.from(await foto.arrayBuffer());

  try {
    const result = await getGeminiClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: foto.type || "image/jpeg",
                data: bytes.toString("base64"),
              },
            },
            {
              text: "Estime os itens, porções e valores nutricionais desta refeição. Destaque sódio quando visível.",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: schemaFotoRefeicao,
      },
    });

    return NextResponse.json(JSON.parse(result.text ?? "{}"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao analisar a foto.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
