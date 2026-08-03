import { useMutation, useQuery } from "convex/react";
import {
  Check,
  Compass,
  ExternalLink,
  MapPin,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { SeloEstado } from "@/components/azulejos/SeloEstado";
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
  COBALTO,
  type Estado,
  ROTULO_ESTADO,
} from "@/lib/azulejos/mapa-estilo";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

type Rascunho = {
  morada: string;
  concelho: string;
  estado: Estado;
  padrao: string;
  epoca: string;
  oficina: string;
  autor: string;
  lat: string;
  lng: string;
};

function paraRascunho(a: {
  morada: string | null;
  concelho: string | null;
  estado: string;
  padrao: string | null;
  epoca: string | null;
  oficina: string | null;
  autor: string | null;
  lat: number;
  lng: number;
}): Rascunho {
  return {
    morada: a.morada ?? "",
    concelho: a.concelho ?? "",
    estado: a.estado as Estado,
    padrao: a.padrao ?? "",
    epoca: a.epoca ?? "",
    oficina: a.oficina ?? "",
    autor: a.autor ?? "",
    lat: String(a.lat),
    lng: String(a.lng),
  };
}

type Status = "pending" | "approved" | "rejected";

const TABS: { value: Status; label: string }[] = [
  { value: "pending", label: "Por rever" },
  { value: "approved", label: "No mapa" },
  { value: "rejected", label: "Recusados" },
];

/** O que se diz quando não há nada — por estado, porque não é tudo o mesmo. */
const VAZIO: Record<Status, string> = {
  pending: "Nada por rever. O inventário está em dia.",
  approved: "Ainda não há painéis no mapa.",
  rejected: "Nenhum painel foi recusado.",
};

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Um campo do dossier: rótulo pequeno por cima, valor legível por baixo. */
function Campo({
  rotulo,
  children,
}: {
  rotulo: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
        {rotulo}
      </dt>
      <dd className="mt-1 font-body text-[14px] text-foreground/85 leading-snug">
        {children}
      </dd>
    </div>
  );
}

