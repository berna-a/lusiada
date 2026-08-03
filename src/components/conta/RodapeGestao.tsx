import {
  Bell,
  ChevronRight,
  CreditCard,
  Crop,
  ExternalLink,
  Eye,
  EyeOff,
  Link2,
  LogOut,
  type LucideIcon,
  Mail,
  Pencil,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * Tudo o que é gerir — perfil, endereço, conta, associação, notificações —
 * num rodapé no fim do perfil, em vez de uma página de definições à parte.
 *
 * A ideia é que o perfil seja a página da pessoa e a gestão viva por baixo
 * dele, ao alcance mas fora do caminho de quem só quer olhar.
 */

type Linha = {
  icone: LucideIcon;
  titulo: string;
  nota?: string;
  para?: string;
  onClick?: () => void;
  externo?: boolean;
  desligado?: boolean;
  perigoso?: boolean;
};

function Fila({ linha }: { linha: Linha }) {
  const Icone = linha.icone;
  const conteudo = (
    <>
      <Icone
        className={linha.perigoso ? "text-destructive/70" : "text-accent"}
        size={17}
        strokeWidth={1.75}
      />
      <span className="min-w-0 flex-1">
        <span className="block font-body text-[15px] text-foreground/90 leading-snug">
          {linha.titulo}
        </span>
        {linha.nota && (
          <span className="mt-0.5 block truncate font-body text-[13px] text-muted-foreground">
            {linha.nota}
          </span>
        )}
      </span>
      {!linha.desligado && (
        <ChevronRight
          className="shrink-0 text-muted-foreground/60"
          size={16}
          strokeWidth={1.75}
        />
      )}
    </>
  );

  const classe = `flex w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors ${
    linha.desligado ? "cursor-default opacity-55" : "hover:bg-secondary/70"
  } ${linha.perigoso ? "text-destructive" : ""}`;

  if (linha.para && !linha.desligado) {
    return (
      <Link className={classe} to={linha.para}>
        {conteudo}
      </Link>
    );
  }
  return (
    <button
      className={classe}
      disabled={linha.desligado}
      onClick={linha.onClick}
      type="button"
    >
      {conteudo}
    </button>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="px-5 pt-6 pb-2 font-body text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
        {titulo}
      </h2>
      <div className="divide-y divide-border/70 border-border/70 border-y bg-card">
        {children}
      </div>
    </section>
  );
}

type Props = {
  handle: string;
  email: string | null;
  perfilPrivado: boolean;
  temCapa: boolean;
  onEditar: () => void;
  onEnquadrarCapa: () => void;
  onSair: () => void;
};

export function RodapeGestao({
  handle,
  email,
  perfilPrivado,
  temCapa,
  onEditar,
  onEnquadrarCapa,
  onSair,
}: Props) {
  return (
    <div className="-mx-6 mt-16 sm:mx-0 sm:overflow-hidden sm:rounded-2xl sm:border sm:border-border/70">
      <Grupo titulo="Perfil">
        <Fila
          linha={{
            icone: Pencil,
            titulo: "Editar perfil",
            nota: "Nome, frase, terra e fotografias",
            onClick: onEditar,
          }}
        />
        <Fila
          linha={{
            icone: Crop,
            titulo: "Enquadrar a capa",
            nota: temCapa
              ? "Escolher que parte da fotografia fica à vista"
              : "Precisa de uma fotografia de capa primeiro",
            desligado: !temCapa,
            onClick: onEnquadrarCapa,
          }}
        />
        <Fila
          linha={{
            icone: perfilPrivado ? EyeOff : Eye,
            titulo: perfilPrivado ? "Perfil escondido" : "Perfil visível",
            nota: perfilPrivado
              ? "Ninguém o encontra pelo endereço público"
              : "Qualquer pessoa o pode ver",
            onClick: onEditar,
          }}
        />
        {!perfilPrivado && (
          <Fila
            linha={{
              icone: ExternalLink,
              titulo: "Ver como público",
              nota: "O que os outros vêem",
              para: `/${handle}`,
            }}
          />
        )}
      </Grupo>

      <Grupo titulo="Conta">
        <Fila
          linha={{
            icone: Link2,
            titulo: "Endereço",
            nota: `alusiada.pt/${handle}`,
            onClick: onEditar,
          }}
        />
        <Fila
          linha={{
            icone: Mail,
            titulo: "Correio electrónico",
            nota: email ?? "Sem endereço associado",
            desligado: true,
          }}
        />
        <Fila
          linha={{
            icone: Bell,
            titulo: "Notificações",
            nota: "Ainda não há nada para avisar",
            desligado: true,
          }}
        />
      </Grupo>

      <Grupo titulo="Associação">
        <Fila
          linha={{
            icone: CreditCard,
            titulo: "Adesão, quotas e dados pessoais",
            para: "/conta",
          }}
        />
      </Grupo>

      {/* Sair não é uma linha como as outras: estava logo por baixo de
          «Adesão», e um toque a mais ao rolar deitava a sessão fora. Fica
          separado, e pergunta antes. */}
      <div className="px-5 py-7">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 py-3.5 font-body text-[14px] text-destructive transition-colors hover:bg-destructive/5"
          onClick={() => {
            if (window.confirm("Terminar a sessão neste aparelho?")) {
              onSair();
            }
          }}
          type="button"
        >
          <LogOut size={15} strokeWidth={1.75} />
          Terminar sessão
        </button>
      </div>
    </div>
  );
}
