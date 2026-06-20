export type TocItem = { id: string; text: string; level: 2 | 3 };

function slugifyHeading(text: string, used: Set<string>) {
  const base =
    text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "seccao";
  let id = base;
  let n = 2;
  while (used.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  used.add(id);
  return id;
}

/**
 * Injeta âncoras (id) nos H2/H3 do corpo do artigo e devolve o índice (ToC).
 * Permite ligar o índice lateral às secções e fazer scroll até elas.
 */
export function buildArticleContent(body: string): {
  html: string;
  toc: TocItem[];
} {
  if (typeof window === "undefined" || !body) {
    return { html: body, toc: [] };
  }
  const doc = new DOMParser().parseFromString(body, "text/html");
  const used = new Set<string>();
  const toc: TocItem[] = [];
  for (const el of doc.querySelectorAll("h2, h3")) {
    const text = el.textContent?.trim() ?? "";
    if (!text) {
      continue;
    }
    const id = slugifyHeading(text, used);
    el.setAttribute("id", id);
    toc.push({ id, text, level: el.tagName === "H2" ? 2 : 3 });
  }
  return { html: doc.body.innerHTML, toc };
}
