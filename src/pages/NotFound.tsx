import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <p className="font-display text-7xl md:text-8xl font-semibold text-primary">404</p>
        <h1 className="mt-4 font-display text-2xl md:text-3xl text-foreground tracking-tight">
          Página não encontrada
        </h1>
        <p className="mt-4 font-body text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          A página que procura não existe ou foi movida. Regresse ao início para
          continuar a navegar.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-full px-8 py-3 font-display text-sm uppercase tracking-[0.15em] text-primary-foreground bg-primary transition-all hover:brightness-110"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
