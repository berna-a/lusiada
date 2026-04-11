import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Crown,
  MapPin,
  Users,
  BookOpen,
  FolderOpen,
  BookMarked,
  Search,
  ArrowRight,
  Compass,
  Sparkles,
  Clock,
  Star,
} from "lucide-react";

/* ──────────────────────────── Data ──────────────────────────── */

const mainEntries = [
  {
    title: "Panteão",
    desc: "Os grandes vultos que moldaram a história da lusofonia.",
    icon: Crown,
    to: "/arca/panteao",
    accent: true,
  },
  {
    title: "Lugares",
    desc: "Locais de memória, significado e identidade.",
    icon: MapPin,
    to: "/arca/lugares",
  },
  {
    title: "Memórias",
    desc: "Relatos, documentos e testemunhos vivos.",
    icon: BookOpen,
    to: "/arca/memorias",
  },
  {
    title: "Colecções",
    desc: "Acervos temáticos curados com rigor.",
    icon: FolderOpen,
    to: "/arca/coleccoes",
  },
  {
    title: "Lusopédia",
    desc: "A enciclopédia viva da lusofonia. Em breve.",
    icon: BookMarked,
    to: "#",
    coming: true,
  },
];

const sampleHeroes = [
  { id: "1", name: "Fernão de Magalhães", period: "1480–1521", category: "Navegador" },
  { id: "2", name: "Luís de Camões", period: "1524–1580", category: "Poeta" },
  { id: "3", name: "Bartolomeu Dias", period: "1450–1500", category: "Navegador" },
  { id: "4", name: "Rainha Santa Isabel", period: "1271–1336", category: "Monarca" },
];

const samplePlaces = [
  { id: "1", name: "Torre de Belém", location: "Lisboa", category: "Monumento" },
  { id: "2", name: "Universidade de Coimbra", location: "Coimbra", category: "Instituição" },
  { id: "3", name: "Mosteiro dos Jerónimos", location: "Lisboa", category: "Monumento" },
];

const discoveryPaths = [
  { title: "Idade dos Descobrimentos", count: 48, icon: Compass },
  { title: "Património Imaterial", count: 32, icon: Sparkles },
  { title: "Figuras do Século XX", count: 27, icon: Clock },
  { title: "Grandes Obras Literárias", count: 41, icon: Star },
];

/* ──────────────────────────── Page ──────────────────────────── */

