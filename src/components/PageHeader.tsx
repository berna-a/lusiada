type PageHeaderProps = {
  eyebrow: string;
  title: string;
  intro?: string;
};

/** Cabeçalho padrão das páginas institucionais: rótulo + título + filete + intro. */
export function PageHeader({ eyebrow, title, intro }: PageHeaderProps) {
  return (
    <header className="text-center">
      <p className="font-body text-[12px] text-muted-foreground uppercase tracking-[0.25em]">
        {eyebrow}
      </p>
      <h1 className="mt-4 font-display text-[40px] text-primary leading-[1.1] sm:text-[56px]">
        {title}
      </h1>
      <div className="mt-8 flex justify-center">
        <span aria-hidden="true" className="block h-px w-[60px] bg-accent" />
      </div>
      {intro && (
        <p className="mx-auto mt-8 max-w-xl font-body text-[17px] text-foreground/80 leading-relaxed">
          {intro}
        </p>
      )}
    </header>
  );
}
