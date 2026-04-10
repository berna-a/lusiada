import { Outlet } from "react-router-dom";
import { ArcaSidebar } from "@/components/ArcaSidebar";

export function ArcaLayout() {
  return (
    <div className="min-h-screen flex">
      <ArcaSidebar />
      <main className="flex-1 p-6 md:p-10 ml-14">
        <Outlet />
      </main>
    </div>
  );
}
