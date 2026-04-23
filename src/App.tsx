import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { GlobalLayout } from "@/layouts/GlobalLayout";
import { AdminLayout } from "@/layouts/AdminLayout";

import HomePage from "@/pages/HomePage";
import AssociacaoPage from "@/pages/AssociacaoPage";
import ProgramaPage from "@/pages/ProgramaPage";
import ApoiarPage from "@/pages/ApoiarPage";
import ContactosPage from "@/pages/ContactosPage";
import AderirPage from "@/pages/AderirPage";

import ArcaPage from "@/pages/arca/ArcaPage";
import PanteaoPage from "@/pages/arca/PanteaoPage";
import CalendarioPage from "@/pages/arca/CalendarioPage";
import HeroisPage from "@/pages/arca/HeroisPage";
import HeroiPage from "@/pages/arca/HeroiPage";
import LugaresPage from "@/pages/arca/LugaresPage";
import LugarPage from "@/pages/arca/LugarPage";
import MemoriasPage from "@/pages/arca/MemoriasPage";
import ColeccoesPage from "@/pages/arca/ColeccoesPage";

import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminDefinicoesPage from "@/pages/admin/AdminDefinicoesPage";

import NotFound from "@/pages/NotFound";
import SupabaseTestPage from "@/pages/SupabaseTestPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Global layout — dual navigation on all pages */}
          <Route element={<GlobalLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/associacao" element={<AssociacaoPage />} />
            <Route path="/programa" element={<ProgramaPage />} />
            <Route path="/apoiar" element={<ApoiarPage />} />
            <Route path="/contactos" element={<ContactosPage />} />
            <Route path="/aderir" element={<AderirPage />} />
            <Route path="/arca" element={<ArcaPage />} />
            <Route path="/arca/panteao" element={<PanteaoPage />} />
            <Route path="/arca/calendario" element={<CalendarioPage />} />
            <Route path="/arca/herois" element={<HeroisPage />} />
            <Route path="/arca/herois/:id" element={<HeroiPage />} />
            <Route path="/arca/lugares" element={<LugaresPage />} />
            <Route path="/arca/lugares/:id" element={<LugarPage />} />
            <Route path="/arca/memorias" element={<MemoriasPage />} />
            <Route path="/arca/coleccoes" element={<ColeccoesPage />} />
          </Route>

          {/* Admin layout */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/definicoes" element={<AdminDefinicoesPage />} />
          </Route>

          <Route path="/supabase-test" element={<SupabaseTestPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
