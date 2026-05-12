import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

type Line = { prefix: string; keyword: string; key: string };

const LINES: Line[] = [
  { prefix: "UMA", keyword: "ASSOCIAÇÃO", key: "associacao" },
  { prefix: "", keyword: "CONSAGRADA", key: "consagrada" },
  { prefix: "À", keyword: "MEMÓRIA VIVA", key: "memoria" },
  { prefix: "DE", keyword: "PORTUGAL", key: "portugal" },
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
const GOLD = "#F2C744";

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
  const keywords = LINES;

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
                className="mx-auto w-fit"
                style={{ transform: "translateX(-25px)" }}
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
                <nav className="flex flex-col gap-4 md:gap-5 items-end">
                  {keywords.map((t) => {
                    const selected = active === t.key;
                    return (
                      <motion.button
                        layoutId={`kw-${t.key}`}
                        key={t.key}
                        onClick={() => setActive(t.key)}
                        className="text-left tracking-[0.08em] leading-none transition-colors"
                        style={{
                          color: selected ? GOLD : COBALT,
                          opacity: selected ? 1 : 0.7,
                          fontFamily: "'Cinzel', serif",
                          fontSize: "clamp(2.4rem,5vw,3.6rem)",
                          fontWeight: 400,
                        }}
                        whileHover={{ color: GOLD, opacity: 1 }}
                      >
                        {t.keyword}
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
  return (
    <div className="flex flex-col gap-3 md:gap-5 items-end">
      {LINES.map((line) => (
        <div key={line.key} className="flex items-baseline gap-x-[0.4em]">
          {line.prefix && (
            <span
              className="tracking-[0.08em]"
              style={{
                color: COBALT,
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(2.4rem,5vw,3.6rem)",
                fontWeight: 400,
                lineHeight: 1,
              }}
            >
              {line.prefix}
            </span>
          )}
          <Keyword line={line} onActivate={onActivate} />
        </div>
      ))}
    </div>
  );
}

function Keyword({ line, onActivate }: { line: Line; onActivate: (key: string) => void }) {
  const [hover, setHover] = useState(false);
  const def = DEFINITIONS[line.key];

  return (
    <span
      className="relative inline-block text-left"
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
        layoutId={`kw-${line.key}`}
        onClick={() => onActivate(line.key)}
        animate={{ y: hover ? -6 : 0, color: hover ? GOLD : COBALT }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="relative tracking-[0.08em] leading-none cursor-pointer"
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(2.4rem,5vw,3.6rem)",
          fontWeight: 400,
        }}
      >
        {line.keyword}
      </motion.button>
    </span>
  );
}