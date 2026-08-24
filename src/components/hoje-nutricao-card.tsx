import Link from "next/link";
import { MacroBar } from "@/components/macro-bar";

const metasPadrao = {
  kcal: 2400,
  proteina: 140,
  carboidrato: 280,
  gordura: 70,
  sodio: 2300,
};

export function HojeNutricaoCard() {
  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-nutricao">
          Nutrição
        </p>
        <span className="text-xs text-muted">0 refeições</span>
      </div>
      <p className="font-mono text-4xl font-semibold tabular-nums tracking-tight">
        0
        <span className="ml-1 text-lg font-medium text-muted">/{metasPadrao.kcal} kcal</span>
      </p>
      <div className="mt-5 space-y-3">
        <MacroBar
          label="Proteína"
          atual={0}
          meta={metasPadrao.proteina}
          unidade="g"
          tom="nutricao"
        />
        <MacroBar
          label="Carboidrato"
          atual={0}
          meta={metasPadrao.carboidrato}
          unidade="g"
          tom="nutricao"
        />
        <MacroBar
          label="Gordura"
          atual={0}
          meta={metasPadrao.gordura}
          unidade="g"
          tom="nutricao"
        />
        <MacroBar
          label="Sódio"
          atual={0}
          meta={metasPadrao.sodio}
          unidade="mg"
          tom="sodio"
        />
      </div>
      <Link
        href="/nutricao/nova"
        className="mt-4 flex h-12 items-center justify-center rounded-xl bg-nutricao text-sm font-semibold text-background"
      >
        Registrar refeição
      </Link>
    </section>
  );
}
