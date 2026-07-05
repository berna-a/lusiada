import { Outlet, useLocation } from "react-router-dom";
import { ArcaSidebar } from "@/components/ArcaSidebar";
import { Footer } from "@/components/Footer";
import { InstitutionalNavbar } from "@/components/InstitutionalNavbar";
import { LusiadasNavbar } from "@/components/lusiadas/LusiadasNavbar";
import { isLusiadasHost } from "@/lib/lusiadas/nav";

export function GlobalLayout() {
  const { pathname } = useLocation();
  // Homepage renders its own full-bleed sections, sidebar and footer.
  const isHome = pathname === "/";
  // Domínio dedicado oslusiadas.pt — navegação própria, sem sidebar/footer da alusiada.
  const isLusiadas = isLusiadasHost();
  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative flex flex-1">
        {isLusiadas ? <LusiadasNavbar /> : <InstitutionalNavbar />}
        {!(isHome || isLusiadas) && <ArcaSidebar />}
        <main
          className={`min-w-0 flex-1 ${isHome || isLusiadas ? "" : "p-4 sm:p-6 md:p-10"}`}
        >
          <Outlet />
        </main>
      </div>
      {!(isHome || isLusiadas) && <Footer />}
    </div>
  );
}
