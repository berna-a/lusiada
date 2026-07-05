import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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

/* Ultra-realistic metallic gold via background-clip: text */
const goldStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(135deg, #D4AF37 0%, #F9F295 25%, #EDC967 50%, #F9F295 75%, #D4AF37 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
  textShadow: "0 1px 0 rgba(212,175,55,0.15)",
};

export function MemoriaVivaSection() {
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Reset on scroll out
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) {
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setActive(null);
          setHover(null);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const focusedKey = active ?? hover;
  const isOpen = focusedKey !== null;
  const def = focusedKey ? DEFINITIONS[focusedKey] : null;
  const isActiveSelected = active !== null;

  return (
    <section
      className="relative w-full overflow-hidden bg-white py-24 md:py-32"
      ref={sectionRef}
      style={{ fontFamily: "'Cinzel', serif" }}
    >
      <div className="container mx-auto px-6 md:px-10">
        {/* ── FIXED STANZA ───────────────────────── */}
        <div className="mx-auto w-fit translate-x-0 md:-translate-x-[75px]">
          <div className="flex flex-col items-end gap-3 md:gap-5">
            {LINES.map((line) => (
              <div className="flex items-baseline gap-x-[1.2em]" key={line.key}>
                {line.prefix && (
                  <span
                    className="tracking-[0.08em]"
                    style={{
                      color: COBALT,
                      opacity: 0.9,
                      fontFamily: "'Cinzel', serif",
                      fontSize: "clamp(1.6rem,7vw,3.6rem)",
                      fontWeight: 50,
                      lineHeight: 1,
                    }}
                  >
                    {line.prefix}
                  </span>
                )}
                <button
                  className="relative cursor-pointer leading-none tracking-[0.08em] transition-all duration-300"
                  onClick={() => setActive(line.key)}
                  onMouseEnter={() => setHover(line.key)}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(1.6rem,7vw,3.6rem)",
                    fontWeight: 400,
                    wordSpacing: line.key === "memoria" ? "-0.35em" : undefined,
                    ...(focusedKey === line.key
                      ? goldStyle
                      : { color: COBALT }),
                  }}
                >
                  {line.keyword}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── EXPANDABLE CONTENT AREA ───────────────────────── */}
        <motion.div
          animate={{ height: isOpen ? "auto" : 0 }}
          className="overflow-hidden"
          initial={false}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto flex min-h-[180px] max-w-2xl items-start justify-center pt-12 md:pt-16">
            <AnimatePresence mode="wait">
              {def && (
                <motion.div
                  animate={{
                    opacity: isActiveSelected ? 1 : 0.3,
                    filter: isActiveSelected ? "blur(0px)" : "blur(8px)",
                  }}
                  className="text-center"
                  exit={{ opacity: 0, filter: "blur(8px)" }}
                  initial={{
                    opacity: isActiveSelected ? 0 : 0.3,
                    filter: isActiveSelected ? "blur(8px)" : "blur(8px)",
                  }}
                  key={focusedKey}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p
                    className="mb-4 text-[11px] uppercase tracking-[0.4em]"
                    style={{
                      color: COBALT,
                      fontFamily: "system-ui, sans-serif",
                      opacity: 0.6,
                    }}
                  >
                    {def.title}
                  </p>
                  <p
                    className="text-lg text-neutral-800 leading-relaxed md:text-xl"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {def.body}
                  </p>
                  {isActiveSelected && (
                    <button
                      className="mt-6 text-[10px] text-neutral-500 uppercase tracking-[0.3em] transition-colors hover:text-neutral-800"
                      onClick={() => {
                        setActive(null);
                        setHover(null);
                      }}
                      style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                      ← fechar
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
