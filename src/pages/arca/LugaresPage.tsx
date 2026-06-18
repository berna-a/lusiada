import { MapPin } from "lucide-react";
import { EmBreve } from "@/components/arca/EmBreve";

export default function LugaresPage() {
  return (
    <EmBreve
      detail="Estamos a cartografar os lugares onde Portugal aconteceu — cidades, monumentos e memórias do território — para que cada um possa percorrer a geografia da sua própria história."
      icon={MapPin}
      intro="Os lugares de memória que dão corpo à nossa história."
      title="Lugares"
    />
  );
}
