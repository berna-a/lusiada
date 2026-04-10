import { useParams } from "react-router-dom";
import { PlaceholderPage } from "@/components/PlaceholderPage";
export default function LugarPage() {
  const { id } = useParams();
  return <PlaceholderPage title={`Lugar: ${id}`} description="Página individual de lugar." />;
}