/** Ligação de verificação — abre fora, para confirmar o sítio a sério. */
function LigacaoExterna({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: typeof MapPin;
  children: React.ReactNode;
}) {
  return (
    <a
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-body text-[12px] transition-colors hover:bg-[#1E4C8A]/8 dark:hover:bg-[#A9C0D8]/10"
      href={href}
      rel="noreferrer"
      style={{ borderColor: `${COBALTO.forte}33` }}
      target="_blank"
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
      <ExternalLink className="h-3 w-3 opacity-50" />
    </a>
  );
}

export default function AdminAzulejosPage() {
  const [tab, setTab] = useState<Status>("pending");
  // Eliminar apaga também a fotografia do armazenamento — não tem volta,
  // por isso pede confirmação no próprio cartão antes de avançar.
  const [aEliminar, setAEliminar] = useState<Id<"azulejos"> | null>(null);
  // Só um cartão de cada vez em edição — evita rascunhos perdidos ao saltar
  // de painel para painel sem guardar.
  const [aEditar, setAEditar] = useState<Id<"azulejos"> | null>(null);
  const [rascunho, setRascunho] = useState<Rascunho | null>(null);
  const items = useQuery(api.azulejos.adminList, { status: tab });
  const contagens = useQuery(api.azulejos.adminCounts);
  const setStatus = useMutation(api.azulejos.adminSetStatus);
  const update = useMutation(api.azulejos.adminUpdate);
  const remove = useMutation(api.azulejos.adminDelete);

  function iniciarEdicao(
    id: Id<"azulejos">,
    a: Parameters<typeof paraRascunho>[0]
  ) {
    setAEditar(id);
    setRascunho(paraRascunho(a));
  }

  async function guardarEdicao(id: Id<"azulejos">) {
    if (!rascunho) {
      return;
    }
    const lat = Number.parseFloat(rascunho.lat);
    const lng = Number.parseFloat(rascunho.lng);
    if (!(Number.isFinite(lat) && Number.isFinite(lng))) {
      return;
    }
    await update({
      id,
      lat,
      lng,
      morada: rascunho.morada,
      concelho: rascunho.concelho,
      estado: rascunho.estado,
      padrao: rascunho.padrao,
      epoca: rascunho.epoca,
      oficina: rascunho.oficina,
      autor: rascunho.autor,
    });
    setAEditar(null);
    setRascunho(null);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <p className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.28em]">
          Inventário
        </p>
        <h1 className="mt-2 font-display text-[34px] text-primary leading-tight">
          Painéis de azulejo
        </h1>
        <p className="mt-2 max-w-xl font-body text-[15px] text-muted-foreground leading-relaxed">
          Cada painel submetido espera aqui pela sua vez. Só entra no mapa
          depois de aprovado.
        </p>
      </header>

      <div
        className="mb-8 flex flex-wrap gap-2 border-b pb-4"
        style={{ borderColor: `${COBALTO.forte}1f` }}
      >
        {TABS.map((t) => {
          const activo = tab === t.value;
          const n = contagens?.[t.value];
          return (
            <button
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-body text-sm transition-colors"
              key={t.value}
              onClick={() => {
                setTab(t.value);
                setAEliminar(null);
              }}
              style={
                activo
                  ? {
                      backgroundColor: COBALTO.forte,
                      borderColor: COBALTO.forte,
                      color: "#FFFFFF",
                    }
                  : { borderColor: `${COBALTO.forte}33` }
              }
              type="button"
            >
              {t.label}
              {typeof n === "number" && n > 0 && (
                <span
                  className="font-body text-[11px] tabular-nums"
                  style={{ opacity: activo ? 0.75 : 0.55 }}
                >
                  {n}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {items === undefined && (
        <div className="space-y-5">
          {[0, 1].map((i) => (
            <div
              className="h-64 animate-pulse rounded-2xl border border-border bg-secondary/40"
              key={i}
            />
          ))}
        </div>
      )}

      {items?.length === 0 && (
        <div
          className="rounded-2xl border border-dashed px-8 py-14 text-center"
          style={{ borderColor: `${COBALTO.forte}33` }}
        >
          <p className="font-body text-[15px] text-muted-foreground">
            {VAZIO[tab]}
          </p>
        </div>
      )}

      <ul className="space-y-5">
        {items?.map((a) => {
          const coords = `${a.lat.toFixed(5)}, ${a.lng.toFixed(5)}`;
          const temBloco2 = Boolean(
            a.padrao || a.epoca || a.oficina || a.autor
          );
          const emEdicao = aEditar === a._id;

          return (
            <li
              className="overflow-hidden rounded-2xl border border-border bg-card"
              key={a._id}
            >
              <div className="grid md:grid-cols-[280px_1fr] md:items-stretch">
                {/* A fotografia é a prova. Clicar abre-a em tamanho real. */}
                <div
                  className="relative min-h-[240px]"
                  style={{ backgroundColor: `${COBALTO.lavado}66` }}
                >
                  {a.imageUrl ? (
                    <a
                      className="group absolute inset-0 block"
                      href={a.imageUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <img
                        alt={a.morada ?? "Painel de azulejo"}
                        className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                        loading="lazy"
                        src={a.imageUrl}
                      />
                    </a>
                  ) : (
                    <div className="absolute inset-0 grid place-items-center font-body text-[13px] text-muted-foreground">
                      Sem fotografia
                    </div>
                  )}
                  <div className="pointer-events-none absolute bottom-3 left-3">
                    <SeloEstado estado={a.estado as Estado} tamanho="pequeno" />
                  </div>
                </div>

                <div className="p-6">
                  {emEdicao && rascunho ? (
                    <>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label
                          className="sm:col-span-2"
                          htmlFor={`${a._id}-morada`}
                        >
                          <span className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                            Morada
                          </span>
                          <Input
                            className="mt-1"
                            id={`${a._id}-morada`}
                            onChange={(e) =>
                              setRascunho({
                                ...rascunho,
                                morada: e.target.value,
                              })
                            }
                            value={rascunho.morada}
                          />
                        </label>
                        <label htmlFor={`${a._id}-concelho`}>
                          <span className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                            Concelho
                          </span>
                          <Input
                            className="mt-1"
                            id={`${a._id}-concelho`}
                            onChange={(e) =>
                              setRascunho({
                                ...rascunho,
                                concelho: e.target.value,
                              })
                            }
                            value={rascunho.concelho}
                          />
                        </label>
                        <label htmlFor={`${a._id}-estado`}>
                          <span className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                            Estado
                          </span>
                          <Select
                            onValueChange={(v) =>
                              setRascunho({
                                ...rascunho,
                                estado: v as Estado,
                              })
                            }
                            value={rascunho.estado}
                          >
                            <SelectTrigger
                              className="mt-1"
                              id={`${a._id}-estado`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(ROTULO_ESTADO).map(
                                ([valor, rotulo]) => (
                                  <SelectItem key={valor} value={valor}>
                                    {rotulo}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </label>
                        <label htmlFor={`${a._id}-lat`}>
                          <span className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                            Latitude
                          </span>
                          <Input
                            className="mt-1 tabular-nums"
                            id={`${a._id}-lat`}
                            onChange={(e) =>
                              setRascunho({ ...rascunho, lat: e.target.value })
                            }
                            value={rascunho.lat}
                          />
                        </label>
                        <label htmlFor={`${a._id}-lng`}>
                          <span className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                            Longitude
                          </span>
                          <Input
                            className="mt-1 tabular-nums"
                            id={`${a._id}-lng`}
                            onChange={(e) =>
                              setRascunho({ ...rascunho, lng: e.target.value })
                            }
                            value={rascunho.lng}
                          />
                        </label>
                      </div>

                      <div
                        className="mt-5 grid grid-cols-1 gap-4 border-t pt-5 sm:grid-cols-2"
                        style={{ borderColor: `${COBALTO.forte}1f` }}
                      >
                        <label htmlFor={`${a._id}-padrao`}>
                          <span className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                            Padrão
                          </span>
                          <Input
                            className="mt-1"
                            id={`${a._id}-padrao`}
                            onChange={(e) =>
                              setRascunho({
                                ...rascunho,
                                padrao: e.target.value,
                              })
                            }
                            value={rascunho.padrao}
                          />
                        </label>
                        <label htmlFor={`${a._id}-epoca`}>
                          <span className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                            Época
                          </span>
                          <Input
                            className="mt-1"
                            id={`${a._id}-epoca`}
                            onChange={(e) =>
                              setRascunho({
                                ...rascunho,
                                epoca: e.target.value,
                              })
                            }
                            value={rascunho.epoca}
                          />
                        </label>
                        <label htmlFor={`${a._id}-oficina`}>
                          <span className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                            Oficina
                          </span>
                          <Input
                            className="mt-1"
                            id={`${a._id}-oficina`}
                            onChange={(e) =>
                              setRascunho({
                                ...rascunho,
                                oficina: e.target.value,
                              })
                            }
                            value={rascunho.oficina}
                          />
                        </label>
                        <label htmlFor={`${a._id}-autor`}>
                          <span className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                            Autor
                          </span>
                          <Input
                            className="mt-1"
                            id={`${a._id}-autor`}
                            onChange={(e) =>
                              setRascunho({
                                ...rascunho,
                                autor: e.target.value,
                              })
                            }
                            value={rascunho.autor}
                          />
                        </label>
                      </div>

                      <div
                        className="mt-6 flex flex-wrap items-center gap-2 border-t pt-5"
                        style={{ borderColor: `${COBALTO.forte}1f` }}
                      >
                        <Button
                          onClick={() => guardarEdicao(a._id)}
                          size="sm"
                          variant="accent"
                        >
                          <Check className="mr-1.5 h-3.5 w-3.5" /> Guardar
                        </Button>
                        <button
                          className="font-body text-[13px] text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setAEditar(null);
                            setRascunho(null);
                          }}
                          type="button"
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="font-display text-[22px] text-primary leading-snug">
                        {a.morada ?? a.concelho ?? "Sem morada indicada"}
                      </h2>

                      <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                        <Campo rotulo="Concelho">
                          {a.concelho ?? (
                            <span className="text-muted-foreground italic">
                              por indicar
                            </span>
                          )}
                        </Campo>
                        <Campo rotulo="Coordenadas">
                          <span className="tabular-nums">{coords}</span>
                          {typeof a.gpsAccuracy === "number" && (
                            <span className="text-muted-foreground">
                              {" "}
                              · ±{Math.round(a.gpsAccuracy)} m
                            </span>
                          )}
                        </Campo>
                        <Campo rotulo="Submetido por">
                          {a.authorName ?? "Anónimo"}
                        </Campo>
                        <Campo rotulo="Data">{formatDate(a.createdAt)}</Campo>
                      </dl>

                      {temBloco2 && (
                        <dl
                          className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 border-t pt-5 sm:grid-cols-2"
                          style={{ borderColor: `${COBALTO.forte}1f` }}
                        >
                          {a.padrao && (
                            <Campo rotulo="Padrão">{a.padrao}</Campo>
                          )}
                          {a.epoca && <Campo rotulo="Época">{a.epoca}</Campo>}
                          {a.oficina && (
                            <Campo rotulo="Oficina">{a.oficina}</Campo>
                          )}
                          {a.autor && <Campo rotulo="Autor">{a.autor}</Campo>}
                          {!a.historiaConfirmada && (
                            <p className="col-span-full font-body text-[12px] text-muted-foreground italic">
                              História por confirmar.
                            </p>
                          )}
                        </dl>
                      )}

                      {/* Verificar o sítio: um painel de rua confirma-se a
                          olhar para a fachada, não para um par de números. */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        <LigacaoExterna
                          href={`https://www.google.com/maps/search/?api=1&query=${a.lat},${a.lng}`}
                          icon={MapPin}
                        >
                          Ver no mapa
                        </LigacaoExterna>
                        <LigacaoExterna
                          href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${a.lat},${a.lng}`}
                          icon={Compass}
                        >
                          Street View
                        </LigacaoExterna>
                      </div>

                      <div
                        className="mt-6 flex flex-wrap items-center gap-2 border-t pt-5"
                        style={{ borderColor: `${COBALTO.forte}1f` }}
                      >
                        {a.status !== "approved" && (
                          <Button
                            onClick={() =>
                              setStatus({ id: a._id, status: "approved" })
                            }
                            size="sm"
                            variant="accent"
                          >
                            <Check className="mr-1.5 h-3.5 w-3.5" /> Aprovar
                          </Button>
                        )}
                        {a.status !== "rejected" && (
                          <Button
                            onClick={() =>
                              setStatus({ id: a._id, status: "rejected" })
                            }
                            size="sm"
                            variant="outline"
                          >
                            <X className="mr-1.5 h-3.5 w-3.5" /> Recusar
                          </Button>
                        )}
                        <Button
                          onClick={() => iniciarEdicao(a._id, a)}
                          size="sm"
                          variant="outline"
                        >
                          <Pencil className="mr-1.5 h-3.5 w-3.5" /> Editar
                        </Button>

                        {aEliminar === a._id ? (
                          <span className="ml-auto inline-flex items-center gap-2">
                            <span className="font-body text-[12px] text-muted-foreground">
                              Apaga também a fotografia.
                            </span>
                            <Button
                              onClick={() => {
                                remove({ id: a._id });
                                setAEliminar(null);
                              }}
                              size="sm"
                              variant="destructive"
                            >
                              Eliminar mesmo
                            </Button>
                            <button
                              className="font-body text-[12px] text-muted-foreground underline-offset-4 hover:underline"
                              onClick={() => setAEliminar(null)}
                              type="button"
                            >
                              Cancelar
                            </button>
                          </span>
                        ) : (
                          <button
                            className="ml-auto inline-flex items-center gap-1.5 font-body text-[13px] text-destructive transition-opacity hover:opacity-80"
                            onClick={() => setAEliminar(a._id)}
                            type="button"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Eliminar
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
