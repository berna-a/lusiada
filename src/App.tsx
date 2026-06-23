import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { GlobalLayout } from "@/layouts/GlobalLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { SitePreferencesProvider } from "@/contexts/SitePreferencesContext";

import HomePage from "@/pages/HomePage";
import AssociacaoPage from "@/pages/AssociacaoPage";
import ProgramaPage from "@/pages/ProgramaPage";
import ApoiarPage from "@/pages/ApoiarPage";
import ContactosPage from "@/pages/ContactosPage";
import AderirPage from "@/pages/AderirPage";
import MinhaContaPage from "@/pages/MinhaContaPage";
import MembrosPage from "@/pages/MembrosPage";
import ManifestoPage from "@/pages/sobre/ManifestoPage";
import ObjectivosPage from "@/pages/sobre/ObjectivosPage";

import ArcaPage from "@/pages/arca/ArcaPage";
import PanteaoPage from "@/pages/arca/PanteaoPage";
import LusopediaPage from "@/pages/arca/LusopediaPage";
import ArtigoPage from "@/pages/arca/ArtigoPage";
import NovoArtigoPage from "@/pages/arca/NovoArtigoPage";
import EditarArtigoPage from "@/pages/arca/EditarArtigoPage";
import CalendarioPage from "@/pages/arca/CalendarioPage";
import HeroiPage from "@/pages/arca/HeroiPage";
import LugaresPage from "@/pages/arca/LugaresPage";
import LugarPage from "@/pages/arca/LugarPage";
import MemoriasPage from "@/pages/arca/MemoriasPage";
import ColeccoesPage from "@/pages/arca/ColeccoesPage";
import DicionarioPage from "@/pages/dicionario/DicionarioPage";
import PalavraPage from "@/pages/dicionario/PalavraPage";
import InicioPage from "@/pages/lusiadas/InicioPage";
import OsLusiadasPage from "@/pages/lusiadas/OsLusiadasPage";
import PlanoPage from "@/pages/lusiadas/PlanoPage";
import ProcurarPage from "@/pages/lusiadas/ProcurarPage";
import ExplorarPage from "@/pages/lusiadas/ExplorarPage";
import PerfilPage from "@/pages/lusiadas/PerfilPage";
import ComunidadePage from "@/pages/lusiadas/ComunidadePage";
import ViagemPage from "@/pages/lusiadas/ViagemPage";

import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminDefinicoesPage from "@/pages/admin/AdminDefinicoesPage";
import AdminModeracaoPage from "@/pages/admin/AdminModeracaoPage";
import AdminSociosPage from "@/pages/admin/AdminSociosPage";
import AdminLusopediaPage from "@/pages/admin/AdminLusopediaPage";

import NotFound from "@/pages/NotFound";
import { PlaceholderPage } from "@/components/PlaceholderPage";

const queryClient = new QueryClient();

