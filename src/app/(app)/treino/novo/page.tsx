"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { tiposTreino, type TipoTreino } from "@/lib/types";

const labels: Record<TipoTreino, string> = {
  facil: "Fácil",
  qualidade: "Qualidade",
  rodagem: "Rodagem",
  forca: "Força",
};

export default function NovoTreinoPage() {
  const router = useRouter();
  const [tipo, setTipo] = useState<TipoTreino>("facil");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSalvando(true);
    setErro(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      data: form.get("data"),
      tipo,
      planejado: form.get("planejado") === "on",
      distanciaKm: form.get("distanciaKm") || null,
      tempoMin: form.get("tempoMin") || null,
      ritmoMedio: form.get("ritmoMedio") || null,
      fcMedia: form.get("fcMedia") || null,
      fcMaxima: form.get("fcMaxima") || null,
      cadenciaMedia: form.get("cadenciaMedia") || null,
      rpe: form.get("rpe") || null,
      observacoes: form.get("observacoes") || null,
    };

    const res = await fetch("/api/treinos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setErro(body?.error ?? "Não foi possível salvar o treino.");
      setSalvando(false);
      return;
    }

    router.push("/hoje");
    router.refresh();
  }

  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <main className="space-y-4 px-4 pt-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-treino">
          Treino
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Registrar</h1>
      </header>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Data">
          <input
            required
            name="data"
            type="date"
            defaultValue={hoje}
            className="input"
          />
        </Field>
        <fieldset>
          <legend className="mb-2 text-sm text-muted">Tipo</legend>
          <div className="grid grid-cols-2 gap-2">
            {tiposTreino.map((opcao) => (
              <button
                key={opcao}
                type="button"
                onClick={() => setTipo(opcao)}
                className={`rounded-xl px-3 py-3 text-sm font-medium ${
                  tipo === opcao
                    ? "bg-treino text-background"
                    : "bg-surface text-foreground"
                }`}
              >
                {labels[opcao]}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="flex items-center gap-2 text-sm">
          <input name="planejado" type="checkbox" className="size-4 accent-treino" />
          Treino planejado
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Distância (km)">
            <input name="distanciaKm" type="number" step="0.01" min="0" className="input" />
          </Field>
          <Field label="Tempo (min)">
            <input name="tempoMin" type="number" step="0.1" min="0" className="input" />
          </Field>
          <Field label="Ritmo médio">
            <input name="ritmoMedio" placeholder="5'30&quot;/km" className="input" />
          </Field>
          <Field label="RPE (1-10)">
            <input name="rpe" type="number" min="1" max="10" className="input" />
          </Field>
          <Field label="FC média">
            <input name="fcMedia" type="number" min="0" className="input" />
          </Field>
          <Field label="FC máxima">
            <input name="fcMaxima" type="number" min="0" className="input" />
          </Field>
          <Field label="Cadência">
            <input name="cadenciaMedia" type="number" min="0" className="input" />
          </Field>
        </div>
        <Field label="Observações">
          <textarea
            name="observacoes"
            rows={3}
            placeholder="Dor, câimbra, clima..."
            className="input resize-none"
          />
        </Field>
        {erro ? <p className="text-sm text-nutricao">{erro}</p> : null}
        <button
          type="submit"
          disabled={salvando}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-treino text-sm font-semibold text-background disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar treino"}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm text-muted">{label}</span>
      {children}
    </label>
  );
}
