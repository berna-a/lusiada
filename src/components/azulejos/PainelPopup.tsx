import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import {
  ArrowUpRight,
  Heart,
  ImagePlus,
  Loader2,
  MapPin,
  Send,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  COBALTO,
  COR_ESTADO,
  type Estado,
  ROTULO_ESTADO,
} from "@/lib/azulejos/mapa-estilo";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

type Ordem = "popular" | "recente";

function dataCurta(ms: number) {
  return new Date(ms).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Retrato({
  url,
  nome,
  tamanho = 32,
}: {
  url: string | null;
  nome: string;
  tamanho?: number;
}) {
  return (
    <span
      className="grid shrink-0 place-items-center overflow-hidden rounded-full bg-slate-200"
      style={{ width: tamanho, height: tamanho }}
    >
      {url ? (
        <img alt="" className="h-full w-full object-cover" src={url} />
      ) : (
        <span className="font-body text-[12px] text-slate-500">
          {nome.slice(0, 1).toUpperCase()}
        </span>
      )}
    </span>
  );
}

function Compor({ azulejoId }: { azulejoId: Id<"azulejos"> }) {
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const publicar = useMutation(api.azulejoPosts.publicar);
  const gerarUrl = useMutation(api.azulejoPosts.generateUploadUrl);
  const [texto, setTexto] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [aEnviar, setAEnviar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-slate-200 border-dashed bg-white p-4 text-center">
        <p className="font-body text-[14px] text-slate-600">
          Entre para juntar a sua fotografia ou memória.
        </p>
        <button
          className="mt-3 rounded-xl px-5 py-2.5 font-body text-[14px] text-white"
          onClick={() => signIn("google", { redirectTo: "/azulejos" })}
          style={{ backgroundColor: COBALTO.forte }}
          type="button"
        >
          Entrar
        </button>
      </div>
    );
  }

  const enviar = async () => {
    setErro(null);
    if (!(texto.trim() || foto)) {
      setErro("Escreva alguma coisa ou junte uma fotografia.");
      return;
    }
    setAEnviar(true);
    try {
      let imageId: Id<"_storage"> | undefined;
      if (foto) {
        const url = await gerarUrl();
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": foto.type },
          body: foto,
        });
        if (!res.ok) {
          throw new Error("Falha no envio da fotografia.");
        }
        imageId = (await res.json()).storageId;
      }
      await publicar({ azulejoId, body: texto.trim() || undefined, imageId });
      setTexto("");
      setFoto(null);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível publicar.");
    } finally {
      setAEnviar(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <textarea
        className="w-full resize-none rounded-xl bg-slate-50 px-3.5 py-2.5 font-body text-[15px] text-slate-800 outline-none placeholder:text-slate-400"
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Uma fotografia sua, ou o que sabe deste painel…"
        rows={2}
        value={texto}
      />
      <div className="mt-2 flex items-center gap-2">
        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-body text-[13px] text-slate-500 transition-colors hover:bg-slate-100">
          <input
            accept="image/*"
            className="hidden"
            onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
            type="file"
          />
          <ImagePlus size={16} strokeWidth={1.75} />
          {foto ? "1 fotografia" : "Fotografia"}
        </label>
        {foto && (
          <button
            className="font-body text-[13px] text-slate-400 hover:text-slate-700"
            onClick={() => setFoto(null)}
            type="button"
          >
            remover
          </button>
        )}
        <button
          className="ml-auto flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-body text-[14px] text-white transition-opacity disabled:opacity-40"
          disabled={aEnviar}
          onClick={enviar}
          style={{ backgroundColor: COBALTO.forte }}
          type="button"
        >
          {aEnviar ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send size={15} strokeWidth={1.75} />
          )}
          Publicar
        </button>
      </div>
      {erro && (
        <p className="mt-2 font-body text-[13px] text-red-700">{erro}</p>
      )}
    </div>
  );
}

/**
 * O painel aberto, em continuação do toque no mapa.
 *
 * No telemóvel sobe de baixo, como em qualquer mapa; no computador encosta à
 * esquerda, deixando o mapa à vista à direita. A fotografia principal vem
 * primeiro; o feed de quem lá passou vem por baixo, a rolar.
 */
