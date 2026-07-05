import { useParams } from "react-router-dom";
import { PlaceholderPage } from "@/components/PlaceholderPage";
export default function LugarPage() {
  const { id } = useParams();
  return (
    <PlaceholderPage
      description="Página individual de lugar."
      title={`Lugar: ${id}`}
    />
  );
}
