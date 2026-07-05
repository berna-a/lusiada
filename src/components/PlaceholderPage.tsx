interface PlaceholderPageProps {
  description?: string;
  title: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-6 py-32">
      <div className="max-w-xl space-y-6 text-center">
        <h1 className="font-display text-[44px] text-primary leading-[1.1] sm:text-[56px] lg:text-[64px]">
          {title}
        </h1>
        <p className="font-body text-base text-muted-foreground sm:text-lg">
          {description || "Em construção."}
        </p>
        <div className="flex justify-center pt-4">
          <span aria-hidden="true" className="block h-px w-[60px] bg-accent" />
        </div>
      </div>
    </div>
  );
}