export function PainelPopup({
  azulejoId,
  onFechar,
}: {
  azulejoId: Id<"azulejos">;
  onFechar: () => void;
}) {
  const painel = useQuery(api.azulejos.get, { id: azulejoId });
  const [ordem, setOrdem] = useState<Ordem>("popular");
  const feed = useQuery(api.azulejoPosts.listar, { azulejoId, ordem });
  const votar = useMutation(api.azulejoPosts.alternarVoto);

  const estado = (painel?.estado ?? "integro") as Estado;

  return (
    <aside
      aria-label="Painel de azulejo"
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 flex max-h-[85%] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-8px_44px_-8px_rgba(18,58,107,0.4)] md:inset-y-4 md:right-auto md:left-4 md:max-h-none md:w-[420px] md:rounded-3xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button
        aria-label="Fechar"
        className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md transition-transform active:scale-95"
        onClick={onFechar}
        type="button"
      >
        <X size={18} strokeWidth={2} />
      </button>

      {painel === undefined && (
        <div className="grid h-64 place-items-center">
          <Loader2
            className="h-6 w-6 animate-spin"
            style={{ color: COBALTO.forte }}
          />
        </div>
      )}

      {painel === null && (
        <div className="p-8 text-center">
          <p className="font-body text-[15px] text-slate-600">
            Este painel já não está disponível.
          </p>
        </div>
      )}

      {painel && (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {painel.imageUrl && (
            <img
              alt={painel.morada ?? "Painel de azulejo"}
              className="h-56 w-full shrink-0 object-cover md:h-64"
              src={painel.imageUrl}
            />
          )}

          <div className="px-5 pt-4 pb-5">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-[11px] text-white uppercase tracking-[0.1em]"
              style={{ backgroundColor: COR_ESTADO[estado] }}
            >
              {ROTULO_ESTADO[estado]}
            </span>
            <h2
              className="mt-3 font-display text-[22px] leading-tight"
              style={{ color: COBALTO.tinta }}
            >
              {painel.morada ?? painel.concelho ?? "Painel de azulejo"}
            </h2>
            {painel.concelho && (
              <p className="mt-1.5 flex items-center gap-1.5 font-body text-[14px] text-slate-500">
                <MapPin size={14} strokeWidth={1.75} />
                {painel.concelho}
              </p>
            )}
            <p className="mt-3 font-body text-[13px] text-slate-500 leading-relaxed">
              Registado a {dataCurta(painel.createdAt)}
              {painel.authorName ? ` por ${painel.authorName}` : ""}.
            </p>

            <Link
              className="mt-3 inline-flex items-center gap-1.5 font-body text-[13px] underline underline-offset-4"
              style={{ color: COBALTO.forte }}
              to={`/azulejos/${painel._id}`}
            >
              Ver a ficha completa
              <ArrowUpRight size={14} strokeWidth={1.75} />
            </Link>

            {/* Feed */}
            <div className="mt-7 flex items-center justify-between">
              <h3
                className="font-display text-[12px] uppercase tracking-[0.18em]"
                style={{ color: COBALTO.medio }}
              >
                Contributos
              </h3>
              <div className="flex gap-1 rounded-full bg-slate-100 p-0.5">
                {(
                  [
                    ["popular", "Populares"],
                    ["recente", "Recentes"],
                  ] as [Ordem, string][]
                ).map(([v, r]) => (
                  <button
                    className={`rounded-full px-3 py-1 font-body text-[12px] transition-colors ${
                      ordem === v
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500"
                    }`}
                    key={v}
                    onClick={() => setOrdem(v)}
                    type="button"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <Compor azulejoId={azulejoId} />
            </div>

            {feed === undefined && (
              <div className="mt-4 space-y-3">
                {[0, 1].map((i) => (
                  <div
                    className="h-20 animate-pulse rounded-2xl bg-slate-100"
                    key={i}
                  />
                ))}
              </div>
            )}

            {feed?.length === 0 && (
              <p className="mt-5 font-body text-[14px] text-slate-500 leading-relaxed">
                Ainda ninguém acrescentou nada. Se passar por aqui, tire uma
                fotografia — de outro ângulo, ou de outro dia.
              </p>
            )}

            <ul className="mt-4 space-y-4">
              {(feed ?? []).map((p) => (
                <li
                  className="rounded-2xl border border-slate-200 bg-white p-3.5"
                  key={p._id}
                >
                  <div className="flex items-center gap-2.5">
                    <Retrato nome={p.autor.nome} url={p.autor.avatarUrl} />
                    <div className="min-w-0 flex-1">
                      {p.autor.handle ? (
                        <Link
                          className="block truncate font-body text-[14px] text-slate-900 hover:underline"
                          to={`/${p.autor.handle}`}
                        >
                          {p.autor.nome}
                        </Link>
                      ) : (
                        <span className="block truncate font-body text-[14px] text-slate-900">
                          {p.autor.nome}
                        </span>
                      )}
                      <span className="font-body text-[12px] text-slate-400">
                        {dataCurta(p.criadoEm)}
                      </span>
                    </div>
                    <button
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-body text-[13px] transition-colors ${
                        p.jaVotei
                          ? "bg-red-50 text-red-600"
                          : "text-slate-400 hover:bg-slate-100"
                      }`}
                      onClick={() => votar({ postId: p._id })}
                      type="button"
                    >
                      <Heart
                        fill={p.jaVotei ? "currentColor" : "none"}
                        size={15}
                        strokeWidth={1.75}
                      />
                      {p.upvotes > 0 ? p.upvotes : ""}
                    </button>
                  </div>
                  {p.imageUrl && (
                    <img
                      alt=""
                      className="mt-3 max-h-72 w-full rounded-xl object-cover"
                      src={p.imageUrl}
                    />
                  )}
                  {p.body && (
                    <p className="mt-2.5 font-body text-[15px] text-slate-700 leading-relaxed">
                      {p.body}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </aside>
  );
}
