import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { nutricaoRefeicoes, type FonteRefeicao, type ItemRefeicao } from "@/db/schema";

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Configure DATABASE_URL no Neon para salvar refeições." },
      { status: 503 },
    );
  }

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

  const db = getDb();
  const [refeicao] = await db
    .insert(nutricaoRefeicoes)
    .values({
      data,
      horario,
      descricao,
      fonte: (body.fonte === "foto_ia" ? "foto_ia" : "manual") as FonteRefeicao,
      itens: Array.isArray(body.itens) ? (body.itens as ItemRefeicao[]) : [],
      kcal: optionalNumber(body.kcal),
      proteinaG: optionalNumber(body.proteinaG),
      carboidratoG: optionalNumber(body.carboidratoG),
      gorduraG: optionalNumber(body.gorduraG),
      sodioMg: optionalNumber(body.sodioMg),
      aguaMl: optionalInt(body.aguaMl),
    })
    .returning();

  return NextResponse.json(refeicao, { status: 201 });
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
