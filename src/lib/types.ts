export const tiposTreino = ["facil", "qualidade", "rodagem", "forca"] as const;
export type TipoTreino = (typeof tiposTreino)[number];

export const fontesRefeicao = ["manual", "foto_ia"] as const;
export type FonteRefeicao = (typeof fontesRefeicao)[number];

export const tiposAnalise = ["diaria", "semanal"] as const;
export type TipoAnalise = (typeof tiposAnalise)[number];

export const statusAnalise = ["no_caminho", "atencao", "fora_da_meta"] as const;
export type StatusAnalise = (typeof statusAnalise)[number];

export type ItemRefeicao = {
  nome: string;
  gramas_estimadas: number;
  confianca: "baixa" | "media" | "alta";
};

export type AlertaAnalise = {
  nutriente: string;
  mensagem: string;
  severidade: "baixa" | "media" | "alta";
};
