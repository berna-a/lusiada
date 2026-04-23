import { Outlet, useLocation } from "react-router-dom";
import { InstitutionalNavbar } from "@/components/InstitutionalNavbar";
import { ArcaSidebar } from "@/components/ArcaSidebar";
import { Footer } from "@/components/Footer";

export function GlobalLayout() {
  const { pathname } = useLocation();
  // Homepage renders its own full-bleed sections, sidebar and footer.
  const isHome = pathname === "/";
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 relative">
        <InstitutionalNavbar />
        {!isHome && <ArcaSidebar />}
        <main className={`flex-1 min-w-0 ${isHome ? "" : "p-4 sm:p-6 md:p-10"}`}>
          <Outlet />
        </main>
      </div>
      {!isHome && <Footer />}
    </div>
  );
}
