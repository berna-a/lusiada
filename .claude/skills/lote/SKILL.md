---
name: lote
description: Gera o próximo lote de conteúdo da Lusopédia/Dicionário (ritmo gradual, qualidade máxima, custo zero). Usar quando o Bernardo pede "próximo lote", "/lote", ou para alimentar a enciclopédia/dicionário.
---

# Lote de conteúdo da Lusopédia

O Bernardo disparou o lote diário de conteúdo. Executa **no contexto do plano completo**.

## Passos

1. **Lê o playbook:** `docs/lusopedia-daily-run.md` (estratégia, molde, pipeline, fila de tópicos, regra anti-penalização).
2. **Confirma o âmbito do lote** com o Bernardo se não for óbvio: por omissão, **10-15 artigos** da fila da Lusopédia (ou o track do Dicionário, se for esse o foco). Respeita o ritmo gradual — nunca centenas de rajada.
3. **Executa o pipeline** do playbook: capas (Wikimedia → webp) → escrever no seed com `authorship: "ai"` → push dev → seed → verificar no preview → deploy prod → seed `--prod` → `gh run watch`.
4. **Qualidade não-negociável:** voz editorial Lusíada, grafia Portuguez (z), secção "Porque importa", fonte primária de domínio público, interlinks, palavras divergentes para o auto-link, rigor factual.
5. **Atualiza a fila** em `docs/lusopedia-daily-run.md` (marca os tópicos feitos) e dá um resumo curto (quantos, quais, total acumulado) no formato do Bernardo (🅰️/🅱️ para o próximo passo).

## Regras

- Custo zero — usa esta sessão (Claude Code), nunca a API.
- Verifica sempre em produção antes de reportar.
- Se a fila acabar, propõe novos tópicos do canon antes de gerar.
