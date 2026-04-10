interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground text-lg max-w-md">
          {description || "Conteúdo em construção."}
        </p>
        <div className="inline-block px-4 py-2 rounded-full bg-muted text-muted-foreground text-xs">
          placeholder
        </div>
      </div>
    </div>
  );
}
