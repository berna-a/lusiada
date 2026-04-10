import { useParams } from "react-router-dom";
import { PlaceholderPage } from "@/components/PlaceholderPage";
export default function HeroiPage() {
  const { id } = useParams();
  return <PlaceholderPage title={`Herói: ${id}`} description="Página individual de herói." />;
}
