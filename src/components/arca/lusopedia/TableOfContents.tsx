import { useEffect, useMemo, useState } from "react";
import type { TocItem } from "./articleContent";

/**
 * Realça a secção visível enquanto se lê (sincroniza com o scroll da página =
 * uso legítimo de useEffect).
 */
function useActiveHeading(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (ids.length === 0) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px" }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    }
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const active = useActiveHeading(ids);
  if (items.length < 2) {
    return null;
  }
  return (
    <nav aria-label="Índice do artigo">
      <p className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
        Índice
      </p>
      <ul className="mt-3 space-y-1.5">
        {items.map((item) => (
          <li className={item.level === 3 ? "pl-3" : ""} key={item.id}>
            <a
              className={`block border-l-2 py-0.5 pl-3 font-body text-[13px] leading-snug transition-colors ${
                active === item.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              href={`#${item.id}`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
