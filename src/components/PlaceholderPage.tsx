interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="container mx-auto px-6 py-32 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center space-y-6 max-w-xl">
        <h1 className="font-display text-[44px] sm:text-[56px] lg:text-[64px] leading-[1.1] text-primary">
          {title}
        </h1>
        <p className="font-body text-base sm:text-lg text-muted-foreground">
          {description || "Em construção."}
        </p>
        <div className="flex justify-center pt-4">
          <span aria-hidden="true" className="block h-px w-[60px] bg-accent" />
        </div>
      </div>
    </div>
  );
}
