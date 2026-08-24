import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  time,
  uuid,
} from "drizzle-orm/pg-core";

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

export const treinos = pgTable("treinos", {
  id: uuid("id").defaultRandom().primaryKey(),
  data: date("data").notNull(),
  tipo: text("tipo").$type<TipoTreino>().notNull(),
  planejado: boolean("planejado").notNull().default(false),
  distanciaKm: numeric("distancia_km", { precision: 6, scale: 2 }),
  tempoMin: numeric("tempo_min", { precision: 6, scale: 1 }),
  ritmoMedio: text("ritmo_medio"),
  fcMedia: integer("fc_media"),
  fcMaxima: integer("fc_maxima"),
  cadenciaMedia: integer("cadencia_media"),
  rpe: integer("rpe"),
  observacoes: text("observacoes"),
});

export const nutricaoRefeicoes = pgTable("nutricao_refeicoes", {
  id: uuid("id").defaultRandom().primaryKey(),
  data: date("data").notNull(),
  horario: time("horario").notNull(),
  descricao: text("descricao").notNull(),
  fonte: text("fonte").$type<FonteRefeicao>().notNull().default("manual"),
  itens: jsonb("itens").$type<ItemRefeicao[]>().notNull().default([]),
  kcal: numeric("kcal", { precision: 8, scale: 1 }),
  proteinaG: numeric("proteina_g", { precision: 8, scale: 1 }),
  carboidratoG: numeric("carboidrato_g", { precision: 8, scale: 1 }),
  gorduraG: numeric("gordura_g", { precision: 8, scale: 1 }),
  sodioMg: numeric("sodio_mg", { precision: 8, scale: 1 }),
  aguaMl: integer("agua_ml"),
});

export const metasDiarias = pgTable("metas_diarias", {
  id: uuid("id").defaultRandom().primaryKey(),
  data: date("data").notNull().unique(),
  tipoTreinoDia: text("tipo_treino_dia").$type<TipoTreino | "descanso">().notNull(),
  kcalMeta: integer("kcal_meta").notNull(),
  proteinaMetaG: integer("proteina_meta_g").notNull(),
  carboidratoMetaG: integer("carboidrato_meta_g").notNull(),
  gorduraMetaG: integer("gordura_meta_g").notNull(),
  sodioMetaMg: integer("sodio_meta_mg").notNull(),
});

export const analisesIa = pgTable("analises_ia", {
  id: uuid("id").defaultRandom().primaryKey(),
  data: date("data").notNull(),
  tipo: text("tipo").$type<TipoAnalise>().notNull(),
  status: text("status").$type<StatusAnalise>().notNull(),
  resumo: text("resumo").notNull(),
  alertas: jsonb("alertas").$type<AlertaAnalise[]>().notNull().default([]),
  modeloUsado: text("modelo_usado").notNull(),
});