/** Na raiz, o domínio oslusiadas.pt abre directo na obra; o resto, a homepage. */
function RootRoute() {
  const isLusiadasDomain =
    typeof window !== "undefined" &&
    /(^|\.)oslusiadas\.pt$/i.test(window.location.hostname);
  return isLusiadasDomain ? <InicioPage /> : <HomePage />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SitePreferencesProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Global layout — dual navigation on all pages */}
          <Route element={<GlobalLayout />}>
            <Route path="/" element={<RootRoute />} />
            {/* oslusiadas.pt — atalhos de canto na raiz do domínio dedicado */}
            <Route path="/canto/:n" element={<OsLusiadasPage />} />
            <Route path="/associacao" element={<AssociacaoPage />} />
            <Route path="/programa" element={<ProgramaPage />} />
            <Route path="/apoiar" element={<ApoiarPage />} />
            <Route path="/contactos" element={<ContactosPage />} />
            <Route path="/aderir" element={<AderirPage />} />
            <Route path="/conta" element={<MinhaContaPage />} />
            <Route path="/membros" element={<MembrosPage />} />
            <Route path="/sobre/manifesto" element={<ManifestoPage />} />
            {/* Homepage navbar/footer aliases — point to existing pages */}
            <Route path="/a-associacao" element={<AssociacaoPage />} />
            <Route path="/contacto" element={<ContactosPage />} />
            <Route path="/panteao" element={<PanteaoPage />} />
            <Route path="/arca" element={<ArcaPage />} />
            <Route path="/arca/panteao" element={<PanteaoPage />} />
            <Route path="/arca/calendario" element={<CalendarioPage />} />
            <Route path="/arca/herois" element={<PanteaoPage />} />
            <Route path="/arca/herois/:id" element={<HeroiPage />} />
            <Route path="/arca/lusopedia" element={<LusopediaPage />} />
            <Route path="/arca/lusopedia/novo" element={<NovoArtigoPage />} />
            <Route path="/arca/lusopedia/:slug" element={<ArtigoPage />} />
            <Route path="/arca/lusopedia/:slug/editar" element={<EditarArtigoPage />} />
            <Route path="/dicionario" element={<DicionarioPage />} />
            <Route path="/dicionario/:slug" element={<PalavraPage />} />
            <Route path="/os-lusiadas" element={<OsLusiadasPage />} />
            <Route path="/os-lusiadas/canto/:n" element={<OsLusiadasPage />} />
            <Route path="/os-lusiadas/plano" element={<PlanoPage />} />
            <Route path="/plano" element={<PlanoPage />} />
            <Route path="/os-lusiadas/viagem" element={<ViagemPage />} />
            <Route path="/viagem" element={<ViagemPage />} />
            <Route path="/os-lusiadas/procurar" element={<ProcurarPage />} />
            <Route path="/procurar" element={<ProcurarPage />} />
            <Route path="/os-lusiadas/explorar" element={<ExplorarPage />} />
            <Route path="/explorar" element={<ExplorarPage />} />
            <Route path="/os-lusiadas/perfil" element={<PerfilPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/os-lusiadas/comunidade" element={<ComunidadePage />} />
            <Route path="/comunidade" element={<ComunidadePage />} />
            <Route path="/arca/lugares" element={<LugaresPage />} />
            <Route path="/arca/lugares/:id" element={<LugarPage />} />
            <Route path="/arca/memorias" element={<MemoriasPage />} />
            <Route path="/arca/coleccoes" element={<ColeccoesPage />} />
            {/* Obras — páginas dedicadas a livros */}
            <Route path="/obras/os-lusiadas" element={<PlaceholderPage title="Os Lusíadas" description="Página dedicada à obra de Luís de Camões." />} />
            <Route path="/obras/a-mensagem" element={<PlaceholderPage title="A Mensagem" description="Página dedicada à obra de Fernando Pessoa." />} />
            <Route path="/obras/sermao-de-santo-antonio" element={<PlaceholderPage title="Sermão de Santo António aos Peixes" description="Página dedicada à obra do Padre António Vieira." />} />

            {/* Destinos de navegação — placeholders enquanto o conteúdo é preparado */}
            <Route path="/arca/obras" element={<PlaceholderPage title="Obras" description="O cânone literário lusíada." />} />
            <Route path="/programa/agenda" element={<PlaceholderPage title="Agenda" description="Próximos eventos da Associação." />} />
            <Route path="/programa/iniciativas" element={<PlaceholderPage title="Iniciativas" description="As nossas linhas de acção." />} />
            <Route path="/programa/blogue" element={<PlaceholderPage title="Blogue" description="Crónicas e ensaios." />} />
            <Route path="/sobre/associacao" element={<AssociacaoPage />} />
            <Route path="/sobre/objectivos" element={<ObjectivosPage />} />
            <Route path="/estatutos" element={<PlaceholderPage title="Estatutos" description="Os estatutos da Associação Memória Lusíada." />} />
            <Route path="/encontros" element={<PlaceholderPage title="Encontros" description="Os encontros e tertúlias da Associação." />} />
            <Route path="/privacidade" element={<PlaceholderPage title="Política de Privacidade" description="Em preparação." />} />
            <Route path="/termos" element={<PlaceholderPage title="Termos e Condições" description="Em preparação." />} />
          </Route>

          {/* Admin layout */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/socios" element={<AdminSociosPage />} />
            <Route path="/admin/lusopedia" element={<AdminLusopediaPage />} />
            <Route path="/admin/moderacao" element={<AdminModeracaoPage />} />
            <Route path="/admin/definicoes" element={<AdminDefinicoesPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </SitePreferencesProvider>
  </QueryClientProvider>
);

export default App;
