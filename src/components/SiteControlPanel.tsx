import {
  Check,
  Languages,
  Moon,
  Music2,
  Settings2,
  Sparkles,
  Sun,
  Type,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  type MotionLevel,
  type Orthography,
  type TextSize,
  useSitePreferences,
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
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(
    null
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const prefs = useSitePreferences();

  useEffect(() => {
    if (!open) {
      return;
    }
    const reposition = () => {
      const el = triggerRef.current;
      if (!el) {
        return;
      }
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
    if (!open) {
      return;
    }
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
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  // Trigger adapts to navbar light/dark — no background, just the icon.
  const triggerColor = onLight
    ? "text-primary/80 hover:text-primary"
    : "text-primary-foreground/80 hover:text-primary-foreground";

  // Panel interior — fixed deep-blue (primary) palette, iOS-style soft tints.
  const titleColor = "text-primary";
  const labelColor = "text-primary/85";
  const subtleColor = "text-primary/55";
  const tileBase = "bg-primary/5 hover:bg-primary/10 text-primary";
  const segmentBase = "text-primary/70 hover:text-primary hover:bg-primary/5";
  const segmentTrack = "bg-primary/5";
  const sectionTrack = "bg-primary/5";

  return (
    <>
      {/* Icon-only trigger — two horizontal toggles (iOS-style controls glyph) */}
      <button
        aria-expanded={open}
        aria-label="Painel de controlo"
        className={`hidden h-10 w-10 items-center justify-center transition-colors sm:inline-flex ${triggerColor}`}
        onClick={() => setOpen((v) => !v)}
        ref={triggerRef}
        type="button"
      >
        <Settings2 className="h-[20px] w-[20px]" />
      </button>

      {open &&
        coords &&
        createPortal(
          <div
            aria-label="Preferências do website"
            className="fixed z-[60] w-[340px] max-w-[calc(100vw-2rem)] origin-top-right animate-scale-in"
            ref={panelRef}
            role="dialog"
            style={{ top: coords.top, right: coords.right }}
          >
            {/* Same shell as the navbar: glass-nav-hero + rounded-[28px] */}
            <div className="glass-nav-hero rounded-[28px] p-4">
              {/* Header strip */}
              <div className="flex items-center justify-between px-1 pb-3">
                <span
                  className={`font-display text-[12px] uppercase tracking-[0.18em] ${titleColor}`}
                >
                  PAINEL DE CONTROLO
                </span>
                <Settings2 className={`h-3.5 w-3.5 ${subtleColor}`} />
              </div>

              {/* Top row — Theme + Music tiles */}
              <div className="grid grid-cols-2 gap-2">
                <Tile
                  active={prefs.theme === "dark"}
                  baseClass={tileBase}
                  icon={
                    prefs.theme === "dark" ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )
                  }
                  label="TEMA"
                  onClick={() =>
                    prefs.setTheme(prefs.theme === "dark" ? "light" : "dark")
                  }
                  subtleClass={subtleColor}
                  value={prefs.theme === "dark" ? "ESCURO" : "CLARO"}
                />
                <Tile
                  active={prefs.music}
                  baseClass={tileBase}
                  comingSoon
                  icon={
                    prefs.music ? (
                      <Music2 className="h-5 w-5" />
                    ) : (
                      <VolumeX className="h-5 w-5" />
                    )
                  }
                  label="MÚSICA"
                  onClick={() => prefs.setMusic(!prefs.music)}
                  subtleClass={subtleColor}
                  value={prefs.music ? "LIGADA" : "DESLIGADA"}
                />
              </div>

              <Section
                icon={<Languages className="h-3.5 w-3.5" />}
                labelColor={labelColor}
                subtleColor={subtleColor}
                title="ORTOGRAFIA"
                trackClass={sectionTrack}
              >
                <SegmentedGroup<Orthography>
                  onChange={prefs.setOrthography}
                  options={[
                    { value: "atual", label: "PORTUGUÊS" },
                    { value: "antigo", label: "ANTIGO" },
                    { value: "etimologico", label: "PORTUGUEZ" },
                  ]}
                  segmentBase={segmentBase}
                  trackClass={segmentTrack}
                  value={prefs.orthography}
                />
              </Section>

              <Section
                icon={<Sparkles className="h-3.5 w-3.5" />}
                labelColor={labelColor}
                subtleColor={subtleColor}
                title="ANIMAÇÕES"
                trackClass={sectionTrack}
              >
                <SegmentedGroup<MotionLevel>
                  onChange={prefs.setMotion}
                  options={[
                    { value: "reduzido", label: "MENOS" },
                    { value: "normal", label: "MAIS" },
                  ]}
                  segmentBase={segmentBase}
                  trackClass={segmentTrack}
                  value={prefs.motion}
                />
              </Section>

              <Section
                icon={<Type className="h-3.5 w-3.5" />}
                labelColor={labelColor}
                subtleColor={subtleColor}
                title="TAMANHO DO TEXTO"
                trackClass={sectionTrack}
              >
                <SegmentedGroup<TextSize>
                  onChange={prefs.setTextSize}
                  options={[
                    { value: "pequeno", label: "A−" },
                    { value: "normal", label: "A" },
                    { value: "grande", label: "A+" },
                  ]}
                  segmentBase={segmentBase}
                  trackClass={segmentTrack}
                  value={prefs.textSize}
                />
              </Section>

              <p
                className={`mt-3 px-1 font-display text-[9px] uppercase tracking-[0.2em] ${subtleColor}`}
              >
                AS TUAS PREFERÊNCIAS FICAM GUARDADAS NESTE DISPOSITIVO
              </p>
            </div>
          </div>,
          document.body
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
      className={`relative flex items-start gap-3 rounded-2xl p-3 text-left transition-all ${
        active ? "bg-accent text-accent-foreground shadow-inner" : baseClass
      }`}
      onClick={onClick}
      type="button"
    >
      <div
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
          active ? "bg-accent-foreground/15" : "bg-foreground/10"
        }`}
      >
        {icon}
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="font-display text-[9px] uppercase tracking-[0.15em] opacity-70">
          {label}
        </span>
        <span className="mt-0.5 truncate font-display text-[12px] uppercase leading-tight tracking-[0.12em]">
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
      <div className={`mb-2 flex items-center gap-2 px-1 ${labelColor}`}>
        <span className={subtleColor}>{icon}</span>
        <span className="font-display text-[10px] uppercase tracking-[0.18em]">
          {title}
        </span>
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
      className={`grid gap-1 rounded-xl p-1 ${trackClass}`}
      role="radiogroup"
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            aria-checked={active}
            className={`flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 font-display text-[10px] uppercase tracking-[0.12em] transition-all ${
              active
                ? "bg-accent text-accent-foreground shadow-sm"
                : segmentBase
            }`}
            key={opt.value}
            onClick={() => onChange(opt.value)}
            role="radio"
            type="button"
          >
            {active && <Check className="h-3 w-3" />}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
