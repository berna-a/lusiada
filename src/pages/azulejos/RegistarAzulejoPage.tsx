import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation } from "convex/react";
import { Camera, Check, Crosshair, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";

type Estado = "integro" | "danificado" | "em_risco" | "desaparecido";

const ESTADOS: { valor: Estado; rotulo: string; nota: string }[] = [
  { valor: "integro", rotulo: "Íntegro", nota: "Está inteiro" },
  { valor: "danificado", rotulo: "Danificado", nota: "Faltam peças" },
  { valor: "em_risco", rotulo: "Em risco", nota: "Obra, ruína, à venda" },
  { valor: "desaparecido", rotulo: "Desaparecido", nota: "Já não está lá" },
];

/** Acima disto o GPS não é de fiar para distinguir um prédio do vizinho. */
const PRECISAO_MAXIMA_M = 100;
const TIMEOUT_MORADA_MS = 6000;

type Local = { lat: number; lng: number; accuracy: number };

async function enviarFotografia(
  gerarUrl: () => Promise<string>,
  ficheiro: File
): Promise<Id<"_storage">> {
  const url = await gerarUrl();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": ficheiro.type },
    body: ficheiro,
  });
  if (!res.ok) {
    throw new Error("Falha no envio da fotografia.");
  }
  const { storageId } = await res.json();
  return storageId;
}

/**
 * Tenta descobrir a morada a partir das coordenadas. É uma comodidade, não um
 * requisito: se falhar, o registo segue na mesma e a pessoa escreve à mão.
 */
