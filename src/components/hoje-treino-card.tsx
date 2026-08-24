import Link from "next/link";
import { treinoDoDia } from "@/data/plano-treino";

export function HojeTreinoCard() {
  const treino = treinoDoDia();

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-treino">
          Treino
        </p>
        <span className="rounded-full bg-treino-dim px-2 py-0.5 text-[11px] text-treino">
          planejado
        </span>
      </div>
      <p className="text-xs text-muted">{treino.fase}</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight">{treino.titulo}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{treino.detalhe}</p>
      <Link
        href="/treino/novo"
        className="mt-4 flex h-12 items-center justify-center rounded-xl bg-treino text-sm font-semibold text-background"
      >
        Registrar treino
      </Link>
    </section>
  );
}
