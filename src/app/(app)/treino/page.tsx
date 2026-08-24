import Link from "next/link";
import { planoAtual } from "@/data/plano-treino";

export default function TreinoPage() {
  return (
    <main className="space-y-4 px-4 pt-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-treino">
            Treino
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Plano atual</h1>
        </div>
        <Link
          href="/treino/novo"
          className="rounded-full bg-treino px-4 py-2 text-sm font-semibold text-background"
        >
          Registrar
        </Link>
      </header>
      <p className="text-sm leading-6 text-muted">{planoAtual.foco}</p>
      {planoAtual.fases.map((fase) => (
        <section key={fase.id} className="rounded-2xl border border-border bg-surface p-4">
          <h2 className="text-lg font-semibold">{fase.nome}</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-muted">{fase.periodo}</p>
          <ul className="mt-4 space-y-3">
            {fase.treinos.map((treino) => (
              <li key={treino.titulo} className="rounded-xl bg-surface-2 p-3">
                <p className="text-sm font-medium text-treino">{treino.titulo}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{treino.conteudo}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section className="rounded-2xl border border-border bg-surface p-4">
        <h2 className="text-lg font-semibold">Força</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{planoAtual.forca}</p>
      </section>
    </main>
  );
}
