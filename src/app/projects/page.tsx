import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SavedProjectsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Proyectos Guardados</h1>
        <Button asChild>
          <Link href="/projects/calculate">
            <PlusCircle className="mr-2 h-4 w-4" /> Nueva Calculación
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-6 w-6 text-primary" />
            Historial de Cálculos
          </CardTitle>
          <CardDescription>
            Revisa, recalcula, duplica o elimina tus proyectos y cálculos guardados.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Image 
                src="https://picsum.photos/600/300" 
                alt="Project files and folders" 
                width={600}
                height={300}
                data-ai-hint="documents files"
                className="rounded-md mb-6 inline-block"
            />
          <h2 className="text-2xl font-semibold text-muted-foreground">Próximamente</h2>
          <p className="mt-2 text-muted-foreground">
            La funcionalidad para listar y gestionar proyectos guardados estará disponible en una futura actualización.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
