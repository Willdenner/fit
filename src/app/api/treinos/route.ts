import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { treinos, tiposTreino } from "@/db/schema";

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Configure DATABASE_URL no Neon para salvar treinos." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as Record<string, unknown>;
  const data = String(body.data ?? "");
  const tipo = String(body.tipo ?? "");

  if (!data || !tiposTreino.includes(tipo as (typeof tiposTreino)[number])) {
    return NextResponse.json({ error: "Data e tipo de treino são obrigatórios." }, { status: 400 });
  }

  const db = getDb();
  const [treino] = await db
    .insert(treinos)
    .values({
      data,
      tipo: tipo as (typeof tiposTreino)[number],
      planejado: Boolean(body.planejado),
      distanciaKm: optionalNumber(body.distanciaKm),
      tempoMin: optionalNumber(body.tempoMin),
      ritmoMedio: optionalText(body.ritmoMedio),
      fcMedia: optionalInt(body.fcMedia),
      fcMaxima: optionalInt(body.fcMaxima),
      cadenciaMedia: optionalInt(body.cadenciaMedia),
      rpe: optionalInt(body.rpe),
      observacoes: optionalText(body.observacoes),
    })
    .returning();

  return NextResponse.json(treino, { status: 201 });
}

function optionalText(value: unknown) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function optionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

function optionalInt(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
