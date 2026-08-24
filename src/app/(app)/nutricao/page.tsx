import Link from "next/link";
import { MacroBar } from "@/components/macro-bar";

export default function NutricaoPage() {
  return (
    <main className="space-y-4 px-4 pt-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-nutricao">
            Nutrição
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Hoje</h1>
        </div>
        <Link
          href="/nutricao/nova"
          className="rounded-full bg-nutricao px-4 py-2 text-sm font-semibold text-background"
        >
          Registrar
        </Link>
      </header>
      <section className="rounded-2xl border border-border bg-surface p-4">
        <p className="font-mono text-4xl font-semibold tabular-nums">
          0<span className="ml-1 text-lg font-medium text-muted">kcal</span>
        </p>
        <div className="mt-5 space-y-3">
          <MacroBar label="Proteína" atual={0} meta={140} unidade="g" tom="nutricao" />
          <MacroBar label="Carboidrato" atual={0} meta={280} unidade="g" tom="nutricao" />
          <MacroBar label="Gordura" atual={0} meta={70} unidade="g" tom="nutricao" />
          <MacroBar label="Sódio" atual={0} meta={2300} unidade="mg" tom="sodio" />
        </div>
      </section>
      <section className="rounded-2xl border border-dashed border-border bg-surface/60 p-6 text-center">
        <p className="text-sm text-muted">Nenhuma refeição registrada ainda.</p>
        <p className="mt-1 text-sm text-muted">
          Comece pelo registro manual; foto com Gemini entra na V2.
        </p>
      </section>
    </main>
  );
}
