import { fetchProjectById } from "../../actions";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EditProjectForm from "./edit-project-form";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await fetchProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 space-y-4">
      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">Editando un Proyecto Existente</CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Estás viendo los datos de un cálculo guardado. Si has actualizado el precio de algún material o tarifa eléctrica recientemente, presiona el botón <strong>&quot;Calcular Costos&quot;</strong> para ver el impacto en los resultados con los valores más recientes.
          </CardDescription>
        </CardHeader>
      </Card>
      <EditProjectForm project={project} />
    </div>
  );
}
