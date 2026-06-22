# Lusopédia — Daily Run (lote de conteúdo)

Guia para gerar lotes de conteúdo a **ritmo gradual e com qualidade máxima**.
Disparado manualmente pelo Bernardo (comando `/lote`), executado pelo Claude no
contexto do plano completo. **Custo: zero** (subscrição Claude Code, não API).

## Estratégia (ordem)

1. **Dicionário primeiro** — é a mina de SEO que GANHAMOS (único, baixa
   concorrência). Enriquecer as páginas `/dicionario/:slug` com **definição**
   por palavra (além das 3 grafias + regra) e expandir gradualmente no sitemap.
2. **Lusopédia depois** — o canon (~100 artigos âncora). Estamos em 43.

> ⚠️ **Regra de ouro anti-penalização:** crescer **gradual** (≈10-20/lote, não
> centenas de rajada). Um *dump* de milhares num domínio novo = "scaled content
> abuse" → pode afundar o domínio. Devagar parece orgânico.

## Qualidade (o molde, não-negociável)

Cada artigo da Lusopédia:
- **Voz editorial Lusíada** (não clone da Wikipédia), PT-PT.
- **Grafia Portuguez** (z): Portuguez/Portugueza; consoantes mudas mantidas
  (acção, objectivo). Ver [[lusiada-grafias-motor]].
- Estrutura: lead forte → 2-3 secções → **"Porque importa"** (ângulo de
  identidade, distintivo).
- **Fonte primária de domínio público** quando possível (verso, citação) em
  `<blockquote>`. NUNCA letras/textos sob direitos.
- **Interlinks** (`lk(slug, texto)`) para artigos existentes.
- Usar naturalmente **palavras divergentes** (acção, objectivo, perspectiva…)
  para ativar o auto-link do dicionário.
- **aliases** quando o nome difere na grafia padrão (ex.: Luiz↔Luís).
- **Rigor factual** — só factos bem estabelecidos. Erros matam a autoridade.

## Pipeline (passos)

1. Escolher os próximos N tópicos da **fila** (abaixo).
2. **Capas:** Wikimedia (`pt.wikipedia.org/w/api.php` pageimages, domínio
   público) → `cwebp -q 82 -resize 900 0` → `public/lusopedia/<slug>.webp`.
3. Escrever no seed (`convex/seedLusopediaN.ts`) com `authorship: "ai"`,
   `cover_image_url` derivado do slug, `image_credit`.
4. `npx convex dev --once` → `npx convex run seedLusopediaN:seedFoundationN`.
5. Verificar no preview (preview_start / preview_eval).
6. Commit + push staging → `npx convex deploy --yes` → seed `--prod`.
7. `gh run watch` (rerun se o install `@swc` falhar). Verificar em prod.
8. Marcar os tópicos como feitos nesta fila.

## Fila de tópicos (prioritizada)

### Lusopédia — canon a fazer (rumo aos ~100; estamos em 43)

**Pessoas:** Afonso III · D. João I · D. José I · Marquês de Sá da Bandeira ·
Mouzinho da Silveira · Mouzinho de Albuquerque · Diogo Cão · Pedro Nunes ·
Garcia de Orta · Egas Moniz (Nobel) · Aristides de Sousa Mendes · Mário Soares ·
Camilo Castelo Branco · Antero de Quental · Cesário Verde · Florbela Espanca ·
Sophia de Mello Breyner · José Saramago · Almeida Garrett · Alexandre Herculano ·
Gago Coutinho · Sacadura Cabral · Amadeo de Souza-Cardoso · Paula Rego ·
Santo António · São Nuno (feito) · Infanta D. Maria.

**Lugares:** Belém · Alfama · Mosteiro da Batalha · Alcobaça · Convento de
Cristo (Tomar) · Fátima · Madeira · Açores · Serra da Estrela · Óbidos ·
Aveiro · Braga · Nazaré · Belmonte · Douro.

**Eventos:** Fundação de Portugal · Cerco de Lisboa (1147) · Guerra Peninsular ·
Implantação da República (1910) · Estado Novo · Guerra Colonial · Adesão à CEE
(1986) · Expo 98.

**Conceitos/Símbolos:** Bandeira de Portugal · Hino (A Portuguesa) · Esfera
Armilar · Galo de Barcelos · Calçada Portugueza · Pastel de Nata · Cante
Alentejano · Manuelino (estilo) · Lusíadas (feito).

**Obras:** Os Maias (feito? não — fazer) · Amor de Perdição · Mensagem (feito).

### Dicionário — definições (track paralelo)

✅ **Montado:** definições em `src/lib/grafia/definicoes.json` (slug → definição
original, NÃO copiada). Mostradas na página (React + SSR) + no JSON-LD
(`DefinedTerm.description`). 43 palavras comuns já com definição.
**Cada lote deste track:** escrever definições para +N palavras divergentes
(alta procura primeiro) em `definicoes.json` e adicionar os slugs ao sitemap
(`api/sitemap.js`, ~30/lote). Páginas com definição = ricas e únicas (menos
"thin", melhor SEO/AEO).

## Estado

- 43 artigos publicados (todos `authorship: "ai"` — a migrar gradualmente para
  humano/revisto).
- Indicador IA vs Humano: ver `/admin/lusopedia`.

---

## Log de lotes feitos

- **Lote 4 (24-06-26)** — canon 43→53: Fátima · Pastel de Nata · José Saramago · Madeira · Açores · Aristides de Sousa Mendes · Almeida Garrett · Bandeira de Portugal · A Portuguesa · Mosteiro da Batalha. (`convex/seedLusopedia4.ts`)
- **Lote 5 (24-06-26)** — canon 53→63: Inês de Castro · Mosteiro de Alcobaça · D. João I · Belém · Estilo Manuelino · Convento de Cristo · Esfera Armilar · Implantação da República · Antero de Quental · Sophia de Mello Breyner. (`convex/seedLusopedia5.ts`)
