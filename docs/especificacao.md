# App de treino e nutrição — Especificação do projeto

## Visão geral

App web pessoal para controle diário de treinos de corrida e alimentação/nutrição completa, com um agente de IA (Gemini) monitorando se os dados estão dentro da meta — com foco especial em nutrição, dado o histórico recente de câimbra em prova longa por questão de eletrólitos/preparo.

**Contexto que originou o projeto:** meia-maratona de 23/08/2026, primeira vez na distância (21,30km), concluída em 3:26:37 (ritmo médio 9'41"/km) contra uma meta de 2h40 (7'35"/km). Câimbras a partir do km14. Objetivo atual: provas de 5-10km, treinando 3 dias por semana, sem data de próxima prova definida.

**Uso:** pessoal, mas construído numa base sólida o suficiente para eventualmente virar produto — no mesmo espírito de outros projetos já tocados (sistema de estoque, PIFE Arena, Colli Finance OS).

---

## Stack técnico recomendado

| Camada | Escolha | Motivo |
|---|---|---|
| Frontend | Next.js (App Router), PWA | Reaproveita o padrão já usado no Colli Finance OS |
| Backend | API Routes do próprio Next.js | Sem servidor separado, deploy único |
| Banco de dados | Postgres (Neon) | Mesmo provedor já usado no Colli Finance OS |
| Deploy | Vercel | Mesmo provedor já usado no Colli Finance OS |
| IA | Gemini API — `gemini-3.6-flash` | Multimodal (texto+imagem), structured output nativo, custo baixo, GA/estável |
| Base de alimentos | API externa (Open Food Facts ou USDA FoodData Central) | Evita construir e manter um banco nutricional do zero |

**Alternativa rápida (não recomendada como primeira escolha, mas válida para validar o uso em poucos dias):** Lovable + Supabase, no mesmo padrão já usado no PIFE Arena.

---

## Modelo de dados

```sql
treinos
- id
- data
- tipo            -- facil | qualidade | rodagem | forca
- planejado        -- bool
- distancia_km
- tempo_min
- ritmo_medio
- fc_media
- fc_maxima
- cadencia_media
- rpe             -- percepção de esforço, 1-10
- observacoes     -- dor, câimbra, condição climática etc.

nutricao_refeicoes
- id
- data
- horario
- descricao
- fonte           -- manual | foto_ia
- itens           -- jsonb: [{ nome, gramas_estimadas, confianca }]
- kcal
- proteina_g
- carboidrato_g
- gordura_g
- sodio_mg
- agua_ml

metas_diarias
- id
- data
- tipo_treino_dia
- kcal_meta
- proteina_meta_g
- carboidrato_meta_g
- gordura_meta_g
- sodio_meta_mg   -- ajustada para cima em dias de rodagem longa

analises_ia
- id
- data
- tipo            -- diaria | semanal
- status           -- no_caminho | atencao | fora_da_meta
- resumo
- alertas         -- jsonb: [{ nutriente, mensagem, severidade }]
- modelo_usado
```

A tabela `metas_diarias` é o que conecta os dois módulos de verdade: a meta de sódio e carboidrato de um dia de rodagem longa deve ser maior que a de um dia de descanso — é essa lógica que transforma dois trackers separados em um sistema único.

---

## Arquitetura

```
Amazfit/Strava (dados de treino)  ─┐
                                     ├──►  App web (PWA)  ◄──►  API + Postgres  ──►  Dashboard
Base de alimentos (busca)          ─┘
```

Fluxo de IA (foto de refeição ou veredito periódico):

```
Você registra (foto ou dados do dia)
        │
        ▼
App envia contexto (treino, refeições, metas)
        │
        ▼
Gemini analisa (visão + linguagem natural)
        │
        ▼
Dashboard mostra veredito (no caminho certo? alertas)
```

Regra fixa: toda chamada ao Gemini sai de uma API route do servidor — nunca do client. A chave (`GEMINI_API_KEY`) fica só em variável de ambiente no Vercel.

---

## Integração com IA — Gemini

Dois pontos de uso:

1. **Foto da refeição → estimativa nutricional.** O Gemini identifica itens, estima porções e calcula kcal/macros/sódio, pré-preenchendo o formulário de registro. Estimativa de porção por foto tem margem de erro real (20-40% em alimentos irregulares) — por isso o resultado é sempre editável antes de salvar, nunca gravado direto. Para itens críticos (relevantes para sódio, por exemplo), oferecer campo opcional de "peso conhecido".

2. **Veredito periódico (diário/semanal).** Um job agendado (Vercel Cron) manda um resumo estruturado dos últimos dias — treino, refeições, metas — para o Gemini, que devolve um status: `no_caminho`, `atencao` ou `fora_da_meta`, com alertas específicos. O resultado fica em cache na tabela `analises_ia`, e o dashboard só lê o último registro em vez de chamar a API a cada acesso.

**Modelo recomendado:** `gemini-3.6-flash` — versão GA (estável, não preview), aceita imagem/texto/PDF/áudio no mesmo request, suporta *structured output* nativo (schema JSON garantido na resposta). Custo é irrisório para uso pessoal (~US$1,50/milhão de tokens de entrada). Não vale usar o Gemini 3.1 Pro aqui: mais caro, sem tier gratuito desde abril/2026, e pensado para raciocínio mais pesado do que essa tarefa exige.

Exemplo de chamada (rota de API):

```javascript
// app/api/nutricao/analisar-foto/route.ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const schema = {
  type: "object",
  properties: {
    itens: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nome: { type: "string" },
          gramas_estimadas: { type: "number" },
          confianca: { type: "string", enum: ["baixa", "media", "alta"] }
        }
      }
    },
    kcal_total: { type: "number" },
    proteina_g: { type: "number" },
    carboidrato_g: { type: "number" },
    gordura_g: { type: "number" },
    sodio_mg: { type: "number" }
  }
};

const result = await ai.models.generateContent({
  model: "gemini-3.6-flash",
  contents: [{
    role: "user",
    parts: [
      { inlineData: { mimeType: "image/jpeg", data: base64Image } },
      { text: "Estime os itens, porções e valores nutricionais desta refeição." }
    ]
  }],
  config: { responseMimeType: "application/json", responseSchema: schema }
});

const estimativa = JSON.parse(result.text);
```

O veredito periódico usa a mesma lógica de `responseSchema`, mas com entrada em texto (JSON com o histórico) em vez de imagem, retornando algo como:

```json
{
  "status": "atencao",
  "resumo": "Sódio abaixo da meta em 3 dos últimos 4 dias de treino.",
  "alertas": [
    { "nutriente": "sodio", "mensagem": "Consistentemente abaixo da meta em dias de rodagem", "severidade": "media" }
  ]
}
```

*Nota: a mesma arquitetura funciona de forma equivalente com a API da Claude, caso em algum momento faça sentido comparar ou trocar de provedor — só a chamada muda, o resto do fluxo se mantém.*

---

## Identidade visual

- **Filosofia:** mobile-first, uso rápido (muitas vezes suado, com pressa) — tudo cabe num scroll único, números grandes e legíveis (estilo Garmin/Strava), botão de ação principal sempre visível.
- **Cores por módulo:** verde-azulado (teal) para treino, terroso/coral para nutrição — a mesma cor de treino se repete em qualquer tela do app para criar associação visual consistente.
- **Sódio em destaque:** cor própria (âmbar), separado dos outros macros — consequência direta do aprendizado da câimbra do km14.
- **Navegação:** barra inferior fixa com 4 seções — Hoje / Treino / Nutrição / Histórico.
- **Tela "Hoje":** card de treino do dia (planejado vs. registrado) + card de nutrição (calorias, barras de progresso de proteína/carboidrato/gordura/sódio) + acesso rápido para registrar.

---

## Plano de treino atual (referência para popular o app)

**Foco:** provas de 5-10km, sem data definida, 3 dias de corrida por semana + 2x força.

### Fase 0 — Recuperação (pós meia-maratona)

| Período | Ação |
|---|---|
| D+0 a D+3 | Sem corrida. Caminhada leve, alongamento, hidratação, sono em dia |
| D+4 a D+6 | Se sem dor: 1-2 trotes leves de 15-20min |
| D+7 a D+10 | Reavaliar; retomar treino normal ou estender recuperação se ainda houver desconforto |

### Bloco 1 — Base e técnica (semanas 1-4)

| Treino | Conteúdo |
|---|---|
| 1 — Fácil | 30-40min ritmo conversável + educativos de cadência (4-6x20s passada curta/rápida) |
| 2 — Fartlek leve | 30min: 20min fácil + 10min alternando 2min moderado / 1min fácil |
| 3 — Rodagem | 40-60min fácil, mantendo cadência alta |

### Bloco 2 — Introdução de velocidade (semanas 5-8)

| Treino | Conteúdo |
|---|---|
| 1 — Fácil | 30-40min fácil + educativos |
| 2 — Intervalado | 6-8x400m forte (não máximo) com 90s trote entre |
| 3 — Rodagem progressiva | 45-60min, últimos 10min em ritmo moderado |

### Bloco 3 — Específico 5-10km (semanas 9-12)

| Treino | Conteúdo |
|---|---|
| 1 — Fácil | 30-40min fácil + educativos |
| 2 — Tempo run | 15-20min contínuo em ritmo de limiar, dentro de treino de 35-40min |
| 3 — Simulação | Rodagem com trecho de 5km em ritmo alvo de prova |

**Força (2x/semana, 20-25min):** panturrilha (incluindo excêntrica), quadríceps, posterior de coxa, glúteo, core — item não opcional dado o padrão de câimbra identificado.

---

## Aprendizados da meia-maratona de 23/08/2026 (o "porquê" do projeto)

- Meta era 2h40 (7'35"/km); resultado foi 3:26:37 (9'41"/km) — primeira vez na distância.
- Largada saiu a 6'49" no km1, mais rápida que a própria meta, com FC já em 169bpm.
- 72% do tempo total em zona anaeróbica (152-170bpm) — desproporcional para o ritmo médio, sinal de base aeróbica ainda insuficiente para a distância.
- Cadência média de 119spm (ideal: 165-175spm) — passada longa (86cm em média), overstriding, carga extra em quadríceps e panturrilha.
- Queda atípica de FC nos km12-13 (75 e 98bpm), provavelmente uma parada no percurso — a musculatura esfriou e a FC voltou a 167bpm exatamente no km14, quando as câimbras começaram.
- A partir do km14, ritmo degradou de forma quase linear (10'29" → 11'21") com FC ainda alta — fadiga muscular sobrepondo a capacidade cardiovascular, não um limite cardíaco.
- Terreno não foi fator: 89% do percurso foi plano.

---

## Roadmap por fases

**MVP (2-3 semanas):** registro manual de treino (usando o plano acima), registro de refeições com busca na API de alimentos, dashboard simples de calorias/macros do dia.

**V2:** importação automática de treinos (Strava/Amazfit), metas nutricionais ajustadas automaticamente pelo tipo de treino do dia, lembretes, foto de refeição com Gemini.

**V3:** veredito de IA periódico (diário/semanal), cruzamento de dados (FC/cadência/zona de esforço vs. sódio/carboidrato) para identificar padrões como o que causou a câimbra do km14, relatório semanal automático.

---

## Próximos passos sugeridos

1. Criar o projeto Next.js + repositório, configurar Neon Postgres e Vercel.
2. Criar as tabelas do modelo de dados acima.
3. Construir a tela "Hoje" e o formulário de registro de treino.
4. Construir o registro de nutrição manual (com busca na API de alimentos) antes de adicionar a foto com IA.
5. Integrar Gemini para foto de refeição.
6. Adicionar o veredito periódico via cron.
