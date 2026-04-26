import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Sun,
  Moon,
  Sparkles,
  SlidersHorizontal,
  Music2,
  VolumeX,
  Type,
  Languages,
  Check,
} from "lucide-react";
import {
  useSitePreferences,
  type Orthography,
  type MotionLevel,
  type TextSize,
} from "@/contexts/SitePreferencesContext";

interface SiteControlPanelProps {
  onLight: boolean;
}

/**
 * Settings panel — matches the navbar's glass-nav-hero treatment exactly:
 * same conic-gradient border, same backdrop blur, same rounded-[28px] bubble,
 * same Cinzel uppercase tracking, same adaptive light/dark text colours.
 */
export function SiteControlPanel({ onLight }: SiteControlPanelProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const prefs = useSitePreferences();

  useEffect(() => {
    if (!open) return;
    const reposition = () => {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setCoords({
        top: r.bottom + 12,
        right: window.innerWidth - r.right,
      });
    };
    reposition();
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(t) &&
        triggerRef.current &&
        !triggerRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  // Adaptive palette — mirrors InstitutionalNavbar.tsx
  const triggerColor = onLight
    ? "text-primary/80 hover:text-primary hover:bg-primary/10"
    : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10";
  const titleColor = onLight ? "text-primary" : "text-primary-foreground";
  const labelColor = onLight ? "text-primary/80" : "text-primary-foreground/80";
  const subtleColor = onLight ? "text-primary/60" : "text-primary-foreground/60";
  const tileBase = onLight
    ? "bg-primary/5 hover:bg-primary/10 text-primary"
    : "bg-primary-foreground/5 hover:bg-primary-foreground/10 text-primary-foreground";
  const segmentBase = onLight
    ? "text-primary/70 hover:text-primary hover:bg-primary/5"
    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5";
  const segmentTrack = onLight ? "bg-primary/5" : "bg-primary-foreground/5";
  const sectionTrack = onLight ? "bg-primary/5" : "bg-primary-foreground/5";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Painel de controlo"
        aria-expanded={open}
        className={`hidden sm:grid place-items-center h-10 w-10 rounded-full transition-colors ${triggerColor}`}
      >
        <SlidersHorizontal className="h-[18px] w-[18px]" />
      </button>

      {open &&
        coords &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Preferências do website"
            className="fixed z-[60] w-[340px] max-w-[calc(100vw-2rem)] animate-scale-in origin-top-right"
            style={{ top: coords.top, right: coords.right }}
          >
            {/* Same shell as the navbar: glass-nav-hero + rounded-[28px] */}
            <div className="glass-nav-hero rounded-[28px] p-4">
              {/* Header strip */}
              <div className="flex items-center justify-between px-1 pb-3">
                <span
                  className={`font-display uppercase tracking-[0.18em] text-[12px] ${titleColor}`}
                >
                  PAINEL DE CONTROLO
                </span>
                <SlidersHorizontal className={`h-3.5 w-3.5 ${subtleColor}`} />
              </div>

              {/* Top row — Theme + Music tiles */}
              <div className="grid grid-cols-2 gap-2">
                <Tile
                  active={prefs.theme === "dark"}
                  onClick={() => prefs.setTheme(prefs.theme === "dark" ? "light" : "dark")}
                  icon={
                    prefs.theme === "dark" ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )
                  }
                  label="TEMA"
                  value={prefs.theme === "dark" ? "ESCURO" : "CLARO"}
                  baseClass={tileBase}
                  subtleClass={subtleColor}
                />
                <Tile
                  active={prefs.music}
                  onClick={() => prefs.setMusic(!prefs.music)}
                  icon={
                    prefs.music ? <Music2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />
                  }
                  label="MÚSICA"
                  value={prefs.music ? "LIGADA" : "DESLIGADA"}
                  baseClass={tileBase}
                  subtleClass={subtleColor}
                  comingSoon
                />
              </div>

              <Section
                icon={<Languages className="h-3.5 w-3.5" />}
                title="ORTOGRAFIA"
                labelColor={labelColor}
                subtleColor={subtleColor}
                trackClass={sectionTrack}
              >
                <SegmentedGroup<Orthography>
                  value={prefs.orthography}
                  onChange={prefs.setOrthography}
                  options={[
                    { value: "atual", label: "PORTUGUÊS" },
                    { value: "antigo", label: "ANTIGO" },
                    { value: "etimologico", label: "PORTUGUEZ" },
                  ]}
                  segmentBase={segmentBase}
                  trackClass={segmentTrack}
                />
              </Section>

              <Section
                icon={<Sparkles className="h-3.5 w-3.5" />}
                title="ANIMAÇÕES"
                labelColor={labelColor}
                subtleColor={subtleColor}
                trackClass={sectionTrack}
              >
                <SegmentedGroup<MotionLevel>
                  value={prefs.motion}
                  onChange={prefs.setMotion}
                  options={[
                    { value: "reduzido", label: "MENOS" },
                    { value: "normal", label: "MAIS" },
                  ]}
                  segmentBase={segmentBase}
                  trackClass={segmentTrack}
                />
              </Section>

              <Section
                icon={<Type className="h-3.5 w-3.5" />}
                title="TAMANHO DO TEXTO"
                labelColor={labelColor}
                subtleColor={subtleColor}
                trackClass={sectionTrack}
              >
                <SegmentedGroup<TextSize>
                  value={prefs.textSize}
                  onChange={prefs.setTextSize}
                  options={[
                    { value: "pequeno", label: "A−" },
                    { value: "normal", label: "A" },
                    { value: "grande", label: "A+" },
                  ]}
                  segmentBase={segmentBase}
                  trackClass={segmentTrack}
                />
              </Section>

              <p
                className={`mt-3 px-1 font-display text-[9px] uppercase tracking-[0.2em] ${subtleColor}`}
              >
                AS TUAS PREFERÊNCIAS FICAM GUARDADAS NESTE DISPOSITIVO
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

/* ---------- Internal building blocks ---------- */

function Tile({
  active,
  onClick,
  icon,
  label,
  value,
  baseClass,
  subtleClass,
  comingSoon,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  value: string;
  baseClass: string;
  subtleClass: string;
  comingSoon?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-start gap-3 rounded-2xl p-3 text-left transition-all ${
        active ? "bg-accent text-accent-foreground shadow-inner" : baseClass
      }`}
    >
      <div
        className={`grid place-items-center h-9 w-9 rounded-full shrink-0 ${
          active ? "bg-accent-foreground/15" : "bg-foreground/10"
        }`}
      >
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-display uppercase tracking-[0.15em] text-[9px] opacity-70">
          {label}
        </span>
        <span className="font-display uppercase tracking-[0.12em] text-[12px] leading-tight mt-0.5 truncate">
          {value}
        </span>
      </div>
      {comingSoon && (
        <span
          className={`absolute top-2 right-2 font-display text-[8px] uppercase tracking-[0.2em] ${
            active ? "text-accent-foreground/70" : subtleClass
          }`}
        >
          V2
        </span>
      )}
    </button>
  );
}

function Section({
  icon,
  title,
  children,
  labelColor,
  subtleColor,
  trackClass,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  labelColor: string;
  subtleColor: string;
  trackClass: string;
}) {
  return (
    <div className={`mt-2 rounded-2xl p-3 ${trackClass}`}>
      <div className={`flex items-center gap-2 px-1 mb-2 ${labelColor}`}>
        <span className={subtleColor}>{icon}</span>
        <span className="font-display uppercase tracking-[0.18em] text-[10px]">{title}</span>
      </div>
      {children}
    </div>
  );
}

function SegmentedGroup<T extends string>({
  value,
  onChange,
  options,
  segmentBase,
  trackClass,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  segmentBase: string;
  trackClass: string;
}) {
  return (
    <div
      role="radiogroup"
      className={`grid gap-1 rounded-xl p-1 ${trackClass}`}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 font-display uppercase tracking-[0.12em] text-[10px] transition-all ${
              active ? "bg-accent text-accent-foreground shadow-sm" : segmentBase
            }`}
          >
            {active && <Check className="h-3 w-3" />}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
