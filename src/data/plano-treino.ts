export type FasePlano = {
  id: string;
  nome: string;
  periodo: string;
  treinos: { titulo: string; conteudo: string }[];
};

export const planoAtual = {
  foco: "provas de 5-10km, sem data definida, 3 dias de corrida por semana + 2x força",
  forca:
    "2x/semana, 20-25min: panturrilha (incluindo excêntrica), quadríceps, posterior de coxa, glúteo, core",
  fases: [
    {
      id: "fase-0",
      nome: "Fase 0 — Recuperação",
      periodo: "pós meia-maratona 23/08/2026",
      treinos: [
        {
          titulo: "D+0 a D+3",
          conteudo: "Sem corrida. Caminhada leve, alongamento, hidratação, sono em dia",
        },
        {
          titulo: "D+4 a D+6",
          conteudo: "Se sem dor: 1-2 trotes leves de 15-20min",
        },
        {
          titulo: "D+7 a D+10",
          conteudo:
            "Reavaliar; retomar treino normal ou estender recuperação se ainda houver desconforto",
        },
      ],
    },
    {
      id: "bloco-1",
      nome: "Bloco 1 — Base e técnica",
      periodo: "semanas 1-4",
      treinos: [
        {
          titulo: "1 — Fácil",
          conteudo:
            "30-40min ritmo conversável + educativos de cadência (4-6x20s passada curta/rápida)",
        },
        {
          titulo: "2 — Fartlek leve",
          conteudo: "30min: 20min fácil + 10min alternando 2min moderado / 1min fácil",
        },
        {
          titulo: "3 — Rodagem",
          conteudo: "40-60min fácil, mantendo cadência alta",
        },
      ],
    },
    {
      id: "bloco-2",
      nome: "Bloco 2 — Introdução de velocidade",
      periodo: "semanas 5-8",
      treinos: [
        {
          titulo: "1 — Fácil",
          conteudo: "30-40min fácil + educativos",
        },
        {
          titulo: "2 — Intervalado",
          conteudo: "6-8x400m forte (não máximo) com 90s trote entre",
        },
        {
          titulo: "3 — Rodagem progressiva",
          conteudo: "45-60min, últimos 10min em ritmo moderado",
        },
      ],
    },
    {
      id: "bloco-3",
      nome: "Bloco 3 — Específico 5-10km",
      periodo: "semanas 9-12",
      treinos: [
        {
          titulo: "1 — Fácil",
          conteudo: "30-40min fácil + educativos",
        },
        {
          titulo: "2 — Tempo run",
          conteudo: "15-20min contínuo em ritmo de limiar, dentro de treino de 35-40min",
        },
        {
          titulo: "3 — Simulação",
          conteudo: "Rodagem com trecho de 5km em ritmo alvo de prova",
        },
      ],
    },
  ] satisfies FasePlano[],
};

const RACE_DATE = new Date("2026-08-23T00:00:00");

export function diasPosProva(hoje = new Date()) {
  const start = Date.UTC(
    RACE_DATE.getFullYear(),
    RACE_DATE.getMonth(),
    RACE_DATE.getDate(),
  );
  const current = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return Math.floor((current - start) / 86_400_000);
}

export function treinoDoDia(hoje = new Date()) {
  const d = diasPosProva(hoje);

  if (d <= 3) {
    return {
      fase: "Fase 0 — Recuperação",
      tipo: "descanso" as const,
      titulo: "Sem corrida",
      detalhe: "Caminhada leve, alongamento, hidratação, sono em dia",
    };
  }

  if (d <= 6) {
    return {
      fase: "Fase 0 — Recuperação",
      tipo: "facil" as const,
      titulo: "Trote leve opcional",
      detalhe: "Se sem dor: 15-20min fácil",
    };
  }

  if (d <= 10) {
    return {
      fase: "Fase 0 — Recuperação",
      tipo: "facil" as const,
      titulo: "Reavaliar",
      detalhe: "Retomar treino normal ou estender recuperação se ainda houver desconforto",
    };
  }

  return {
    fase: "Bloco 1 — Base e técnica",
    tipo: "facil" as const,
    titulo: "Base aeróbica",
    detalhe: "30-40min ritmo conversável + educativos de cadência",
  };
}