export default function ArcaPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen">
      {/* ── 1. HERO ── */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        {/* bg layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_60%_-10%,hsl(var(--electric)/0.10),transparent)]" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-2xl space-y-5">
            <p className="text-[11px] uppercase tracking-[0.4em] text-accent/80 font-semibold font-body">
              Associação Lusíada
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground tracking-[-0.02em] leading-[0.95] font-display">
              Arca
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 max-w-lg leading-relaxed font-display italic">
              O arquivo vivo da memória nacional.
            </p>
            <p className="text-sm md:text-base text-primary-foreground/50 max-w-md leading-relaxed font-body font-light">
              A Arca Lusíada preserva, organiza e partilha o vasto património da lusofonia — dos grandes heróis aos lugares que contam a nossa história.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button size="lg" variant="accent" asChild>
                <a href="#explorar">Explorar o Arquivo</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground/90 hover:bg-primary-foreground/10 hover:border-primary-foreground/30 backdrop-blur-sm"
                asChild
              >
                <Link to="/arca/panteao">Ver o Panteão</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. PESQUISA E FILTROS ── */}
      <section id="explorar" className="py-10 md:py-14 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto glass-card rounded-2xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar heróis, lugares, memórias…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-background/60 border-border/40 font-body"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-44 h-11 bg-background/60 border-border/40 font-body text-sm">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="herois">Heróis</SelectItem>
                  <SelectItem value="lugares">Lugares</SelectItem>
                  <SelectItem value="memorias">Memórias</SelectItem>
                  <SelectItem value="coleccoes">Colecções</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-44 h-11 bg-background/60 border-border/40 font-body text-sm">
                  <SelectValue placeholder="Tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="descobrimentos">Descobrimentos</SelectItem>
                  <SelectItem value="literatura">Literatura</SelectItem>
                  <SelectItem value="patrimonio">Património</SelectItem>
                  <SelectItem value="ciencia">Ciência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. ENTRADAS PRINCIPAIS ── */}
      <section className="py-10 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display">
              Portas de Entrada
            </h2>
            <p className="text-sm text-muted-foreground font-body">
              As grandes áreas do arquivo lusófono.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {mainEntries.map((entry) => (
              <Link
                key={entry.title}
                to={entry.to}
                className={`group ${entry.coming ? "pointer-events-none" : ""}`}
              >
                <div
                  className={`relative h-full rounded-xl border p-6 flex flex-col gap-4 transition-all duration-300
                    ${entry.coming
                      ? "border-border/20 bg-card/30 opacity-60"
                      : "border-border/40 bg-card/60 backdrop-blur-sm hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_hsl(var(--primary)/0.12),0_0_0_1px_hsl(var(--accent)/0.12)] hover:border-accent/25"
                    }
                    ${entry.accent ? "lg:col-span-1 border-accent/20 bg-accent/[0.03]" : ""}
                  `}
                >
                  {entry.coming && (
                    <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider text-accent/70 font-semibold font-body bg-accent/10 px-2 py-0.5 rounded-full">
                      Em breve
                    </span>
                  )}
                  <div className="rounded-xl bg-primary/[0.04] border border-primary/[0.06] p-3.5 w-fit group-hover:bg-accent/[0.08] group-hover:border-accent/20 transition-all duration-300">
                    <entry.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-lg font-semibold text-foreground font-display">{entry.title}</p>
                    <p className="text-sm text-muted-foreground/70 font-body leading-relaxed">{entry.desc}</p>
                  </div>
                  {!entry.coming && (
                    <div className="mt-auto pt-2">
                      <span className="text-xs text-accent font-semibold font-body flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                        Explorar <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. GRID MISTO DE CONTEÚDOS ── */}
      <section className="py-10 md:py-16 bg-gradient-to-b from-background via-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display">
              Arquivo Exploratório
            </h2>
            <p className="text-sm text-muted-foreground font-body">
              Heróis, lugares e entradas que dão corpo à memória colectiva.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {/* Heroes row */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground/80 font-body uppercase tracking-wider">Heróis</h3>
                <Link to="/arca/herois" className="text-xs text-accent hover:text-accent/80 font-body flex items-center gap-1">
                  Ver todos <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {sampleHeroes.map((hero) => (
                  <Link key={hero.id} to={`/arca/herois/${hero.id}`} className="group">
                    <div className="rounded-xl border border-border/30 bg-card/50 backdrop-blur-sm p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.10)]">
                      <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/15 flex items-center justify-center mb-3">
                        <Users className="h-4 w-4 text-accent" />
                      </div>
                      <p className="text-sm font-semibold text-foreground font-display">{hero.name}</p>
                      <p className="text-xs text-muted-foreground/60 font-body mt-0.5">{hero.period}</p>
                      <span className="inline-block mt-2 text-[10px] uppercase tracking-wider text-accent/60 font-semibold font-body bg-accent/[0.06] px-2 py-0.5 rounded-full">
                        {hero.category}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Places row */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground/80 font-body uppercase tracking-wider">Lugares</h3>
                <Link to="/arca/lugares" className="text-xs text-accent hover:text-accent/80 font-body flex items-center gap-1">
                  Ver todos <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {samplePlaces.map((place) => (
                  <Link key={place.id} to={`/arca/lugares/${place.id}`} className="group">
                    <div className="rounded-xl border border-border/30 bg-card/50 backdrop-blur-sm p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.10)]">
                      <div className="w-10 h-10 rounded-lg bg-primary/[0.04] border border-primary/[0.06] flex items-center justify-center mb-3">
                        <MapPin className="h-4 w-4 text-accent" />
                      </div>
                      <p className="text-sm font-semibold text-foreground font-display">{place.name}</p>
                      <p className="text-xs text-muted-foreground/60 font-body mt-0.5">{place.location}</p>
                      <span className="inline-block mt-2 text-[10px] uppercase tracking-wider text-muted-foreground/50 font-semibold font-body bg-muted/40 px-2 py-0.5 rounded-full">
                        {place.category}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. DESCOBERTA ── */}
      <section className="py-10 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display">
              Caminhos de Exploração
            </h2>
            <p className="text-sm text-muted-foreground font-body">
              Percursos temáticos para descobrir a profundidade do arquivo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {discoveryPaths.map((path) => (
              <div
                key={path.title}
                className="rounded-xl border border-border/30 bg-card/40 p-5 text-center space-y-3 transition-all duration-300 hover:border-accent/20 hover:bg-card/60 cursor-pointer group"
              >
                <div className="mx-auto w-11 h-11 rounded-full bg-accent/[0.08] border border-accent/15 flex items-center justify-center group-hover:bg-accent/15 transition-all duration-300">
                  <path.icon className="h-5 w-5 text-accent" />
                </div>
                <p className="text-sm font-semibold text-foreground font-display">{path.title}</p>
                <p className="text-xs text-muted-foreground/60 font-body">{path.count} entradas</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CTA FINAL ── */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center glass-card rounded-2xl p-10 md:p-14 space-y-5">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display">
              A memória vive quando é partilhada
            </h2>
            <p className="text-sm text-muted-foreground font-body max-w-md mx-auto leading-relaxed">
              A Arca Lusíada cresce com cada contribuição. Explora o arquivo, descobre histórias esquecidas e ajuda-nos a preservar o que importa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button size="lg" variant="accent" asChild>
                <Link to="/arca/herois">Descobrir Heróis</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/apoiar">Apoiar a Arca</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
