import { isGeminiReady } from "@/lib/gemini";

export default function ConfiguracoesPage() {
  const ativa = isGeminiReady();

  return (
    <main className="space-y-4 px-4 pt-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-treino">
          Configurações
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">API Gemini</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          A chave fica só no Vercel, no servidor. Quem usa o app não cadastra nada — a análise de foto e o veredito já saem com a sua API.
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
            {ativa ? "GEMINI_API_KEY ok" : "Chave ainda não está neste ambiente"}
          </span>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted">
          Modelo gemini-3.6-flash. Variável: GEMINI_API_KEY.
        </p>
      </section>

      <section className="space-y-2 rounded-2xl border border-border bg-surface p-4">
        <p className="text-sm font-medium">Onde colar a chave</p>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-muted">
          <li>Abra Environment Variables do projeto fitness.</li>
          <li>Nome: GEMINI_API_KEY. Valor: a chave do Google AI Studio.</li>
          <li>Marque Production, Preview e Development.</li>
          <li>Salve e faça Redeploy — senão o deploy antigo continua sem a variável.</li>
        </ol>
        <a
          href="https://vercel.com/willdenner1/fitness/settings/environment-variables"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex h-11 items-center justify-center rounded-xl bg-treino px-4 text-sm font-semibold text-background"
        >
          Colar chave no Vercel
        </a>
      </section>
    </main>
  );
}
