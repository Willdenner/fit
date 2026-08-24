"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type EstimativaFoto = {
  itens?: { nome: string; gramas_estimadas: number; confianca: string }[];
  kcal_total?: number;
  proteina_g?: number;
  carboidrato_g?: number;
  gordura_g?: number;
  sodio_mg?: number;
  error?: string;
};

export default function NovaRefeicaoPage() {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [analisando, setAnalisando] = useState(false);
  const [itens, setItens] = useState<EstimativaFoto["itens"]>([]);
  const [descricao, setDescricao] = useState("");
  const [kcal, setKcal] = useState("");
  const [proteinaG, setProteinaG] = useState("");
  const [carboidratoG, setCarboidratoG] = useState("");
  const [gorduraG, setGorduraG] = useState("");
  const [sodioMg, setSodioMg] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSalvando(true);
    setErro(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      data: form.get("data"),
      horario: form.get("horario"),
      descricao,
      fonte: itens?.length ? "foto_ia" : "manual",
      itens: itens ?? [],
      kcal: kcal || null,
      proteinaG: proteinaG || null,
      carboidratoG: carboidratoG || null,
      gorduraG: gorduraG || null,
      sodioMg: sodioMg || null,
      aguaMl: form.get("aguaMl") || null,
    };

    const res = await fetch("/api/nutricao/refeicoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setErro(body?.error ?? "Não foi possível salvar a refeição.");
      setSalvando(false);
      return;
    }

    router.push("/hoje");
    router.refresh();
  }

  async function onFoto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("foto") as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    setAnalisando(true);
    setErro(null);

    const data = new FormData();
    data.append("foto", file);

    const res = await fetch("/api/nutricao/analisar-foto", {
      method: "POST",
      body: data,
    });

    const body = (await res.json().catch(() => null)) as EstimativaFoto | null;
    if (!res.ok || !body) {
      setErro(body?.error ?? "A análise da foto ainda não está disponível.");
      setAnalisando(false);
      return;
    }

    setItens(body.itens ?? []);
    if (body.itens?.length) {
      setDescricao(body.itens.map((item) => item.nome).join(", "));
    }
    if (body.kcal_total !== undefined) setKcal(String(body.kcal_total));
    if (body.proteina_g !== undefined) setProteinaG(String(body.proteina_g));
    if (body.carboidrato_g !== undefined) setCarboidratoG(String(body.carboidrato_g));
    if (body.gordura_g !== undefined) setGorduraG(String(body.gordura_g));
    if (body.sodio_mg !== undefined) setSodioMg(String(body.sodio_mg));
    setAnalisando(false);
  }

  const hoje = new Date().toISOString().slice(0, 10);
  const agora = new Date().toTimeString().slice(0, 5);

  return (
    <main className="space-y-4 px-4 pt-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-nutricao">
          Nutrição
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Registrar</h1>
      </header>
      <form onSubmit={onFoto} className="rounded-2xl border border-border bg-surface p-4">
        <p className="text-sm font-medium">Foto da refeição</p>
        <p className="mt-1 text-sm text-muted">
          A IA pré-preenche; você sempre edita antes de salvar.
        </p>
        <input name="foto" type="file" accept="image/*" capture="environment" className="mt-3 text-sm" />
        <button
          type="submit"
          disabled={analisando}
          className="mt-3 flex h-11 w-full items-center justify-center rounded-xl bg-surface-2 text-sm font-semibold disabled:opacity-60"
        >
          {analisando ? "Analisando..." : "Estimar com Gemini"}
        </button>
      </form>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Data">
          <input required name="data" type="date" defaultValue={hoje} className="input" />
        </Field>
        <Field label="Horário">
          <input required name="horario" type="time" defaultValue={agora} className="input" />
        </Field>
        <Field label="Descrição">
          <input
            required
            name="descricao"
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            placeholder="Arroz, feijão, frango..."
            className="input"
          />
        </Field>
        {itens?.length ? (
          <p className="text-sm text-muted">
            Estimativa editável: {itens.map((item) => item.nome).join(", ")}.
          </p>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          <Field label="kcal">
            <input
              name="kcal"
              type="number"
              min="0"
              value={kcal}
              onChange={(event) => setKcal(event.target.value)}
              className="input"
            />
          </Field>
          <Field label="Proteína (g)">
            <input
              name="proteinaG"
              type="number"
              min="0"
              step="0.1"
              value={proteinaG}
              onChange={(event) => setProteinaG(event.target.value)}
              className="input"
            />
          </Field>
          <Field label="Carboidrato (g)">
            <input
              name="carboidratoG"
              type="number"
              min="0"
              step="0.1"
              value={carboidratoG}
              onChange={(event) => setCarboidratoG(event.target.value)}
              className="input"
            />
          </Field>
          <Field label="Gordura (g)">
            <input
              name="gorduraG"
              type="number"
              min="0"
              step="0.1"
              value={gorduraG}
              onChange={(event) => setGorduraG(event.target.value)}
              className="input"
            />
          </Field>
          <Field label="Sódio (mg)">
            <input
              name="sodioMg"
              type="number"
              min="0"
              step="0.1"
              value={sodioMg}
              onChange={(event) => setSodioMg(event.target.value)}
              className="input"
            />
          </Field>
          <Field label="Água (ml)">
            <input name="aguaMl" type="number" min="0" className="input" />
          </Field>
        </div>
        {erro ? <p className="text-sm text-nutricao">{erro}</p> : null}
        <button
          type="submit"
          disabled={salvando}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-nutricao text-sm font-semibold text-background disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar refeição"}
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
