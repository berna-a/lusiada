import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SitePreferencesProvider } from "@/contexts/SitePreferencesContext";
import { AdminLayout } from "@/layouts/AdminLayout";
import { GlobalLayout } from "@/layouts/GlobalLayout";
import AderirPage from "@/pages/AderirPage";
import ApoiarPage from "@/pages/ApoiarPage";
import AssociacaoPage from "@/pages/AssociacaoPage";
import AzulejoPortuguesPage from "@/pages/AzulejoPortuguesPage";
import AzulejosPage from "@/pages/AzulejosPage";
import AdminAzulejosPage from "@/pages/admin/AdminAzulejosPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminDefinicoesPage from "@/pages/admin/AdminDefinicoesPage";
import AdminLusopediaPage from "@/pages/admin/AdminLusopediaPage";
import AdminModeracaoPage from "@/pages/admin/AdminModeracaoPage";
import AdminPortalPage from "@/pages/admin/AdminPortalPage";
import AdminSociosPage from "@/pages/admin/AdminSociosPage";
import ArcaPage from "@/pages/arca/ArcaPage";
import ArtigoPage from "@/pages/arca/ArtigoPage";
import CalendarioPage from "@/pages/arca/CalendarioPage";
import ColeccoesPage from "@/pages/arca/ColeccoesPage";
import EditarArtigoPage from "@/pages/arca/EditarArtigoPage";
import HeroiPage from "@/pages/arca/HeroiPage";
import LugarPage from "@/pages/arca/LugarPage";
import LusopediaPage from "@/pages/arca/LusopediaPage";
import MemoriasPage from "@/pages/arca/MemoriasPage";
import NovoArtigoPage from "@/pages/arca/NovoArtigoPage";
import PanteaoPage from "@/pages/arca/PanteaoPage";
import AzulejoPage from "@/pages/azulejos/AzulejoPage";
import RegistarAzulejoPage from "@/pages/azulejos/RegistarAzulejoPage";
import ContactosPage from "@/pages/ContactosPage";
import BemVindoPage from "@/pages/conta/BemVindoPage";
import CallbackAos from "@/pages/conta/CallbackAos";
import EntrarPage from "@/pages/conta/EntrarPage";
import ContaPerfilPage from "@/pages/conta/PerfilPage";
import PerfilPublicoPage from "@/pages/conta/PerfilPublicoPage";
import DesportoPage from "@/pages/DesportoPage";
import DicionarioPage from "@/pages/dicionario/DicionarioPage";
import PalavraPage from "@/pages/dicionario/PalavraPage";
import HomePage from "@/pages/HomePage";
import ComunidadePage from "@/pages/lusiadas/ComunidadePage";
import DecifradosPage from "@/pages/lusiadas/DecifradosPage";
import EpisodiosPage, { EpisodioPage } from "@/pages/lusiadas/EpisodiosPage";
import ExplorarPage from "@/pages/lusiadas/ExplorarPage";
import InicioPage from "@/pages/lusiadas/InicioPage";
import OsLusiadasPage from "@/pages/lusiadas/OsLusiadasPage";
import PerfilPage from "@/pages/lusiadas/PerfilPage";
import PerguntasPage from "@/pages/lusiadas/PerguntasPage";
import PlanoPage from "@/pages/lusiadas/PlanoPage";
import ProcurarPage from "@/pages/lusiadas/ProcurarPage";
import TemasTesePage from "@/pages/lusiadas/TemasTesePage";
import ViagemPage from "@/pages/lusiadas/ViagemPage";
import MembrosPage from "@/pages/MembrosPage";
import MinhaContaPage from "@/pages/MinhaContaPage";
import NotFound from "@/pages/NotFound";
import ProgramaPage from "@/pages/ProgramaPage";
import ManifestoPage from "@/pages/sobre/ManifestoPage";
import ObjectivosPage from "@/pages/sobre/ObjectivosPage";
import PrivacidadePage from "@/pages/sobre/PrivacidadePage";
import TermosPage from "@/pages/sobre/TermosPage";

const queryClient = new QueryClient();

/** Os endereços antigos `/u/nome` continuam a levar ao sítio certo. */
function PerfilAntigoRedireccionado() {
  const { handle } = useParams<{ handle: string }>();
  return <Navigate replace to={`/${handle ?? ""}`} />;
}

const RE_OSLUSIADAS = /(^|\.)oslusiadas\.pt$/i;

