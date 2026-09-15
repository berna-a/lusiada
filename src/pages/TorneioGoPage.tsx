import InscricaoEvento from "@/pages/InscricaoEvento";
import TorneioEventPage from "@/pages/TorneioEventPage";

export default function TorneioGoPage() {
  return (
    <TorneioEventPage
      event={{
        caminho: "/go",
        descricao:
          "Evento de Go / Igo / Baduk da Associação Memória Lusíada: 24 de Outubro de 2026, na Biblioteca de Marvila.",
        imagemCartaz: "/eventos-marvila/go-qtrack.jpg",
        imagemSocial: "/eventos-marvila/go-story.jpg",
        interesse: "#inscricao",
        modalidade: "Go · Igo · Baduk",
        nome: "Evento de Go",
        preço: "Entrada livre",
        programa: [
          { hora: "15h30–18h30", titulo: "Convívio, ensino e explicação" },
          { hora: "18h30–20h", titulo: "Torneio suíço" },
          { hora: "20h", titulo: "Medalhas" },
        ],
        subtitulo: "Uma tarde para conhecer, aprender e jogar Go.",
        textoInteresse: "Inscrever-me",
        tituloSeo: "Evento de Go / Igo / Baduk — LUSÍADA",
      }}
    >
      <InscricaoEvento evento="Evento de Go" modalidade="Go · Igo · Baduk" />
    </TorneioEventPage>
  );
}
