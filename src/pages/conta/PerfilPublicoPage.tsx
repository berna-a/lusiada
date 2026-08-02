import { useQuery } from "convex/react";
import { Loader2, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import {
  COR_ESTADO,
  type Estado,
  ROTULO_ESTADO,
} from "@/lib/azulejos/mapa-estilo";
import NotFound from "@/pages/NotFound";
import { api } from "../../../convex/_generated/api";

function dataPt(ms: number) {
  return new Date(ms).toLocaleDateString("pt-PT", {
    month: "long",
    year: "numeric",
  });
}

/** O perfil de outra pessoa: quem é, e o que já deixou na casa. */
export default function PerfilPublicoPage() {
  const { handle } = useParams<{ handle: string }>();
  const perfil = useQuery(api.perfis.porHandle, handle ? { handle } : "skip");
  const contributos = useQuery(
    api.perfis.contributosPorHandle,
    handle ? { handle } : "skip"
  );

  if (perfil === undefined) {
    return (
      <main
        className="flex min-h-[60vh] items-center justify-center"
        data-nav-theme="light"
      >
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </main>
    );
  }
  if (perfil === null) {
    return <NotFound />;
  }

  const lista = contributos ?? [];

  return (
    <main
      className="mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description={`${perfil.nomePublico} na Associação Memória Lusíada${perfil.concelho ? `, ${perfil.concelho}` : ""}. ${lista.length} contributos.`}
        image={perfil.avatarUrl}
        path={`/u/${perfil.handle}`}
        title={`${perfil.nomePublico} — Memória Lusíada`}
        type="article"
      />

      {/* Capa e retrato sobrepostos — o cabeçalho de um perfil. */}
      <div className="-mx-6 sm:mx-0">
        <div className="relative h-36 overflow-hidden bg-secondary sm:h-52 sm:rounded-2xl">
          {perfil.capaUrl ? (
            <img
              alt=""
              className="h-full w-full object-cover"
              src={perfil.capaUrl}
            />
          ) : (
            <div className="calcada-pattern h-full w-full opacity-40" />
          )}
        </div>
      </div>

      <header className="-mt-14 flex flex-col items-center text-center">
        <span className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-secondary shadow-lg">
          {perfil.avatarUrl ? (
            <img
              alt={perfil.nomePublico}
              className="h-full w-full object-cover"
              src={perfil.avatarUrl}
            />
          ) : (
            <span className="font-display text-[30px] text-primary">
              {perfil.nomePublico.slice(0, 1).toUpperCase()}
            </span>
          )}
        </span>
        <h1 className="mt-5 font-display text-[30px] text-primary leading-tight sm:text-[38px]">
          {perfil.nomePublico}
        </h1>
        <p className="mt-1.5 font-body text-[14px] text-muted-foreground">
          {perfil.concelho ? `${perfil.concelho} · ` : ""}na casa desde{" "}
          {dataPt(perfil.desde)}
        </p>
        {perfil.ehSocio && (
          <span className="mt-4 rounded-full border border-accent/40 px-4 py-1.5 font-body text-[12px] text-primary uppercase tracking-[0.14em]">
            Sócio
          </span>
        )}
        {perfil.bio && (
          <p className="mx-auto mt-6 max-w-[460px] font-body text-[16px] text-foreground/80 leading-relaxed">
            {perfil.bio}
          </p>
        )}
      </header>

      <section className="mt-14">
        <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          Contributos
        </h2>
        {contributos === undefined && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <div
                className="h-44 animate-pulse rounded-2xl bg-secondary"
                key={i}
              />
            ))}
          </div>
        )}
        {contributos !== undefined && lista.length === 0 && (
          <p className="mt-5 font-body text-[16px] text-foreground/70 leading-relaxed">
            Ainda não há nada publicado.
          </p>
        )}
        {lista.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {lista.map((c) => {
              const estado = c.estado as Estado;
              return (
                <Link
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-accent/50"
                  key={c._id}
                  to={`/azulejos/${c._id}`}
                >
                  {c.imageUrl && (
                    <img
                      alt={c.morada ?? "Painel de azulejo"}
                      className="h-40 w-full object-cover"
                      src={c.imageUrl}
                    />
                  )}
                  <div className="p-4">
                    <span
                      className="inline-flex items-center gap-1.5 font-body text-[11px] uppercase tracking-[0.12em]"
                      style={{ color: COR_ESTADO[estado] }}
                    >
                      <span
                        aria-hidden="true"
                        className="block h-2 w-2 rounded-full"
                        style={{ backgroundColor: COR_ESTADO[estado] }}
                      />
                      {ROTULO_ESTADO[estado]}
                    </span>
                    <p className="mt-1.5 font-body text-[15px] text-foreground/85 leading-snug">
                      {c.morada ?? c.concelho ?? "Painel de azulejo"}
                    </p>
                    {c.concelho && c.morada && (
                      <p className="mt-1 flex items-center gap-1.5 font-body text-[13px] text-muted-foreground">
                        <MapPin size={13} strokeWidth={1.75} />
                        {c.concelho}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
