import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

type Token = {
  text: string;
  key?: string; // present => keyword
  indent?: boolean;
  break?: boolean; // line break after
};

const TOKENS: Token[] = [
  { text: "UMA" },
  { text: "ASSOCIAÇÃO", key: "associacao", break: true },
  { text: "CONSAGRADA", key: "consagrada", indent: true, break: true },
  { text: "À" },
  { text: "MEMÓRIA VIVA", key: "memoria", break: true },
  { text: "DE" },
  { text: "PORTUGAL", key: "portugal" },
];

const DEFINITIONS: Record<string, { title: string; body: string }> = {
  associacao: {
    title: "Associação",
    body: "Um corpo vivo de pessoas reunidas em torno de um propósito comum: cuidar, estudar e celebrar Portugal. Mais do que uma organização, uma comunidade que se reconhece numa herança partilhada.",
  },
  consagrada: {
    title: "Consagrada",
    body: "Dedicada inteiramente, com a seriedade de uma promessa. Consagrar é colocar algo num lugar sagrado — e é assim que tratamos a memória do nosso povo.",
  },
  memoria: {
    title: "Memória Viva",
    body: "A memória que respira, que se transmite de geração em geração, que se actualiza sem se trair. Não um museu fechado, mas uma chama que continua a iluminar o presente.",
  },
  portugal: {
    title: "Portugal",
    body: "A pátria, a língua, os lugares e as gentes. A história longa que vai dos Lusíadas à diáspora — e o futuro que ainda nos cabe escrever.",
  },
};

const COBALT = "#0047AB";

export function MemoriaVivaSection() {
  const [active, setActive] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Reset on scroll out
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setActive(null);
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isActive = active !== null;
  const keywords = TOKENS.filter((t) => t.key);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#FBF8F3] py-24 md:py-32"
      style={{ fontFamily: "'Cinzel', serif" }}
    >
      <LayoutGroup>
        <div className="container mx-auto px-6 md:px-10">
          <AnimatePresence mode="wait">
            {!isActive ? (
              /* ── PHRASE LAYOUT ───────────────────────── */
              <motion.div
                key="phrase"
                className="mx-auto max-w-5xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <PhraseLayout onActivate={setActive} />
              </motion.div>
            ) : (
              /* ── MENU + DEFINITION LAYOUT ────────────── */
              <motion.div
                key="menu"
                className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-20 items-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <nav className="flex flex-col gap-4 md:gap-5">
                  {keywords.map((t) => {
                    const selected = active === t.key;
                    return (
                      <motion.button
                        layoutId={`kw-${t.key}`}
                        key={t.key}
                        onClick={() => setActive(t.key!)}
                        className="text-left tracking-[0.08em] leading-none transition-opacity"
                        style={{
                          color: COBALT,
                          opacity: selected ? 1 : 0.45,
                          fontSize: selected ? "clamp(1.6rem,3vw,2.2rem)" : "clamp(1.2rem,2.2vw,1.6rem)",
                          fontWeight: selected ? 700 : 500,
                        }}
                        whileHover={{ opacity: 0.85, x: 4 }}
                      >
                        {t.text}
                      </motion.button>
                    );
                  })}
                  <button
                    onClick={() => setActive(null)}
                    className="mt-6 text-[10px] tracking-[0.3em] uppercase text-neutral-500 hover:text-neutral-800 transition-colors self-start"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    ← voltar
                  </button>
                </nav>

                <div className="min-h-[260px] flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="max-w-xl"
                    >
                      <p
                        className="text-[11px] tracking-[0.4em] uppercase mb-4"
                        style={{ color: COBALT, fontFamily: "system-ui, sans-serif", opacity: 0.6 }}
                      >
                        {DEFINITIONS[active!].title}
                      </p>
                      <p
                        className="text-lg md:text-xl leading-relaxed text-neutral-800"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                      >
                        {DEFINITIONS[active!].body}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </section>
  );
}

/* ──────────────────────────── Phrase layout ──────────────────────────── */

function PhraseLayout({ onActivate }: { onActivate: (key: string) => void }) {
  // Build lines based on `break` flag
  const lines: Token[][] = [];
  let current: Token[] = [];
  for (const t of TOKENS) {
    current.push(t);
    if (t.break) {
      lines.push(current);
      current = [];
    }
  }
  if (current.length) lines.push(current);

  return (
    <div className="flex flex-col gap-3 md:gap-5 text-center md:text-left">
      {lines.map((line, i) => {
        const indented = line.some((t) => t.indent);
        return (
          <div
            key={i}
            className={`flex flex-wrap items-baseline gap-x-4 md:gap-x-6 ${
              indented ? "justify-center md:justify-start md:pl-[18%]" : "justify-center md:justify-start"
            }`}
          >
            {line.map((t, j) =>
              t.key ? (
                <Keyword key={j} token={t} onActivate={onActivate} />
              ) : (
                <span
                  key={j}
                  className="text-neutral-400 tracking-[0.08em]"
                  style={{
                    fontSize: "clamp(1.5rem,3.2vw,2.4rem)",
                    fontWeight: 400,
                  }}
                >
                  {t.text}
                </span>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}

function Keyword({ token, onActivate }: { token: Token; onActivate: (key: string) => void }) {
  const [hover, setHover] = useState(false);
  const def = DEFINITIONS[token.key!];

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Blurred placeholder definition behind */}
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 mt-2 whitespace-nowrap text-sm text-neutral-700"
            style={{ filter: "blur(4px)", fontFamily: "Georgia, serif" }}
          >
            {def.body.slice(0, 60)}…
          </motion.span>
        )}
      </AnimatePresence>

      <motion.button
        layoutId={`kw-${token.key}`}
        onClick={() => onActivate(token.key!)}
        animate={{ y: hover ? -6 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="relative tracking-[0.08em] leading-none cursor-pointer"
        style={{
          color: COBALT,
          fontSize: "clamp(1.6rem,3.6vw,2.8rem)",
          fontWeight: 600,
        }}
      >
        {token.text}
      </motion.button>
    </span>
  );
}