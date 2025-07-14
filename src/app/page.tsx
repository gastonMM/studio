import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, DollarSign, Layers, Package, Printer, Users } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard - Calculadora Costos 3D Pro</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 esta semana
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materiales Registrados</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              PLA, PETG, ABS, Resina, TPU
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfiles de Impresora</CardTitle>
            <Printer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Ender 3 Pro, Prusa MK3S+
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenido a Calculadora Costos 3D Pro</CardTitle>
            <CardDescription>
              Optimiza tus costos de impresión 3D y maximiza tus ganancias.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Esta herramienta te permite gestionar tus materiales, accesorios, y configuraciones de impresora para calcular con precisión el costo de cada pieza impresa.
            </p>
            <p>
              Utiliza el menú de la izquierda para navegar por las diferentes secciones:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><span className="font-semibold">Materiales:</span> Administra tus filamentos y resinas.</li>
              <li><span className="font-semibold">Accesorios:</span> Gestiona componentes adicionales.</li>
              <li><span className="font-semibold">Perfiles Impresora:</span> Configura los parámetros de tus impresoras.</li>
              <li><span className="font-semibold">Nueva Calculación:</span> Estima el costo de un nuevo proyecto.</li>
              <li><span className="font-semibold">Proyectos Guardados:</span> Revisa tus cálculos anteriores.</li>
            </ul>
             <div className="aspect-video relative rounded-md overflow-hidden">
              <Image 
                src="https://placehold.co/800x450.png" 
                alt="3D Printer in action" 
                layout="fill"
                objectFit="cover"
                data-ai-hint="3D printer workshop"
                className="rounded-md"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Próximas Funcionalidades</CardTitle>
            <CardDescription>
              Estamos trabajando para mejorar tu experiencia.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Image 
                src="https://placehold.co/800x400.png" 
                alt="Future features concept" 
                width={800}
                height={400}
                data-ai-hint="blueprint technology"
                className="rounded-md mb-4"
              />
            <ul className="list-disc list-inside space-y-2">
              <li>Integración con Slicers populares.</li>
              <li>Reportes de costos avanzados.</li>
              <li>Gestión de inventario de materiales.</li>
              <li>Comparación de costos entre perfiles de impresora.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
