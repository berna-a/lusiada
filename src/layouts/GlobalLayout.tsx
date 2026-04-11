import { Outlet } from "react-router-dom";
import { InstitutionalNavbar } from "@/components/InstitutionalNavbar";
import { ArcaSidebar } from "@/components/ArcaSidebar";
import { Footer } from "@/components/Footer";

export function GlobalLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <InstitutionalNavbar />
      <div className="flex flex-1">
        <ArcaSidebar />
        <main className="flex-1 p-6 md:p-10">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
