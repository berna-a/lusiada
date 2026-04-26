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
  type ThemeMode,
  type Orthography,
  type MotionLevel,
  type TextSize,
} from "@/contexts/SitePreferencesContext";

interface SiteControlPanelProps {
  onLight: boolean;
}

/**
 * Apple-Control-Center-style settings panel.
 * Discreet trigger placed next to the "Junta-te" CTA in the navbar.
 */
export function SiteControlPanel({ onLight }: SiteControlPanelProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const prefs = useSitePreferences();

  // Position panel under the trigger
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

  // Close on outside click / Escape
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

  const triggerColor = onLight
    ? "text-primary/80 hover:text-primary hover:bg-primary/10"
    : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10";

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
            <div
              className="rounded-[24px] p-3 shadow-2xl border"
              style={{
                background:
                  "linear-gradient(180deg, hsl(var(--background) / 0.85), hsl(var(--background) / 0.78))",
                borderColor: "hsl(var(--border) / 0.6)",
                backdropFilter: "blur(28px) saturate(1.6)",
                WebkitBackdropFilter: "blur(28px) saturate(1.6)",
                boxShadow:
                  "0 20px 60px -10px hsl(0 0% 0% / 0.25), inset 0 1px 0 hsl(0 0% 100% / 0.4)",
              }}
            >
              {/* Top row: Theme + Music tiles */}
              <div className="grid grid-cols-2 gap-2">
                <Tile
                  active={prefs.theme === "dark"}
                  onClick={() => prefs.setTheme(prefs.theme === "dark" ? "light" : "dark")}
                  icon={prefs.theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  label="Tema"
                  value={prefs.theme === "dark" ? "Escuro" : "Claro"}
                />
                <Tile
                  active={prefs.music}
                  onClick={() => prefs.setMusic(!prefs.music)}
                  icon={prefs.music ? <Music2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  label="Música"
                  value={prefs.music ? "Ligada" : "Desligada"}
                  comingSoon
                />
              </div>

              {/* Orthography */}
              <Section
                icon={<Languages className="h-4 w-4" />}
                title="Ortografia"
              >
                <SegmentedGroup<Orthography>
                  value={prefs.orthography}
                  onChange={prefs.setOrthography}
                  options={[
                    { value: "atual", label: "Português" },
                    { value: "antigo", label: "Antigo Acordo" },
                    { value: "etimologico", label: "Portuguez" },
                  ]}
                />
              </Section>

              {/* Animations */}
              <Section
                icon={<Sparkles className="h-4 w-4" />}
                title="Animações"
              >
                <SegmentedGroup<MotionLevel>
                  value={prefs.motion}
                  onChange={prefs.setMotion}
                  options={[
                    { value: "reduzido", label: "Menos" },
                    { value: "normal", label: "Mais" },
                  ]}
                />
              </Section>

              {/* Text size */}
              <Section icon={<Type className="h-4 w-4" />} title="Tamanho do texto">
                <SegmentedGroup<TextSize>
                  value={prefs.textSize}
                  onChange={prefs.setTextSize}
                  options={[
                    { value: "pequeno", label: "A−" },
                    { value: "normal", label: "A" },
                    { value: "grande", label: "A+" },
                  ]}
                />
              </Section>

              <p className="mt-3 px-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                As tuas preferências ficam guardadas neste dispositivo.
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
  comingSoon,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  value: string;
  comingSoon?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-start gap-3 rounded-2xl p-3 text-left transition-all ${
        active
          ? "bg-accent text-accent-foreground shadow-inner"
          : "bg-foreground/5 hover:bg-foreground/10 text-foreground"
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
        <span className="font-display uppercase tracking-[0.12em] text-[10px] opacity-75">
          {label}
        </span>
        <span className="font-body text-[13px] leading-tight mt-0.5 truncate">{value}</span>
      </div>
      {comingSoon && (
        <span className="absolute top-2 right-2 text-[8px] uppercase tracking-[0.15em] opacity-60">
          v2
        </span>
      )}
    </button>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-2 rounded-2xl bg-foreground/5 p-3">
      <div className="flex items-center gap-2 px-1 mb-2 text-foreground/80">
        <span className="text-foreground/60">{icon}</span>
        <span className="font-display uppercase tracking-[0.15em] text-[10px]">{title}</span>
      </div>
      {children}
    </div>
  );
}

function SegmentedGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div
      role="radiogroup"
      className="grid gap-1 rounded-xl bg-background/60 p-1"
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
            className={`flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 font-body text-[12px] transition-all ${
              active
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
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
