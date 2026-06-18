import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";

type EmBreveProps = {
  icon: LucideIcon;
  title: string;
  intro: string;
  detail: string;
};

/** Página "em breve" consistente para as secções da Arca ainda por publicar. */
export function EmBreve({ icon: Icon, title, intro, detail }: EmBreveProps) {
  return (
    <main
      className="mx-auto max-w-[860px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
      data-nav-theme="light"
    >
      <PageHeader
        eyebrow="Arca · Memória Lusíada"
        intro={intro}
        title={title}
      />

      <div className="premium-shadow mt-16 flex flex-col items-center rounded-2xl border border-border bg-card px-8 py-14 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Icon className="h-7 w-7" />
        </span>
        <p className="mt-6 font-display text-[22px] text-primary">Em breve</p>
        <p className="mt-3 max-w-md font-body text-[15px] text-foreground/70 leading-relaxed">
          {detail}
        </p>
        <Link
          className="mt-8 inline-flex items-center gap-1 font-body text-[14px] text-accent transition-all hover:gap-2"
          to="/arca/panteao"
        >
          Entretanto, visite o Panteão <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
