import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-6">
    <div className="text-center">
      <p className="font-display font-semibold text-7xl text-primary md:text-8xl">
        404
      </p>
      <h1 className="mt-4 font-display text-2xl text-foreground tracking-tight md:text-3xl">
        Página não encontrada
      </h1>
      <p className="mx-auto mt-4 max-w-md font-body text-base text-muted-foreground leading-relaxed">
        A página que procura não existe ou foi movida. Regresse ao início para
        continuar a navegar.
      </p>
      <Link
        className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 font-display text-primary-foreground text-sm uppercase tracking-[0.15em] transition-all hover:brightness-110"
        to="/"
      >
        Voltar ao início
      </Link>
    </div>
  </div>
);

export default NotFound;