async function procurarMorada(
  lat: number,
  lng: number
): Promise<{ morada: string | null; concelho: string | null }> {
  const vazio = { morada: null, concelho: null };
  try {
    const controlador = new AbortController();
    const timer = setTimeout(() => controlador.abort(), TIMEOUT_MORADA_MS);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&accept-language=pt`,
      { signal: controlador.signal }
    );
    clearTimeout(timer);
    if (!res.ok) {
      return vazio;
    }
    const dados = await res.json();
    const a = dados?.address ?? {};
    const rua = a.road ?? a.pedestrian ?? a.footway ?? null;
    const numero = a.house_number ? `, ${a.house_number}` : "";
    return {
      morada: rua ? `${rua}${numero}` : null,
      concelho: a.municipality ?? a.city ?? a.town ?? a.village ?? null,
    };
  } catch {
    return vazio;
  }
}

function PedirSessao() {
  const { signIn } = useAuthActions();
  return (
    <div className="rounded-2xl border border-border/60 border-dashed bg-card/40 p-8 text-center">
      <p className="font-body text-[15px] text-foreground/70 leading-relaxed">
        Ver o mapa não exige nada. Para registar um painel é preciso ter conta —
        é grátis e leva vinte segundos.
      </p>
      <Button
        className="mt-5"
        onClick={() => signIn("google", { redirectTo: "/azulejos/registar" })}
        variant="accent"
      >
        Entrar com Google
      </Button>
    </div>
  );
}

function Passo({
  numero,
  titulo,
  nota,
  children,
}: {
  numero: number;
  titulo: string;
  nota?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-[13px] text-accent tracking-[0.2em]">
          {numero}
        </span>
        <h2 className="font-display text-[18px] text-primary leading-snug">
          {titulo}
        </h2>
      </div>
      {nota && (
        <p className="mt-1.5 font-body text-[14px] text-muted-foreground leading-relaxed">
          {nota}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Formulario() {
  const gerarUrl = useMutation(api.azulejos.generateUploadUrl);
  const submeter = useMutation(api.azulejos.submit);

  const [ficheiro, setFicheiro] = useState<File | null>(null);
  const [preVisualizacao, setPreVisualizacao] = useState<string | null>(null);
  const [local, setLocal] = useState<Local | null>(null);
  const [aLocalizar, setALocalizar] = useState(false);
  const [erroLocal, setErroLocal] = useState<string | null>(null);
  const [estado, setEstado] = useState<Estado | null>(null);
  const [morada, setMorada] = useState("");
  const [concelho, setConcelho] = useState("");
  const [mostrarHistoria, setMostrarHistoria] = useState(false);
  const [padrao, setPadrao] = useState("");
  const [epoca, setEpoca] = useState("");
  const [oficina, setOficina] = useState("");
  const [autor, setAutor] = useState("");
  const [aEnviar, setAEnviar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [feito, setFeito] = useState(false);
  const inputFoto = useRef<HTMLInputElement | null>(null);

  // Liberta o URL da pré-visualização quando deixa de ser preciso.
  useEffect(
    () => () => {
      if (preVisualizacao) {
        URL.revokeObjectURL(preVisualizacao);
      }
    },
    [preVisualizacao]
  );

  const escolherFicheiro = (f: File | null) => {
    if (preVisualizacao) {
      URL.revokeObjectURL(preVisualizacao);
    }
    setFicheiro(f);
    setPreVisualizacao(f ? URL.createObjectURL(f) : null);
  };

  const localizar = () => {
    setErroLocal(null);
    if (!navigator.geolocation) {
      setErroLocal("Este telemóvel não permite obter a localização.");
      return;
    }
    setALocalizar(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setLocal({ lat: latitude, lng: longitude, accuracy });
        setALocalizar(false);
        const encontrado = await procurarMorada(latitude, longitude);
        if (encontrado.morada) {
          setMorada((m) => m || encontrado.morada || "");
        }
        if (encontrado.concelho) {
          setConcelho((c) => c || encontrado.concelho || "");
        }
      },
      (e) => {
        setALocalizar(false);
        setErroLocal(
          e.code === e.PERMISSION_DENIED
            ? "Deu-nos não à localização. Sem o sítio exacto, o registo não serve de prova — autorize nas definições do navegador."
            : "Não foi possível obter a localização. Tente de novo ao ar livre."
        );
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 }
    );
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
      setErro("Falta indicar o estado do painel.");
      return;
    }
    setAEnviar(true);
    try {
      const imageId = await enviarFotografia(gerarUrl, ficheiro);
      await submeter({
        lat: local.lat,
        lng: local.lng,
        gpsAccuracy: local.accuracy,
        imageId,
        estado,
        morada: morada.trim() || undefined,
        concelho: concelho.trim() || undefined,
        padrao: padrao.trim() || undefined,
        epoca: epoca.trim() || undefined,
        oficina: oficina.trim() || undefined,
        autor: autor.trim() || undefined,
      });
      setFeito(true);
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
    setAutor("");
    setMostrarHistoria(false);
    setFeito(false);
  };

  if (feito) {
    return (
      <div className="mt-10 rounded-2xl border border-accent/30 bg-accent/[0.05] p-8 text-center">
        <p className="font-display text-[22px] text-primary">Ficou registado</p>
        <p className="mx-auto mt-3 max-w-[420px] font-body text-[15px] text-foreground/75 leading-relaxed">
          O painel entra no mapa depois de uma revisão. A data e o sítio já
          ficaram guardados — é isso que faz do registo uma prova.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={recomecar} variant="accent">
            Registar outro
          </Button>
          <Button asChild variant="outline">
            <Link to="/azulejos">Ver o mapa</Link>
          </Button>
        </div>
      </div>
    );
  }

  const impreciso = local !== null && local.accuracy > PRECISAO_MAXIMA_M;
  const campoClasse =
    "w-full rounded-lg border border-border bg-card px-4 py-2.5 font-body text-[15px] text-foreground outline-none focus:border-accent";

  return (
    <>
      <Passo
        nota="Do conjunto, não do pormenor. Tirada da rua."
        numero={1}
        titulo="A fotografia"
      >
        <input
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => escolherFicheiro(e.target.files?.[0] ?? null)}
          ref={inputFoto}
          type="file"
        />
        {preVisualizacao ? (
          <div className="overflow-hidden rounded-xl border border-border">
            <img
              alt="Pré-visualização do painel fotografado"
              className="max-h-[320px] w-full object-cover"
              src={preVisualizacao}
            />
            <button
              className="w-full border-border border-t bg-card px-4 py-3 font-body text-[14px] text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => inputFoto.current?.click()}
              type="button"
            >
              Trocar de fotografia
            </button>
          </div>
        ) : (
          <button
            className="flex w-full flex-col items-center gap-3 rounded-xl border border-border border-dashed bg-card/40 px-6 py-12 transition-colors hover:border-accent/50"
            onClick={() => inputFoto.current?.click()}
            type="button"
          >
            <Camera className="h-7 w-7 text-accent" strokeWidth={1.5} />
            <span className="font-body text-[15px] text-foreground/70">
              Tirar ou escolher uma fotografia
            </span>
          </button>
        )}
      </Passo>

      <Passo
        nota="Vem do telemóvel, não se escreve à mão — é isso que dá valor de prova ao registo."
        numero={2}
        titulo="O sítio"
      >
        {local ? (
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="flex items-center gap-2 font-body text-[15px] text-foreground">
              <Check className="h-4 w-4 text-accent" strokeWidth={2} />
              Localização obtida
              <span className="font-body text-[13px] text-muted-foreground">
                (±{Math.round(local.accuracy)} m)
              </span>
            </p>
            {impreciso && (
              <p className="mt-2 font-body text-[13px] text-destructive leading-relaxed">
                A precisão está fraca. Ao ar livre e parado uns segundos costuma
                melhorar — vale a pena tentar de novo antes de enviar.
              </p>
            )}
            <button
              className="mt-3 font-body text-[13px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              onClick={localizar}
              type="button"
            >
              Obter de novo
            </button>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                  Rua
                </span>
                <input
                  className={`mt-1.5 ${campoClasse}`}
                  onChange={(e) => setMorada(e.target.value)}
                  placeholder="Rua…"
                  type="text"
                  value={morada}
                />
              </label>
              <label className="block">
                <span className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                  Concelho
                </span>
                <input
                  className={`mt-1.5 ${campoClasse}`}
                  onChange={(e) => setConcelho(e.target.value)}
                  placeholder="Concelho…"
                  type="text"
                  value={concelho}
                />
              </label>
            </div>
          </div>
        ) : (
          <>
            <Button
              className="w-full sm:w-auto"
              disabled={aLocalizar}
              onClick={localizar}
              variant="accent"
            >
              {aLocalizar ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Crosshair className="h-4 w-4" strokeWidth={1.5} />
              )}
              {aLocalizar ? "A localizar…" : "Usar a minha localização"}
            </Button>
            {erroLocal && (
              <p className="mt-3 font-body text-[14px] text-destructive leading-relaxed">
                {erroLocal}
              </p>
            )}
          </>
        )}
      </Passo>

      <Passo
        nota="É o campo mais importante de todos: é o que permite provar que um painel desapareceu."
        numero={3}
        titulo="O estado"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {ESTADOS.map((e) => {
            const activo = estado === e.valor;
            return (
              <button
                className={`rounded-xl border px-5 py-4 text-left transition-colors ${
                  activo
                    ? "border-accent bg-accent/10"
                    : "border-border bg-card hover:border-accent/50"
                }`}
                key={e.valor}
                onClick={() => setEstado(e.valor)}
                type="button"
              >
                <span className="block font-display text-[16px] text-primary">
                  {e.rotulo}
                </span>
                <span className="mt-0.5 block font-body text-[13px] text-muted-foreground">
                  {e.nota}
                </span>
              </button>
            );
          })}
        </div>
      </Passo>

      <Passo
        nota="Só para quem souber. Fica marcado como «por confirmar» — nunca apresentamos uma atribuição incerta como certa."
        numero={4}
        titulo="O que se sabe (opcional)"
      >
        {mostrarHistoria ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                rotulo: "Padrão",
                valor: padrao,
                set: setPadrao,
                dica: "Nome ou descrição",
              },
              {
                rotulo: "Época",
                valor: epoca,
                set: setEpoca,
                dica: "Ex.: finais do séc. XIX",
              },
              {
                rotulo: "Oficina ou fábrica",
                valor: oficina,
                set: setOficina,
                dica: "Ex.: Sant'Anna",
              },
              {
                rotulo: "Autor",
                valor: autor,
                set: setAutor,
                dica: "Se houver",
              },
            ].map((c) => (
              <label className="block" key={c.rotulo}>
                <span className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                  {c.rotulo}
                </span>
                <input
                  className={`mt-1.5 ${campoClasse}`}
                  onChange={(e) => c.set(e.target.value)}
                  placeholder={c.dica}
                  type="text"
                  value={c.valor}
                />
              </label>
            ))}
          </div>
        ) : (
          <button
            className="font-body text-[14px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            onClick={() => setMostrarHistoria(true)}
            type="button"
          >
            Sei alguma coisa sobre este painel
          </button>
        )}
      </Passo>

      <div className="mt-12 border-accent/20 border-t pt-8">
        {erro && (
          <p className="mb-4 font-body text-[14px] text-destructive leading-relaxed">
            {erro}
          </p>
        )}
        <Button
          className="w-full sm:w-auto"
          disabled={aEnviar}
          onClick={enviar}
          variant="accent"
        >
          {aEnviar && <Loader2 className="h-4 w-4 animate-spin" />}
          {aEnviar ? "A registar…" : "Registar o painel"}
        </Button>
        <p className="mt-4 font-body text-[13px] text-muted-foreground leading-relaxed">
          O painel entra no mapa depois de uma revisão.
        </p>
      </div>
    </>
  );
}

export default function RegistarAzulejoPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <main
      className="mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="Fotografe um painel de azulejo da sua rua. A localização vem do telemóvel e o registo fica datado — património e prova ao mesmo tempo."
        noindex
        path="/azulejos/registar"
        title="Registar um painel — Azulejos | Memória Lusíada"
      />

      <header className="text-center">
        <p className="font-body text-[12px] text-accent uppercase tracking-[0.3em]">
          Azulejos
        </p>
        <h1 className="mt-3 font-display text-[36px] text-primary leading-[1.05] sm:text-[46px]">
          Registar um painel
        </h1>
        <p className="mx-auto mt-6 max-w-[480px] font-body text-[16px] text-foreground/65 leading-relaxed">
          Faz-se na rua, à frente do painel. Três passos e está.
        </p>
      </header>

      {isLoading && (
        <p className="mt-10 text-center font-body text-[15px] text-muted-foreground">
          A carregar…
        </p>
      )}
      {!isLoading && (isAuthenticated ? <Formulario /> : <PedirSessao />)}
    </main>
  );
}
