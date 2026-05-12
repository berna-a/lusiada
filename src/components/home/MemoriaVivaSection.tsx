import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    if (!el) return;
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
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white py-24 md:py-32"
      style={{ fontFamily: "'Cinzel', serif" }}
    >
      <div className="container mx-auto px-6 md:px-10">
        {/* ── FIXED STANZA ───────────────────────── */}
        <div className="mx-auto w-fit" style={{ transform: "translateX(-75px)" }}>
          <div className="flex flex-col gap-3 md:gap-5 items-end">
            {LINES.map((line) => (
              <div key={line.key} className="flex items-baseline gap-x-[1.2em]">
                {line.prefix && (
                  <span
                    className="tracking-[0.08em]"
                    style={{
                      color: COBALT,
                      opacity: 0.9,
                      fontFamily: "'Cinzel', serif",
                      fontSize: "clamp(2.4rem,5vw,3.6rem)",
                      fontWeight: 200,
                      lineHeight: 1,
                    }}
                  >
                    {line.prefix}
                  </span>
                )}
                <button
                  onClick={() => setActive(line.key)}
                  onMouseEnter={() => setHover(line.key)}
                  onMouseLeave={() => setHover(null)}
                  className="relative tracking-[0.08em] leading-none cursor-pointer transition-all duration-300"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(2.4rem,5vw,3.6rem)",
                    fontWeight: 400,
                    wordSpacing: line.key === "memoria" ? "-0.35em" : undefined,
                    ...(focusedKey === line.key ? goldStyle : { color: COBALT }),
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
          initial={false}
          animate={{ height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="pt-12 md:pt-16 max-w-2xl mx-auto min-h-[180px] flex items-start justify-center">
            <AnimatePresence mode="wait">
              {def && (
                <motion.div
                  key={focusedKey}
                  initial={{
                    opacity: isActiveSelected ? 0 : 0.3,
                    filter: isActiveSelected ? "blur(8px)" : "blur(8px)",
                  }}
                  animate={{
                    opacity: isActiveSelected ? 1 : 0.3,
                    filter: isActiveSelected ? "blur(0px)" : "blur(8px)",
                  }}
                  exit={{ opacity: 0, filter: "blur(8px)" }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center"
                >
                  <p
                    className="text-[11px] tracking-[0.4em] uppercase mb-4"
                    style={{
                      color: COBALT,
                      fontFamily: "system-ui, sans-serif",
                      opacity: 0.6,
                    }}
                  >
                    {def.title}
                  </p>
                  <p
                    className="text-lg md:text-xl leading-relaxed text-neutral-800"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {def.body}
                  </p>
                  {isActiveSelected && (
                    <button
                      onClick={() => {
                        setActive(null);
                        setHover(null);
                      }}
                      className="mt-6 text-[10px] tracking-[0.3em] uppercase text-neutral-500 hover:text-neutral-800 transition-colors"
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