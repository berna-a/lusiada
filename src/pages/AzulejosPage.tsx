import { useQuery } from "convex/react";
import { ArrowLeft, Camera, Crosshair, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FolhaInferior } from "@/components/azulejos/FolhaInferior";
import {
  MapaAzulejos,
  type MapaHandle,
  type PainelNoMapa,
} from "@/components/azulejos/MapaAzulejos";
import { PainelPopup } from "@/components/azulejos/PainelPopup";
import { Seo } from "@/components/Seo";
import {
  COBALTO,
  COR_ESTADO,
  type Estado,
  ROTULO_ESTADO,
} from "@/lib/azulejos/mapa-estilo";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const ESTADOS: Estado[] = ["integro", "danificado", "em_risco", "desaparecido"];

function Pastilha({
  estado,
  activo,
  onClick,
  n,
}: {
  estado: Estado;
  activo: boolean;
  onClick: () => void;
  n: number;
}) {
  return (
    <button
      aria-pressed={activo}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 font-body text-[13px] transition-all ${
        activo
          ? "border-transparent text-white shadow-sm"
          : "border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300"
      }`}
      onClick={onClick}
      style={activo ? { backgroundColor: COR_ESTADO[estado] } : undefined}
      type="button"
    >
      <span
        aria-hidden="true"
        className="block h-2.5 w-2.5 rounded-full"
        style={{
          backgroundColor: activo ? "#FFFFFF" : COR_ESTADO[estado],
        }}
      />
      {ROTULO_ESTADO[estado]}
      <span className={activo ? "text-white/70" : "text-slate-400"}>{n}</span>
    </button>
  );
}

export default function AzulejosPage() {
  const mapa = useRef<MapaHandle | null>(null);
  const [filtro, setFiltro] = useState<Estado | null>(null);
  const [aLocalizar, setALocalizar] = useState(false);
  const [aberto, setAberto] = useState<Id<"azulejos"> | null>(null);

  const paineis = useQuery(api.azulejos.listApproved);
  const stats = useQuery(api.azulejos.stats);
  const aCarregar = paineis === undefined;
  const lista: PainelNoMapa[] = (paineis ?? []) as PainelNoMapa[];

  const porEstado = (e: Estado) => lista.filter((p) => p.estado === e).length;

  const localizar = () => {
    if (!navigator.geolocation) {
      return;
    }
    setALocalizar(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapa.current?.irPara(pos.coords.longitude, pos.coords.latitude, 16);
        setALocalizar(false);
      },
      () => setALocalizar(false),
      { enableHighAccuracy: true, timeout: 12_000 }
    );
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      <Seo
        description="O mapa aberto do azulejo de fachada em Portugal. Fotografe o painel da sua rua: o registo fica datado e localizado — património e prova ao mesmo tempo."
        jsonLd={{
          "@type": "Dataset",
          name: "Inventário aberto do azulejo de fachada em Portugal",
          description:
            "Registo colaborativo, datado e geolocalizado, de painéis azulejares em fachadas portuguesas, incluindo painéis comuns sem autoria conhecida.",
          inLanguage: "pt",
          spatialCoverage: "Portugal",
        }}
        path="/mapa"
        title="Azulejos — o mapa do que ainda está nas paredes | Memória Lusíada"
      />

      <MapaAzulejos
        className="absolute inset-0"
        filtro={filtro}
        onSelecionar={(id) => {
          setAberto(id as Id<"azulejos">);
          // Aproxima o painel tocado, para o pop-up abrir em cima dele.
          const p = lista.find((x) => x._id === id);
          if (p) {
            mapa.current?.irPara(p.lng, p.lat, 17);
          }
        }}
        paineis={lista}
        ref={mapa}
      />

      {aberto && (
        <PainelPopup azulejoId={aberto} onFechar={() => setAberto(null)} />
      )}

      {/* Barra superior em vidro, dentro da safe area do iPhone. */}
      <header
        className="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pt-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <div className="pointer-events-auto mx-auto flex max-w-[560px] items-center gap-3 rounded-2xl border border-white/60 bg-white/80 px-3 py-2.5 shadow-[0_4px_24px_-6px_rgba(18,58,107,0.25)] backdrop-blur-xl backdrop-saturate-150">
          <Link
            aria-label="Voltar aos azulejos"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            to="/azulejos"
          >
            <ArrowLeft size={18} strokeWidth={1.75} />
          </Link>
          <div className="min-w-0 flex-1">
            <p
              className="font-display text-[15px] leading-none tracking-[0.12em]"
              style={{ color: COBALTO.tinta }}
            >
              AZULEJOS
            </p>
            <p className="mt-1 truncate font-body text-[12px] text-slate-500 leading-none">
              {aCarregar
                ? "a carregar…"
                : `${stats?.total ?? 0} painéis · ${stats?.concelhos ?? 0} concelhos`}
            </p>
          </div>
          <Link
            aria-label="Registar um painel"
            className="flex h-9 items-center gap-1.5 rounded-xl px-3 font-body text-[13px] text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: COBALTO.forte }}
            to="/azulejos/registar"
          >
            <Camera size={15} strokeWidth={1.75} />
            <span className="hidden sm:inline">Registar</span>
          </Link>
        </div>
      </header>

      {/* Localizar-me — flutuante, acima da folha. */}
      <button
        aria-label="Centrar na minha localização"
        className="absolute right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/85 shadow-[0_4px_20px_-4px_rgba(18,58,107,0.3)] backdrop-blur-xl transition-transform active:scale-95"
        onClick={localizar}
        style={{ bottom: "calc(208px + env(safe-area-inset-bottom) + 1rem)" }}
        type="button"
      >
        {aLocalizar ? (
          <Loader2
            className="h-[18px] w-[18px] animate-spin"
            style={{ color: COBALTO.forte }}
          />
        ) : (
          <Crosshair
            size={18}
            strokeWidth={1.75}
            style={{ color: COBALTO.forte }}
          />
        )}
      </button>

      <div className={aberto ? "hidden md:contents" : "contents"}>
        <FolhaInferior
          cabecalho={
            <>
              {/* Filtros — tocar num estado destaca-o no mapa. */}
              <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {ESTADOS.map((e) => (
                  <Pastilha
                    activo={filtro === e}
                    estado={e}
                    key={e}
                    n={porEstado(e)}
                    onClick={() => setFiltro((f) => (f === e ? null : e))}
                  />
                ))}
              </div>

              <Link
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 font-body text-[16px] text-white shadow-[0_6px_20px_-6px_rgba(30,76,138,0.7)] transition-transform active:scale-[0.98]"
                style={{ backgroundColor: COBALTO.forte }}
                to="/azulejos/registar"
              >
                <Camera size={19} strokeWidth={1.75} />
                Fotografar um painel
              </Link>
              <p className="mt-2.5 text-center font-body text-[12px] text-slate-400">
                Arraste para cima para saber mais
              </p>
            </>
          }
        >
          <div className="pt-2">
            {lista.length === 0 && !aCarregar && (
              <div
                className="rounded-2xl px-5 py-5"
                style={{ backgroundColor: COBALTO.lavado }}
              >
                <p
                  className="font-display text-[13px] uppercase tracking-[0.2em]"
                  style={{ color: COBALTO.forte }}
                >
                  O mapa está vazio
                </p>
                <p className="mt-3 font-body text-[15px] text-slate-700 leading-relaxed">
                  Ainda não há nada registado — e é assim que todos estes
                  projectos começam. O primeiro painel é o mais difícil de
                  arranjar e o mais importante de todos.
                </p>
              </div>
            )}

            <h2
              className="mt-6 font-display text-[13px] uppercase tracking-[0.2em]"
              style={{ color: COBALTO.medio }}
            >
              O que este mapa é
            </h2>
            <p className="mt-3 font-body text-[15px] text-slate-700 leading-[1.7]">
              Não é o mais completo — há bases académicas que sabem muito mais
              sobre o azulejo de autor. É o único onde entra o azulejo{" "}
              <strong className="text-slate-900">comum</strong>, sem autor
              conhecido, em prédio sem classificação, fotografado por quem passa
              na rua.
            </p>
            <p className="mt-3 font-body text-[15px] text-slate-700 leading-[1.7]">
              Lisboa proíbe desde 2013 a remoção de azulejo de fachada, e os
              furtos continuam. Quando um painel desaparece, quase nunca há
              fotografia datada que prove o que ali estava.{" "}
              <strong className="text-slate-900">
                Um registo com data e sítio é património e é prova.
              </strong>
            </p>

            <h2
              className="mt-7 font-display text-[13px] uppercase tracking-[0.2em]"
              style={{ color: COBALTO.medio }}
            >
              Como se regista
            </h2>
            <ol className="mt-3 space-y-3">
              {[
                ["Fotografa-se", "O conjunto, não o pormenor. Tirada da rua."],
                [
                  "O sítio vem do telemóvel",
                  "Não se escreve à mão — é isso que dá valor de prova.",
                ],
                [
                  "Marca-se o estado",
                  "Íntegro, danificado, em risco, ou já desaparecido.",
                ],
              ].map(([t, d], i) => (
                <li className="flex gap-3" key={t}>
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-body text-[12px] text-white"
                    style={{ backgroundColor: COBALTO.medio }}
                  >
                    {i + 1}
                  </span>
                  <span className="font-body text-[15px] text-slate-700 leading-snug">
                    <strong className="text-slate-900">{t}.</strong> {d}
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-7 font-body text-[13px] text-slate-400 leading-relaxed">
              Ver o mapa não exige nada. Para registar é preciso ter conta — é
              grátis. Um projecto da{" "}
              <Link className="underline underline-offset-2" to="/">
                Associação Memória Lusíada
              </Link>
              .
            </p>
          </div>
        </FolhaInferior>
      </div>
    </div>
  );
}
