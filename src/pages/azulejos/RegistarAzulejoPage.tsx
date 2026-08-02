import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation } from "convex/react";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronDown,
  Crosshair,
  Loader2,
  MapPin,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { EscolherNoMapa } from "@/components/azulejos/EscolherNoMapa";
import { Seo } from "@/components/Seo";
import {
  COBALTO,
  COR_ESTADO,
  type Estado,
  ROTULO_ESTADO,
} from "@/lib/azulejos/mapa-estilo";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

const ESTADOS: { valor: Estado; nota: string }[] = [
  { valor: "integro", nota: "Está inteiro" },
  { valor: "danificado", nota: "Faltam peças" },
  { valor: "em_risco", nota: "Obra, ruína" },
  { valor: "desaparecido", nota: "Já não está" },
];

/** Acima disto o GPS não distingue um prédio do vizinho — avisa-se, não se trava. */
const PRECISAO_AVISO_M = 60;
/** Abaixo disto já não vale a pena continuar a afinar. */
const PRECISAO_BOA_M = 20;
/** Tempo total até desistir, independente do que o browser prometa. */
const ESPERA_MAXIMA_MS = 18_000;
/** Depois da primeira leitura, quanto tempo se deixa afinar. */
const ESPERA_AFINACAO_MS = 8000;
const TIMEOUT_MORADA_MS = 6000;

/** `accuracy` a null = marcado à mão no mapa, não medido pelo aparelho. */
type Local = { lat: number; lng: number; accuracy: number | null };

/** Lado maior da fotografia depois de reduzida. Chega para identificar um painel. */
const LADO_MAXIMO = 1800;
const QUALIDADE = 0.85;

/**
 * Reduz a fotografia antes de a enviar. Uma foto de iPhone traz 4-5 MB e quem
 * está na rua está em dados móveis — reduzida fica em algumas centenas de KB e
 * sobe quase de imediato.
 *
 * Se alguma coisa falhar, devolve o ficheiro original: mais vale uma foto
 * grande do que nenhuma.
 */
async function reduzir(ficheiro: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(ficheiro);
    const maior = Math.max(bitmap.width, bitmap.height);
    if (maior <= LADO_MAXIMO) {
      bitmap.close();
      return ficheiro;
    }
    const escala = LADO_MAXIMO / maior;
    const cv = document.createElement("canvas");
    cv.width = Math.round(bitmap.width * escala);
    cv.height = Math.round(bitmap.height * escala);
    const ctx = cv.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return ficheiro;
    }
    ctx.drawImage(bitmap, 0, 0, cv.width, cv.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) =>
      cv.toBlob(r, "image/jpeg", QUALIDADE)
    );
    return blob && blob.size > 0 ? blob : ficheiro;
  } catch {
    return ficheiro;
  }
}

async function enviarFotografia(
  gerarUrl: () => Promise<string>,
  ficheiro: File
): Promise<Id<"_storage">> {
  const corpo = await reduzir(ficheiro);
  const url = await gerarUrl();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": corpo.type || ficheiro.type },
    body: corpo,
  });
  if (!res.ok) {
    throw new Error("Falha no envio da fotografia.");
  }
  const { storageId } = await res.json();
  return storageId;
}

