# Fontes do léxico de grafias

## `divergencias.json` — eixo consoante/maiúsculas (AO90 ↔ pré-AO90)

- **Origem:** [pedro-mendonca/Convert-PT-AO90](https://github.com/pedro-mendonca/Convert-PT-AO90) (`inc/replace_pairs.json`).
- **Licença da origem:** GPL-3.0.
- **Conteúdo:** ~7 552 pares pré-AO90 → AO90 (`general`) + 22 de maiúsculas (`case_change`: meses, estações, etc.), com inflexões.
- **Como usamos:** mapeamento determinístico. Como o **Portuguez = pré-AO90** no eixo consoante, a forma `pré-AO` e `Portuguez` são a chave (forma antiga) e o `AO90` é o valor.

> ⚠️ **Nota legal (a decidir pelo Bernardo):** os pares são essencialmente factos
> ortográficos definidos pelo Acordo Ortográfico de 1990 (instrumento público).
> A compilação específica é GPL-3.0. Para uso comercial/marca da Lusíada, o ideal
> a prazo é **regenerar a partir de fonte de domínio público** (Vocabulário
> Ortográfico do Português / Portal da Língua Portuguesa) e dar o devido crédito.

## `lexicon.ts` — camada Portuguez (nossa, editável)

Decisões próprias da grafia Portuguez (gentílicos com "z", nomes como "Luiz",
acentos mantidos). É esta a camada que a comunidade da ARCA vai construir e votar,
e que semeia a tabela `lexicon` do Convex.
