import { BookOpen } from "lucide-react";
import { EmBreve } from "@/components/arca/EmBreve";

export default function MemoriasPage() {
  return (
    <EmBreve
      detail="Em breve poderá depositar e partilhar memórias — relatos, documentos e testemunhos de família — para que nenhuma história se perca no esquecimento."
      icon={BookOpen}
      intro="Os relatos e testemunhos vivos da nossa gente."
      title="Memórias"
    />
  );
}
