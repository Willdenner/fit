import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const data = String(body.data ?? "");
  const horario = String(body.horario ?? "");
  const descricao = String(body.descricao ?? "").trim();

  if (!data || !horario || !descricao) {
    return NextResponse.json(
      { error: "Data, horário e descrição são obrigatórios." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
