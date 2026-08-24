import { NextResponse } from "next/server";
import { tiposTreino } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const data = String(body.data ?? "");
  const tipo = String(body.tipo ?? "");

  if (!data || !tiposTreino.includes(tipo as (typeof tiposTreino)[number])) {
    return NextResponse.json({ error: "Data e tipo de treino são obrigatórios." }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
