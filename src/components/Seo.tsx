import { useEffect } from "react";

const SITE = "https://www.alusiada.pt";
const ORG = {
  "@type": "Organization",
  name: "Associação Memória Lusíada",
  url: SITE,
  logo: `${SITE}/favicon.ico`,
};

type SeoProps = {
  title: string;
  description?: string | null;
  /** Caminho canónico, ex.: "/arca/lusopedia/saudade". */
  path: string;
  image?: string | null;
  type?: "website" | "article";
  /** Objeto(s) JSON-LD (sem @context — é adicionado). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Impede a indexação no Google (mantém follow). Ex.: verbetes importados crus. */
  noindex?: boolean;
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Sincroniza os metadados do <head> da página (título, descrição, canónico,
 * OpenGraph, Twitter e JSON-LD). Reutiliza/atualiza as tags existentes para não
 * duplicar as que vêm do index.html. (Sincronizar o <head> = uso legítimo de
 * useEffect.)
 */
export function Seo({
  title,
  description,
  path,
  image,
  type = "website",
  jsonLd,
  noindex = false,
}: SeoProps) {
  const url = `${SITE}${path}`;
  const graph = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const ld = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [ORG, ...graph],
  });
  const desc = description ?? "";
  // og:image/twitter:image exigem URL absoluto (partilhas sociais).
  const absImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE}${image}`
    : null;

  useEffect(() => {
    document.title = title;
    upsertMeta("name", "robots", noindex ? "noindex,follow" : "index,follow");
    upsertLink("canonical", url);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:url", url);
    upsertMeta("name", "twitter:title", title);
    upsertMeta(
      "name",
      "twitter:card",
      absImage ? "summary_large_image" : "summary"
    );
    if (desc) {
      upsertMeta("name", "description", desc);
      upsertMeta("property", "og:description", desc);
      upsertMeta("name", "twitter:description", desc);
    }
    if (absImage) {
      upsertMeta("property", "og:image", absImage);
      upsertMeta("name", "twitter:image", absImage);
    }

    let script = document.head.querySelector<HTMLScriptElement>(
      'script[type="application/ld+json"][data-seo]'
    );
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "");
      document.head.appendChild(script);
    }
    script.textContent = ld;
  }, [title, url, type, absImage, desc, ld, noindex]);

  return null;
}
