import { MaterialForm } from "../../components/material-form";
// import { fetchMaterialById } from "../../actions"; // Server action to fetch material
import type { Material } from "@/types";

// Mock function for fetching material - replace with actual data fetching
async function getMaterial(id: string): Promise<Material | undefined> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  if (id === "1") {
    return { id: "1", nombreMaterial: "PLA Blanco Económico", costoPorKg: 15000, pesoSpoolCompradoGramos: 1000, densidad: 1.24, diametro: 1.75, fechaUltimaActualizacionCosto: new Date(), urlProducto: "https://www.mercadolibre.com.ar/pla-blanco" };
  }
  return undefined;
}


export default async function EditMaterialPage({ params }: { params: { id: string } }) {
  // const material = await fetchMaterialById(params.id);
  const material = await getMaterial(params.id);

  if (!material) {
    return <div className="container mx-auto py-8 text-center">Material no encontrado.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <MaterialForm material={material} />
    </div>
  );
}
