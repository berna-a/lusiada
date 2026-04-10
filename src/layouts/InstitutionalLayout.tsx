import { Outlet } from "react-router-dom";
import { InstitutionalNavbar } from "@/components/InstitutionalNavbar";
import { Footer } from "@/components/Footer";

export function InstitutionalLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <InstitutionalNavbar />
      <main className="flex-1 pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
