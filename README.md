# Fit — treino e nutrição

App web pessoal (PWA) para controle diário de **corrida** e **alimentação**, com um agente Gemini monitorando se os dados estão dentro da meta — com destaque para sódio, depois da câimbra no km14 da meia-maratona de 23/08/2026.

A especificação completa está em [`docs/especificacao.md`](docs/especificacao.md).

## Stack

| Camada | Escolha |
|---|---|
| Frontend | Next.js App Router, PWA |
| Backend | API Routes do Next.js |
| Banco | a provisionar no Vercel (projeto novo) |
| Deploy | Vercel |
| IA | Gemini `gemini-3.6-flash` — chave `GEMINI_API_KEY` no Vercel |

## Como rodar

```bash
npm install
cp .env.example .env.local
npm run dev
```

A chave do Gemini vai em `GEMINI_API_KEY` no Vercel (Production / Preview / Development). Depois faça Redeploy. Qualquer usuário do app usa a mesma análise, sem cadastrar chave no client.

Localmente:

```bash
cp .env.example .env.local
# cole GEMINI_API_KEY=
npm run dev
```

## Rotas

- `/hoje` — treino do dia + macros (sódio em âmbar)
- `/treino` — plano atual (Fase 0 → Blocos 1-3)
- `/nutricao` — registro manual e foto (Gemini)
- `/historico` — contexto da meia-maratona e veredito futuro

Toda chamada ao Gemini sai de API route. A chave nunca vai para o client.