/** Comodidade, não requisito: se falhar, escreve-se à mão. */
async function procurarMorada(lat: number, lng: number) {
  const vazio = {
    morada: null as string | null,
    concelho: null as string | null,
  };
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MORADA_MS);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&accept-language=pt`,
      { signal: ctrl.signal }
    );
    clearTimeout(t);
    if (!res.ok) {
      return vazio;
    }
    const d = await res.json();
    const a = d?.address ?? {};
    const rua = a.road ?? a.pedestrian ?? a.footway ?? null;
    return {
      morada: rua
        ? `${rua}${a.house_number ? `, ${a.house_number}` : ""}`
        : null,
      concelho: a.municipality ?? a.city ?? a.town ?? a.village ?? null,
    };
  } catch {
    return vazio;
  }
}

function BarraTopo({ titulo }: { titulo: string }) {
  return (
    <header
      className="sticky top-0 z-30 border-slate-200/70 border-b bg-white/85 backdrop-blur-xl backdrop-saturate-150"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-[560px] items-center gap-3 px-4 py-3">
        <Link
          aria-label="Voltar ao mapa"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          to="/azulejos"
        >
          <ArrowLeft size={18} strokeWidth={1.75} />
        </Link>
        <p
          className="font-display text-[15px] tracking-[0.12em]"
          style={{ color: COBALTO.tinta }}
        >
          {titulo}
        </p>
      </div>
    </header>
  );
}

function PedirSessao() {
  const { signIn } = useAuthActions();
  return (
    <div className="px-5 py-10">
      <div
        className="rounded-3xl px-6 py-10 text-center"
        style={{ backgroundColor: COBALTO.lavado }}
      >
        <span
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: COBALTO.forte }}
        >
          <Camera className="h-6 w-6 text-white" strokeWidth={1.5} />
        </span>
        <p
          className="mt-5 font-display text-[20px]"
          style={{ color: COBALTO.tinta }}
        >
          Entre para registar
        </p>
        <p className="mx-auto mt-3 max-w-[300px] font-body text-[14px] text-slate-600 leading-relaxed">
          Ver o mapa não exige nada. Para registar um painel é preciso ter conta
          — é grátis e leva vinte segundos.
        </p>
        <button
          className="mt-6 w-full rounded-2xl py-4 font-body text-[15px] text-white transition-transform active:scale-[0.98]"
          onClick={() => signIn("google", { redirectTo: "/azulejos/registar" })}
          style={{ backgroundColor: COBALTO.forte }}
          type="button"
        >
          Entrar com Google
        </button>
      </div>
    </div>
  );
}

function Formulario() {
  const gerarUrl = useMutation(api.azulejos.generateUploadUrl);
  const submeter = useMutation(api.azulejos.submit);

  const [ficheiro, setFicheiro] = useState<File | null>(null);
  const [preVisual, setPreVisual] = useState<string | null>(null);
  const [local, setLocal] = useState<Local | null>(null);
  const [aLocalizar, setALocalizar] = useState(false);
  const [erroLocal, setErroLocal] = useState<string | null>(null);
  const [estado, setEstado] = useState<Estado | null>(null);
  const [morada, setMorada] = useState("");
  const [concelho, setConcelho] = useState("");
  const [verHistoria, setVerHistoria] = useState(false);
  const [padrao, setPadrao] = useState("");
  const [epoca, setEpoca] = useState("");
  const [oficina, setOficina] = useState("");
  const [aEnviar, setAEnviar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [feito, setFeito] = useState(false);
  const [aMarcarNoMapa, setAMarcarNoMapa] = useState(false);
  const inputFoto = useRef<HTMLInputElement | null>(null);

  useEffect(
    () => () => {
      if (preVisual) {
        URL.revokeObjectURL(preVisual);
      }
    },
    [preVisual]
  );

  /**
   * Obter o sítio, à prova do iPhone.
   *
   * O `getCurrentPosition` com alta precisão pendura-se no Chrome do iPhone:
   * fica à espera de um sinal fino que dentro de um prédio nunca chega, e o
   * `timeout` do próprio browser nem sempre é respeitado — daí ficar "a
   * localizar" para sempre. Por isso:
   *
   * - usa-se `watchPosition`, que entrega a primeira posição muito mais cedo
   *   e vai melhorando sozinho;
   * - aceita-se logo a primeira leitura, mesmo grosseira, e continua-se a
   *   afinar em fundo até ficar boa ou esgotar o tempo;
   * - há relógio nosso, que não depende do browser cumprir o dele.
   */
  const pararRelogio = useRef<(() => void) | null>(null);

  const localizar = useCallback(() => {
    pararRelogio.current?.();
    setErroLocal(null);
    if (!navigator.geolocation) {
      setErroLocal("Este aparelho não dá a localização.");
      return;
    }
    setALocalizar(true);

    let melhor: Local | null = null;
    let vigia: number | null = null;
    const temporizadores: number[] = [];

    const terminar = (mensagem?: string) => {
      if (vigia !== null) {
        navigator.geolocation.clearWatch(vigia);
        vigia = null;
      }
      for (const t of temporizadores) {
        clearTimeout(t);
      }
      pararRelogio.current = null;
      setALocalizar(false);
      if (mensagem) {
        setErroLocal(mensagem);
      }
    };
    pararRelogio.current = () => terminar();

    vigia = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        if (melhor && melhor.accuracy <= accuracy) {
          return;
        }
        melhor = { lat: latitude, lng: longitude, accuracy };
        setLocal(melhor);
        setALocalizar(false);
        // Já chega de bom: não vale a pena continuar a gastar bateria.
        if (accuracy <= PRECISAO_BOA_M) {
          terminar();
        }
      },
      (e) => {
        // Só desiste se ainda não houver nada; um erro depois de já termos
        // posição é ruído.
        if (melhor) {
          return;
        }
        terminar(
          e.code === e.PERMISSION_DENIED
            ? "A localização está bloqueada para este site. Autorize nas definições do navegador e tente outra vez."
            : "Não foi possível obter a localização. Ao ar livre costuma resultar — ou marque o sítio no mapa."
        );
      },
      { enableHighAccuracy: true, timeout: 20_000, maximumAge: 30_000 }
    );

    // Relógio nosso: se nada chegar, não ficamos presos para sempre.
    temporizadores.push(
      window.setTimeout(() => {
        if (melhor) {
          terminar();
        } else {
          terminar(
            "O telemóvel está a demorar a encontrar o sinal. Tente outra vez, ou marque o sítio no mapa."
          );
        }
      }, ESPERA_MAXIMA_MS)
    );
    // Deixa afinar mais uns segundos depois da primeira leitura, e pára.
    temporizadores.push(
      window.setTimeout(() => {
        if (melhor) {
          terminar();
        }
      }, ESPERA_AFINACAO_MS)
    );
  }, []);

  // Nunca deixar um `watchPosition` a correr depois de sair da página.
  useEffect(() => () => pararRelogio.current?.(), []);

  // Assim que há fotografia, pede-se o sítio: um toque a menos na rua.
  const escolherFicheiro = (f: File | null) => {
    if (preVisual) {
      URL.revokeObjectURL(preVisual);
    }
    setFicheiro(f);
    setPreVisual(f ? URL.createObjectURL(f) : null);
    if (f && !local) {
      localizar();
    }
  };

  const enviar = async () => {
    setErro(null);
    if (!ficheiro) {
      setErro("Falta a fotografia.");
      return;
    }
    if (!local) {
      setErro("Falta a localização.");
      return;
    }
    if (!estado) {
      setErro("Falta dizer em que estado está.");
      return;
    }
    setAEnviar(true);
    try {
      const imageId = await enviarFotografia(gerarUrl, ficheiro);
      await submeter({
        lat: local.lat,
        lng: local.lng,
        gpsAccuracy: local.accuracy ?? undefined,
        imageId,
        estado,
        morada: morada.trim() || undefined,
        concelho: concelho.trim() || undefined,
        padrao: padrao.trim() || undefined,
        epoca: epoca.trim() || undefined,
        oficina: oficina.trim() || undefined,
      });
      setFeito(true);
      window.scrollTo({ top: 0 });
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível registar.");
    } finally {
      setAEnviar(false);
    }
  };

  const recomecar = () => {
    escolherFicheiro(null);
    setLocal(null);
    setEstado(null);
    setMorada("");
    setConcelho("");
    setPadrao("");
    setEpoca("");
    setOficina("");
    setVerHistoria(false);
    setFeito(false);
  };

  if (feito) {
    return (
      <div className="px-5 py-10">
        <div
          className="rounded-3xl px-6 py-10 text-center"
          style={{ backgroundColor: COBALTO.lavado }}
        >
          <span
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: COBALTO.forte }}
          >
            <Check className="h-7 w-7 text-white" strokeWidth={2.5} />
          </span>
          <p
            className="mt-5 font-display text-[22px]"
            style={{ color: COBALTO.tinta }}
          >
            Ficou registado
          </p>
          <p className="mx-auto mt-3 max-w-[320px] font-body text-[14px] text-slate-600 leading-relaxed">
            A data e o sítio já ficaram guardados — é isso que faz do registo
            uma prova. Entra no mapa depois de uma revisão.
          </p>
          <button
            className="mt-6 w-full rounded-2xl py-4 font-body text-[15px] text-white transition-transform active:scale-[0.98]"
            onClick={recomecar}
            style={{ backgroundColor: COBALTO.forte }}
            type="button"
          >
            Registar outro
          </button>
          <Link
            className="mt-3 block w-full rounded-2xl border border-slate-200 bg-white py-4 font-body text-[15px] text-slate-700"
            to="/azulejos"
          >
            Ver o mapa
          </Link>
        </div>
      </div>
    );
  }

  const impreciso =
    local?.accuracy != null && local.accuracy > PRECISAO_AVISO_M;
  const completo = Boolean(ficheiro && local && estado);
  const campo =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-body text-[16px] text-slate-800 outline-none transition-colors focus:border-slate-400";
  const rotulo =
    "font-body text-[11px] text-slate-400 uppercase tracking-[0.14em]";

  if (aMarcarNoMapa) {
    return (
      <EscolherNoMapa
        inicio={local}
        onCancelar={() => setAMarcarNoMapa(false)}
        onConfirmar={async (lat, lng) => {
          setLocal({ lat, lng, accuracy: null });
          setErroLocal(null);
          setAMarcarNoMapa(false);
          const achado = await procurarMorada(lat, lng);
          if (achado.morada) {
            setMorada((m) => m || achado.morada || "");
          }
          if (achado.concelho) {
            setConcelho((c) => c || achado.concelho || "");
          }
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-[560px] px-5 pt-5 pb-40">
      {/* 1 — a fotografia */}
      <input
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => escolherFicheiro(e.target.files?.[0] ?? null)}
        ref={inputFoto}
        type="file"
      />
      {preVisual ? (
        <div className="relative overflow-hidden rounded-3xl">
          <img
            alt="O painel que fotografou"
            className="max-h-[42vh] w-full object-cover"
            src={preVisual}
          />
          <button
            className="absolute right-3 bottom-3 rounded-full bg-black/55 px-4 py-2 font-body text-[13px] text-white backdrop-blur-md"
            onClick={() => inputFoto.current?.click()}
            type="button"
          >
            Trocar
          </button>
        </div>
      ) : (
        <button
          className="flex w-full flex-col items-center gap-4 rounded-3xl py-16 transition-transform active:scale-[0.99]"
          onClick={() => inputFoto.current?.click()}
          style={{ backgroundColor: COBALTO.lavado }}
          type="button"
        >
          <span
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: COBALTO.forte }}
          >
            <Camera className="h-7 w-7 text-white" strokeWidth={1.5} />
          </span>
          <span
            className="font-display text-[17px]"
            style={{ color: COBALTO.tinta }}
          >
            Fotografar o painel
          </span>
          <span className="font-body text-[13px] text-slate-500">
            O conjunto, não o pormenor
          </span>
        </button>
      )}

      {/* 2 — o sítio */}
      <div className="mt-4">
        {local ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: COBALTO.forte }}
              >
                <Check className="h-4 w-4 text-white" strokeWidth={3} />
              </span>
              <p className="flex-1 font-body text-[14px] text-slate-800">
                Sítio obtido
                <span className="ml-1.5 text-slate-400">
                  {local.accuracy === null
                    ? "marcado à mão"
                    : `±${Math.round(local.accuracy)} m`}
                </span>
              </p>
              <button
                className="font-body text-[13px] text-slate-400 underline underline-offset-4"
                onClick={localizar}
                type="button"
              >
                Refazer
              </button>
            </div>
            {impreciso && (
              <p className="mt-2.5 font-body text-[13px] text-amber-700 leading-relaxed">
                Precisão fraca. Ao ar livre, parado uns segundos, costuma
                melhorar — mas pode registar assim se preferir.
              </p>
            )}
            <div className="mt-4 grid gap-2.5">
              <label className="block">
                <span className={rotulo}>Rua</span>
                <input
                  className={`mt-1.5 ${campo}`}
                  onChange={(e) => setMorada(e.target.value)}
                  placeholder="Rua…"
                  type="text"
                  value={morada}
                />
              </label>
              <label className="block">
                <span className={rotulo}>Concelho</span>
                <input
                  className={`mt-1.5 ${campo}`}
                  onChange={(e) => setConcelho(e.target.value)}
                  placeholder="Concelho…"
                  type="text"
                  value={concelho}
                />
              </label>
            </div>
          </div>
        ) : (
          <button
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white py-4 font-body text-[15px] text-slate-700 transition-transform active:scale-[0.99]"
            disabled={aLocalizar}
            onClick={localizar}
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
            {aLocalizar ? "A localizar…" : "Marcar onde estou"}
          </button>
        )}
        {erroLocal && (
          <p className="mt-2.5 font-body text-[13px] text-red-700 leading-relaxed">
            {erroLocal}
          </p>
        )}
        {/* Saída de emergência: há telemóveis onde o GPS simplesmente não
            colabora, e ficar sem poder registar é pior do que um ponto posto
            à mão — que fica marcado como tal. */}
        <button
          className="mt-2.5 w-full font-body text-[13px] text-slate-500 underline underline-offset-4"
          onClick={() => setAMarcarNoMapa(true)}
          type="button"
        >
          {local ? "Corrigir o sítio no mapa" : "Ou marcar o sítio no mapa"}
        </button>
      </div>

      {/* 3 — o estado */}
      <p className={`mt-6 ${rotulo}`}>Em que estado está</p>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        {ESTADOS.map((e) => {
          const activo = estado === e.valor;
          return (
            <button
              className={`rounded-2xl border-2 px-4 py-3.5 text-left transition-all ${
                activo ? "shadow-sm" : "border-slate-200 bg-white"
              }`}
              key={e.valor}
              onClick={() => setEstado(e.valor)}
              style={
                activo
                  ? {
                      borderColor: COR_ESTADO[e.valor],
                      backgroundColor: `${COR_ESTADO[e.valor]}12`,
                    }
                  : undefined
              }
              type="button"
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: COR_ESTADO[e.valor] }}
                />
                <span className="font-body text-[15px] text-slate-900">
                  {ROTULO_ESTADO[e.valor]}
                </span>
              </span>
              <span className="mt-0.5 block font-body text-[12px] text-slate-500">
                {e.nota}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4 — o que se sabe (opcional) */}
      <button
        className="mt-6 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3.5"
        onClick={() => setVerHistoria((v) => !v)}
        type="button"
      >
        <span className="text-left">
          <span className="block font-body text-[15px] text-slate-800">
            Sei alguma coisa sobre este painel
          </span>
          <span className="block font-body text-[12px] text-slate-500">
            Opcional · fica «por confirmar»
          </span>
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${verHistoria ? "rotate-180" : ""}`}
        />
      </button>
      {verHistoria && (
        <div className="mt-2.5 grid gap-2.5">
          {[
            { r: "Padrão", v: padrao, s: setPadrao, d: "Nome ou descrição" },
            { r: "Época", v: epoca, s: setEpoca, d: "Ex.: finais do séc. XIX" },
            { r: "Oficina", v: oficina, s: setOficina, d: "Ex.: Sant'Anna" },
          ].map((c) => (
            <label className="block" key={c.r}>
              <span className={rotulo}>{c.r}</span>
              <input
                className={`mt-1.5 ${campo}`}
                onChange={(e) => c.s(e.target.value)}
                placeholder={c.d}
                type="text"
                value={c.v}
              />
            </label>
          ))}
        </div>
      )}

      {/* Barra de envio — fixa, sempre ao alcance do polegar. */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-slate-200/70 border-t bg-white/90 px-5 pt-3 backdrop-blur-xl"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      >
        <div className="mx-auto max-w-[560px]">
          {erro && (
            <p className="mb-2.5 text-center font-body text-[13px] text-red-700">
              {erro}
            </p>
          )}
          <button
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 font-body text-[16px] text-white transition-all active:scale-[0.98] disabled:opacity-40"
            disabled={aEnviar || !completo}
            onClick={enviar}
            style={{ backgroundColor: COBALTO.forte }}
            type="button"
          >
            {aEnviar ? (
              <Loader2 className="h-[18px] w-[18px] animate-spin" />
            ) : (
              <MapPin size={18} strokeWidth={1.75} />
            )}
            {aEnviar ? "A registar…" : "Registar o painel"}
          </button>
          {!completo && (
            <p className="mt-2 text-center font-body text-[12px] text-slate-400">
              {ficheiro
                ? local
                  ? "Falta dizer em que estado está"
                  : "Falta marcar onde está"
                : "Falta a fotografia"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegistarAzulejoPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <main className="min-h-dvh bg-slate-50">
      <Seo
        description="Fotografe um painel de azulejo da sua rua. A localização vem do telemóvel e o registo fica datado."
        noindex
        path="/azulejos/registar"
        title="Registar um painel — Azulejos | Memória Lusíada"
      />
      <BarraTopo titulo="REGISTAR" />
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2
            className="h-6 w-6 animate-spin"
            style={{ color: COBALTO.forte }}
          />
        </div>
      ) : isAuthenticated ? (
        <Formulario />
      ) : (
        <PedirSessao />
      )}
    </main>
  );
}
