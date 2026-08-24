import { isAiGatewayReady } from "@/lib/gemini";

export default function ConfiguracoesPage() {
  const ativa = isAiGatewayReady();

  return (
    <main className="space-y-4 px-4 pt-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-treino">
          Configurações
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">IA no Vercel</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Qualquer pessoa que abrir o app usa o mesmo Gemini, autenticado pelo AI Gateway do projeto — sem cadastrar chave no celular.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Status</p>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              ativa ? "bg-treino-dim text-treino" : "bg-surface-2 text-muted"
            }`}
          >
            {ativa ? "Ativa neste ambiente" : "Só no deploy Vercel"}
          </span>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted">
          Modelo `google/gemini-3.6-flash` via AI Gateway. Em produção o Vercel injeta OIDC sozinho.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 space-y-2">
        <p className="text-sm font-medium">No dashboard</p>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-muted">
          <li>Abra o projeto fitness no Vercel.</li>
          <li>Em AI Gateway, deixe o gateway ligado no time Pro.</li>
          <li>Faça um deploy. Foto da refeição e veredito passam a valer para todos.</li>
        </ol>
        <a
          href="https://vercel.com/willdenner1/fitness"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex h-11 items-center justify-center rounded-xl bg-treino px-4 text-sm font-semibold text-background"
        >
          Abrir projeto no Vercel
        </a>
      </section>
    </main>
  );
}
