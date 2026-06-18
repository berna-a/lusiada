import { FolderOpen } from "lucide-react";
import { EmBreve } from "@/components/arca/EmBreve";

export default function ColeccoesPage() {
  return (
    <EmBreve
      detail="Acervos temáticos curados com rigor — reunindo figuras, lugares, obras e memórias em torno dos grandes fios da história lusófona."
      icon={FolderOpen}
      intro="Os acervos temáticos que organizam o arquivo."
      title="Colecções"
    />
  );
}
