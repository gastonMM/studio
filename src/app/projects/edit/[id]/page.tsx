import { fetchProjectById } from "../../actions";
import { notFound } from "next/navigation";
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'


const CalculateProjectForm = dynamic(() => import('../calculate/components/calculate-form').then(mod => mod.CalculateProjectForm), { 
  ssr: false,
  loading: () => <CalculatorFormSkeleton />,
});


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
      <CalculateProjectForm projectToEdit={project} />
    </div>
  );
}

function CalculatorFormSkeleton() {
  return (
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto y Parámetros</CardTitle>
            <CardDescription>Cargando formulario de cálculo...</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-40 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
             <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
           <CardHeader>
              <CardTitle>Resultados del Cálculo</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
            <CardFooter className="flex-col space-y-2 items-stretch">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardFooter>
        </Card>
      </div>
    </div>
  )
}
