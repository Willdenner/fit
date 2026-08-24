import { HojeNutricaoCard } from "@/components/hoje-nutricao-card";
import { HojeTreinoCard } from "@/components/hoje-treino-card";
import { IaStatusLink } from "@/components/ia-status-link";
import { diasPosProva } from "@/data/plano-treino";

export default function HojePage() {
  const dPlus = diasPosProva();
  const hoje = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <main className="space-y-4 px-4 pt-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-treino">
            Hoje
          </p>
          <h1 className="mt-1 capitalize text-3xl font-semibold tracking-tight">{hoje}</h1>
          <p className="mt-1 text-sm text-muted">
            D+{dPlus} da meia-maratona · recuperação em curso
          </p>
        </div>
        <IaStatusLink />
      </header>
      <HojeTreinoCard />
      <HojeNutricaoCard />
    </main>
  );
}
