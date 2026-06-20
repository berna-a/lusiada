import { useQuery } from "convex/react";
import { BookMarked, Loader2, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "@/components/arca/lusopedia/constants";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "../../../convex/_generated/api";

export default function LusopediaPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const articles = useQuery(api.articles.list, {
    category,
    search: search || undefined,
  });

  return (
    <main
      className="mx-auto max-w-5xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="A enciclopédia viva da lusofonia — conceitos, história, pessoas, lugares e obras do Povo Português, escritos e debatidos pela comunidade."
        jsonLd={{
          "@type": "CollectionPage",
          name: "Lusopédia",
          description: "A enciclopédia da lusofonia da Associação Memória Lusíada.",
          inLanguage: "pt-PT",
          isPartOf: { "@type": "WebSite", name: "Lusopédia", url: "https://www.alusiada.pt/arca/lusopedia" },
        }}
        path="/arca/lusopedia"
        title="Lusopédia — A enciclopédia da lusofonia"
      />
      <header className="text-center">
        <p className="font-body text-[12px] text-accent uppercase tracking-[0.3em]">
          Arca · Memória Lusíada
        </p>
        <h1 className="mt-3 font-display text-[44px] text-primary leading-[1] sm:text-[56px]">
          Lusopédia
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-[16px] text-foreground/65 leading-relaxed">
          A enciclopédia viva da lusofonia — escrita, discutida e votada pela
          comunidade.
        </p>
      </header>

      {/* Pesquisa + ação */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar artigos…"
            value={search}
          />
        </div>
        <Button asChild className="w-full sm:w-auto" variant="accent">
          <Link to="/arca/lusopedia/novo">
            <Plus className="mr-1.5 h-4 w-4" /> Novo artigo
          </Link>
        </Button>
      </div>

      {/* Categorias */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          className={`rounded-full border px-4 py-1.5 font-body text-sm transition-colors ${
            category === undefined
              ? "border-accent/50 bg-accent/10 text-accent"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setCategory(undefined)}
          type="button"
        >
          Todas
        </button>
        {CATEGORIES.map((c) => (
          <button
            className={`rounded-full border px-4 py-1.5 font-body text-sm transition-colors ${
              category === c
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
            key={c}
            onClick={() => setCategory(c)}
            type="button"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Resultados */}
      <div className="mt-12">
        {articles === undefined && (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        )}
        {articles?.length === 0 && (
          <div className="rounded-2xl border border-border border-dashed bg-card/40 py-16 text-center">
            <BookMarked className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 font-body text-[15px] text-muted-foreground">
              Ainda não há artigos aqui. Seja o primeiro a escrever.
            </p>
            <Button asChild className="mt-5" variant="outline">
              <Link to="/arca/lusopedia/novo">Criar artigo</Link>
            </Button>
          </div>
        )}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles?.map((a) => (
            <Link
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-accent/30"
              key={a._id}
              to={`/arca/lusopedia/${a.slug}`}
            >
              {a.coverUrl && (
                <img
                  alt={a.title}
                  className="h-36 w-full object-cover"
                  src={a.coverUrl}
                />
              )}
              <div className="flex flex-1 flex-col p-5">
                <span className="font-body text-[11px] text-accent uppercase tracking-[0.2em]">
                  {a.category}
                </span>
                <h3 className="mt-1.5 font-display text-[19px] text-primary">
                  {a.title}
                </h3>
                {a.summary && (
                  <p className="mt-2 line-clamp-3 font-body text-[14px] text-muted-foreground leading-relaxed">
                    {a.summary}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
