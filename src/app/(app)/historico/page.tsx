export default function HistoricoPage() {
  return (
    <main className="space-y-4 px-4 pt-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-treino">
          Histórico
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Ainda vazio</h1>
      </header>
      <section className="rounded-2xl border border-border bg-surface p-4">
        <h2 className="text-lg font-semibold">Meia-maratona 23/08/2026</h2>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Stat label="Resultado" value="3:26:37" />
          <Stat label="Meta" value="2:40:00" />
          <Stat label="Ritmo" value="9'41&quot;/km" />
          <Stat label="Cadência" value="119 spm" />
        </dl>
        <p className="mt-4 text-sm leading-6 text-muted">
          Câimbras a partir do km14. O sódio fica em âmbar neste app exatamente por isso.
        </p>
      </section>
      <section className="rounded-2xl border border-dashed border-border bg-surface/60 p-6 text-center">
        <p className="text-sm text-muted">
          Veredito diário/semanal da IA entra na V3, depois que o banco novo estiver no Vercel.
        </p>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 font-mono text-lg">{value}</dd>
    </div>
  );
}
