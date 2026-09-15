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
        interesse:
          "mailto:bernardo@alusiada.pt?subject=Evento%20de%20Go%20%E2%80%94%2024%20de%20Outubro%20de%202026",
        modalidade: "Go · Igo · Baduk",
        nome: "Evento de Go",
        preço: "Entrada livre",
        programa: [
          { hora: "15h30–18h30", titulo: "Convívio, ensino e explicação" },
          { hora: "18h30–20h", titulo: "Torneio suíço" },
          { hora: "20h", titulo: "Medalhas" },
        ],
        subtitulo: "Uma tarde para conhecer, aprender e jogar Go.",
        tituloSeo: "Evento de Go / Igo / Baduk — LUSÍADA",
      }}
    />
  );
}
