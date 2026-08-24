import { NextResponse } from "next/server";
import { GEMINI_MODEL, getGeminiClient, schemaFotoRefeicao } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Configure GEMINI_API_KEY para analisar fotos no servidor." },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const foto = form.get("foto");

  if (!(foto instanceof File)) {
    return NextResponse.json({ error: "Envie uma foto da refeição." }, { status: 400 });
  }

  const bytes = Buffer.from(await foto.arrayBuffer());
  const ai = getGeminiClient();

  const result = await ai.models.generateContent({
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

  const estimativa = JSON.parse(result.text ?? "{}");
  return NextResponse.json(estimativa);
}
