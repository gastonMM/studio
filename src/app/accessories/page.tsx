import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Wrench } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AccessoriesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Accesorios</h1>
        <Button asChild disabled>
          <Link href="/accessories/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Accesorio (Próximamente)
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="mr-2 h-6 w-6 text-primary" />
            Módulo de Accesorios
          </CardTitle>
          <CardDescription>
            Administra los componentes adicionales para tus proyectos de impresión 3D, como tornillos, imanes, pinturas, etc.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
            <Image 
                src="https://picsum.photos/600/300" 
                alt="Accessories for 3D printing" 
                width={600}
                height={300}
                data-ai-hint="tools parts"
                className="rounded-md mb-6 inline-block"
            />
          <h2 className="text-2xl font-semibold text-muted-foreground">Próximamente</h2>
          <p className="mt-2 text-muted-foreground">
            La funcionalidad completa para la gestión de accesorios estará disponible en una futura actualización.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