/** Na raiz, o domínio oslusiadas.pt abre directo na obra; o resto, a homepage. */
function RootRoute() {
  const isLusiadasDomain =
    typeof window !== "undefined" &&
    RE_OSLUSIADAS.test(window.location.hostname);
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
            {/* Azulejos — aplicação de ecrã inteiro, sem a moldura do site.
                O mapa é a interface; a navegação vai na barra de vidro. */}
            <Route element={<AzulejosPage />} path="/mapa" />
            <Route element={<AzulejosPage />} path="/mapa/:coleccao" />
            <Route
              element={<RegistarAzulejoPage />}
              path="/azulejos/registar"
            />
            <Route element={<AzulejoPage />} path="/azulejos/:id" />

            {/* Global layout — dual navigation on all pages */}
            <Route element={<GlobalLayout />}>
              <Route element={<RootRoute />} path="/" />
              {/* oslusiadas.pt — atalhos de canto na raiz do domínio dedicado */}
              <Route element={<OsLusiadasPage />} path="/canto/:n" />
              <Route element={<AssociacaoPage />} path="/associacao" />
              <Route element={<ProgramaPage />} path="/programa" />
              <Route element={<DesportoPage />} path="/desporto" />
              <Route element={<DesportoPage />} path="/programa/desporto" />
              <Route element={<ApoiarPage />} path="/apoiar" />
              <Route element={<ContactosPage />} path="/contactos" />
              <Route element={<AderirPage />} path="/aderir" />
              <Route element={<MinhaContaPage />} path="/conta" />
              {/* Contas: entrar, criar, boas-vindas, perfil próprio e público. */}
              <Route
                element={<EntrarPage modoInicial="entrar" />}
                path="/entrar"
              />
              <Route
                element={<EntrarPage modoInicial="criar" />}
                path="/criar-conta"
              />
              <Route element={<CallbackAos />} path="/conta/callback" />
              <Route element={<BemVindoPage />} path="/bem-vindo" />
              <Route element={<ContaPerfilPage />} path="/perfil" />
              <Route
                element={<PerfilAntigoRedireccionado />}
                path="/u/:handle"
              />
              <Route element={<MembrosPage />} path="/membros" />
              <Route element={<ManifestoPage />} path="/sobre/manifesto" />
              {/* Homepage navbar/footer aliases — point to existing pages */}
              <Route element={<AssociacaoPage />} path="/a-associacao" />
              <Route element={<ContactosPage />} path="/contacto" />
              <Route element={<PanteaoPage />} path="/panteao" />
              <Route element={<ArcaPage />} path="/arca" />
              <Route element={<PanteaoPage />} path="/arca/panteao" />
              <Route element={<CalendarioPage />} path="/arca/calendario" />
              <Route element={<PanteaoPage />} path="/arca/herois" />
              <Route element={<HeroiPage />} path="/arca/herois/:id" />
              <Route element={<LusopediaPage />} path="/arca/lusopedia" />
              <Route element={<NovoArtigoPage />} path="/arca/lusopedia/novo" />
              <Route element={<ArtigoPage />} path="/arca/lusopedia/:slug" />
              <Route
                element={<EditarArtigoPage />}
                path="/arca/lusopedia/:slug/editar"
              />
              <Route element={<DicionarioPage />} path="/dicionario" />
              <Route element={<PalavraPage />} path="/dicionario/:slug" />
              <Route element={<OsLusiadasPage />} path="/os-lusiadas" />
              <Route
                element={<OsLusiadasPage />}
                path="/os-lusiadas/canto/:n"
              />
              <Route element={<PlanoPage />} path="/os-lusiadas/plano" />
              <Route element={<PlanoPage />} path="/plano" />
              <Route
                element={<DecifradosPage />}
                path="/os-lusiadas/decifrados"
              />
              <Route element={<DecifradosPage />} path="/decifrados" />
              <Route
                element={<DecifradosPage />}
                path="/os-lusiadas-decifrados"
              />
              <Route
                element={<TemasTesePage />}
                path="/os-lusiadas/decifrados/temas-de-tese"
              />
              <Route
                element={<TemasTesePage />}
                path="/decifrados/temas-de-tese"
              />
              <Route
                element={<PerguntasPage />}
                path="/os-lusiadas/perguntas"
              />
              <Route element={<PerguntasPage />} path="/perguntas" />
              <Route
                element={<EpisodiosPage />}
                path="/os-lusiadas/episodios"
              />
              <Route element={<EpisodiosPage />} path="/episodios" />
              <Route
                element={<EpisodioPage />}
                path="/os-lusiadas/episodios/:slug"
              />
              <Route element={<EpisodioPage />} path="/episodios/:slug" />
              <Route element={<ViagemPage />} path="/os-lusiadas/viagem" />
              <Route element={<ViagemPage />} path="/viagem" />
              <Route element={<ProcurarPage />} path="/os-lusiadas/procurar" />
              <Route element={<ProcurarPage />} path="/procurar" />
              <Route element={<ExplorarPage />} path="/os-lusiadas/explorar" />
              <Route element={<ExplorarPage />} path="/explorar" />
              <Route element={<PerfilPage />} path="/os-lusiadas/perfil" />
              <Route element={<ContaPerfilPage />} path="/perfil" />
              <Route
                element={<ComunidadePage />}
                path="/os-lusiadas/comunidade"
              />
              <Route element={<ComunidadePage />} path="/comunidade" />
              {/* Os lugares deixaram de ser uma lista à espera de conteúdo:
                  são o mapa. */}
              <Route
                element={<Navigate replace to="/mapa" />}
                path="/arca/lugares"
              />
              <Route element={<LugarPage />} path="/arca/lugares/:id" />
              <Route element={<MemoriasPage />} path="/arca/memorias" />
              <Route element={<ColeccoesPage />} path="/arca/coleccoes" />
              {/* Obras — páginas dedicadas a livros */}
              <Route
                element={
                  <PlaceholderPage
                    description="Página dedicada à obra de Luís de Camões."
                    title="Os Lusíadas"
                  />
                }
                path="/obras/os-lusiadas"
              />
              <Route
                element={
                  <PlaceholderPage
                    description="Página dedicada à obra de Fernando Pessoa."
                    title="A Mensagem"
                  />
                }
                path="/obras/a-mensagem"
              />
              <Route
                element={
                  <PlaceholderPage
                    description="Página dedicada à obra do Padre António Vieira."
                    title="Sermão de Santo António aos Peixes"
                  />
                }
                path="/obras/sermao-de-santo-antonio-aos-peixes"
              />

              {/* Destinos de navegação — placeholders enquanto o conteúdo é preparado */}
              <Route
                element={
                  <PlaceholderPage
                    description="O cânone literário lusíada."
                    title="Obras"
                  />
                }
                path="/arca/obras"
              />
              <Route
                element={
                  <PlaceholderPage
                    description="Próximos eventos da Associação."
                    title="Agenda"
                  />
                }
                path="/programa/agenda"
              />
              <Route
                element={
                  <PlaceholderPage
                    description="As nossas linhas de acção."
                    title="Iniciativas"
                  />
                }
                path="/programa/iniciativas"
              />
              <Route
                element={
                  <PlaceholderPage
                    description="Crónicas e ensaios."
                    title="Blogue"
                  />
                }
                path="/programa/blogue"
              />
              <Route element={<AssociacaoPage />} path="/sobre/associacao" />
              <Route element={<ObjectivosPage />} path="/sobre/objectivos" />
              <Route
                element={
                  <PlaceholderPage
                    description="Os estatutos da Associação Memória Lusíada."
                    title="Estatutos"
                  />
                }
                path="/sobre/estatutos"
              />
              <Route
                element={
                  <PlaceholderPage
                    description="Os encontros e tertúlias da Associação."
                    title="Encontros"
                  />
                }
                path="/programa/encontros"
              />
              <Route element={<AzulejoPortuguesPage />} path="/azulejos" />
              <Route element={<PrivacidadePage />} path="/privacidade" />
              <Route element={<TermosPage />} path="/termos" />
              {/*
                O perfil de uma pessoa mora à cabeça do site: alusiada.pt/nome.
                Fica em último de propósito — o React Router prefere sempre uma
                rota escrita por extenso a esta, por isso nenhuma página da casa
                lhe é roubada. Os nomes que colidiriam estão reservados em
                `convex/perfis.ts` e não podem ser escolhidos por ninguém.
              */}
              <Route element={<PerfilPublicoPage />} path="/:handle" />
            </Route>

            {/* Admin layout */}
            <Route element={<AdminLayout />}>
              <Route element={<AdminDashboardPage />} path="/admin" />
              <Route element={<AdminSociosPage />} path="/admin/socios" />
              <Route element={<AdminLusopediaPage />} path="/admin/lusopedia" />
              <Route element={<AdminModeracaoPage />} path="/admin/moderacao" />
              <Route element={<AdminAzulejosPage />} path="/admin/azulejos" />
              <Route element={<AdminPortalPage />} path="/admin/portal" />
              <Route
                element={<AdminDefinicoesPage />}
                path="/admin/definicoes"
              />
            </Route>

            <Route element={<NotFound />} path="*" />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SitePreferencesProvider>
  </QueryClientProvider>
);

export default App;
