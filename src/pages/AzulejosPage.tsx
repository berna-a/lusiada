import { useQuery } from "convex/react";
import { Camera, MapPin, ShieldAlert, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/../convex/_generated/api";
import {
  MapaAzulejos,
  type PainelNoMapa,
} from "@/components/azulejos/MapaAzulejos";
import { JoinCTA } from "@/components/JoinCTA";
import { PageHeader } from "@/components/PageHeader";
import { Seo } from "@/components/Seo";
import { COR_ESTADO } from "@/lib/azulejos/mapa-estilo";

/** Legenda do mapa: o que cada cor quer dizer. */
const LEGENDA = [
  { cor: COR_ESTADO.integro, rotulo: "Íntegro" },
  { cor: COR_ESTADO.danificado, rotulo: "Danificado" },
  { cor: COR_ESTADO.em_risco, rotulo: "Em risco" },
  { cor: COR_ESTADO.desaparecido, rotulo: "Desaparecido", oco: true },
];

/** Os três blocos da ficha, por ordem de exigência. */
const BLOCOS = [
  {
    icon: Camera,
    titulo: "O que se vê",
    nota: "Obrigatório",
    texto:
      "Uma fotografia, a localização do telemóvel e o estado em que está. É tudo o que é preciso para contribuir — não é preciso saber nada sobre azulejo.",
  },
  {
    icon: Sparkles,
    titulo: "O que se sabe",
    nota: "Opcional",
    texto:
      "Padrão, época, oficina, autor. Quem souber, preenche. Fica marcado como «por confirmar» até alguém com competência o validar — nunca apresentamos uma atribuição incerta como certa.",
  },
  {
    icon: ShieldAlert,
    titulo: "O que fica provado",
    nota: "A consequência",
    texto:
      "Cada registo fica datado e localizado. Quando um painel desaparece, passa a existir prova do que ali estava e de quando deixou de estar. Nenhuma outra base de dados portuguesa faz isto.",
  },
];

function BarraEstado({
  total,
  concelhos,
  emRisco,
  desaparecidos,
}: {
  total: number;
  concelhos: number;
  emRisco: number;
  desaparecidos: number;
}) {
  const numeros = [
    { valor: total, rotulo: total === 1 ? "painel" : "painéis" },
    { valor: concelhos, rotulo: concelhos === 1 ? "concelho" : "concelhos" },
    { valor: emRisco, rotulo: "em risco" },
    { valor: desaparecidos, rotulo: "desaparecidos" },
  ];
  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
      {numeros.map((n) => (
        <div className="border-accent/25 border-t pt-3" key={n.rotulo}>
          <dt className="font-display text-[26px] text-primary leading-none">
            {n.valor}
          </dt>
          <dd className="mt-1.5 font-body text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
            {n.rotulo}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function AzulejosPage() {
  const navigate = useNavigate();
  const paineis = useQuery(api.azulejos.listApproved);
  const stats = useQuery(api.azulejos.stats);

  const noMapa: PainelNoMapa[] = (paineis ?? []) as PainelNoMapa[];
  const vazio = paineis !== undefined && paineis.length === 0;

  return (
    <article
      className="mx-auto max-w-[1000px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
      data-nav-theme="light"
    >
      <Seo
        description="Um mapa do azulejo que ainda está nas paredes — feito por quem passa por ele todos os dias. Fotografe o azulejo da sua rua: o registo fica datado e localizado."
        jsonLd={{
          "@type": "Dataset",
          name: "Inventário aberto do azulejo de fachada em Portugal",
          description:
            "Registo colaborativo, datado e geolocalizado, de painéis azulejares em fachadas portuguesas, incluindo painéis comuns sem autoria conhecida.",
          inLanguage: "pt",
          license: "https://creativecommons.org/licenses/by-sa/4.0/",
          spatialCoverage: "Portugal",
        }}
        path="/azulejos"
        title="Azulejos — o mapa do que ainda está nas paredes | Memória Lusíada"
      />

      <PageHeader
        eyebrow="Associação Memória Lusíada"
        intro="Um mapa do azulejo que ainda está nas paredes — feito por quem passa por ele todos os dias."
        title="Azulejos"
      />

      {/* O mapa é a peça central da página, não uma ilustração. */}
      <section className="mt-14">
        <div className="premium-shadow overflow-hidden rounded-2xl border border-border bg-card">
          <div className="h-[460px] w-full sm:h-[560px]">
            <MapaAzulejos
              onSelecionar={(id) => navigate(`/azulejos/${id}`)}
              paineis={noMapa}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          {LEGENDA.map((l) => (
            <span
              className="flex items-center gap-2 font-body text-[12px] text-muted-foreground uppercase tracking-[0.12em]"
              key={l.rotulo}
            >
              <span
                aria-hidden="true"
                className="block h-3 w-3 rounded-full"
                style={{
                  backgroundColor: l.oco ? "#FFFFFF" : l.cor,
                  border: `2px solid ${l.cor}`,
                }}
              />
              {l.rotulo}
            </span>
          ))}
        </div>
      </section>

      {stats && (
        <section className="mt-12">
          <BarraEstado
            concelhos={stats.concelhos}
            desaparecidos={stats.desaparecidos}
            emRisco={stats.emRisco}
            total={stats.total}
          />
        </section>
      )}

      {vazio && (
        <section className="mt-12 rounded-2xl border border-accent/30 bg-secondary px-8 py-10 sm:px-10">
          <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
            O mapa está vazio
          </h2>
          <p className="mt-4 font-body text-[17px] text-foreground/85 leading-[1.85]">
            Ainda não há nada registado — e é assim que todos estes projectos
            começam. O primeiro painel do mapa é o mais difícil de arranjar e o
            mais importante de todos.
          </p>
          <p className="mt-4 font-body text-[17px] text-foreground/85 leading-[1.85]">
            Se passa por um azulejo hoje, fotografe-o.
          </p>
        </section>
      )}

      <section className="mx-auto mt-16 max-w-[640px]">
        <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          O que este mapa é
        </h2>
        <p className="mt-5 font-body text-[17px] text-foreground/85 leading-[1.85]">
          Não é o mais completo — há bases académicas que sabem muito mais sobre
          o azulejo de autor. Não é o mais bonito — o Instagram ganha sempre. É
          o único onde entra o azulejo <strong>comum</strong>, sem autor
          conhecido, em prédio sem classificação, fotografado por quem mora na
          rua.
        </p>
        <p className="mt-5 font-body text-[17px] text-foreground/85 leading-[1.85]">
          Lisboa proíbe desde 2013 a remoção de azulejo de fachada, e os furtos
          continuam. Quando um painel desaparece, quase nunca existe fotografia
          datada que prove o que ali estava.{" "}
          <strong>
            Um registo com data e sítio é património e é prova ao mesmo tempo.
          </strong>
        </p>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          Como se regista
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {BLOCOS.map((b) => (
            <div
              className="premium-shadow flex flex-col rounded-2xl border border-border bg-card p-7"
              key={b.titulo}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <b.icon className="h-5 w-5" />
              </span>
              <span className="mt-5 w-fit rounded-full border border-border px-3 py-1 font-body text-[11px] text-muted-foreground uppercase tracking-[0.14em]">
                {b.nota}
              </span>
              <h3 className="mt-4 font-display text-[20px] text-primary leading-snug">
                {b.titulo}
              </h3>
              <p className="mt-3 font-body text-[15px] text-foreground/75 leading-relaxed">
                {b.texto}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-accent/30 bg-secondary px-8 py-10 text-center sm:px-10">
        <h2 className="font-display text-[24px] text-primary leading-snug sm:text-[28px]">
          Fotografe a sua rua antes que desapareça
        </h2>
        <p className="mx-auto mt-4 max-w-[520px] font-body text-[16px] text-foreground/80 leading-relaxed">
          Leva segundos e faz-se do telemóvel, na rua, à frente do painel. Ver o
          mapa não exige nada; para registar é preciso ter conta — é grátis.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <button
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-body text-[14px] text-primary-foreground transition-opacity hover:opacity-90"
            onClick={() => navigate("/azulejos/registar")}
            type="button"
          >
            <MapPin size={16} strokeWidth={1.5} />
            Registar um painel
          </button>
        </div>
      </section>

      <div className="mt-16">
        <JoinCTA lead="Faça parte desta casa." />
      </div>
    </article>
  );
}
