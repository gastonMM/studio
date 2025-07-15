
"use client";

import type { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { deleteProjectAction } from "../actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const result = await deleteProjectAction(id);
    if (result.success) {
      toast({ title: "Proyecto eliminado", description: "El proyecto ha sido eliminado del catálogo." });
      router.refresh(); // Refresh server components
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
        <BookOpen className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-xl font-semibold">Tu catálogo está vacío</h3>
        <p className="mt-2">Guarda tu primera calculación para empezar a construir tu catálogo.</p>
        <Button asChild className="mt-4">
          <Link href="/projects/calculate">Crear Nuevo Proyecto</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="flex flex-col">
          <CardHeader>
            <div className="aspect-[4/3] relative mb-4">
              <Image
                src={project.imageUrl || "https://placehold.co/400x300.png"}
                alt={project.nombreProyecto}
                layout="fill"
                objectFit="cover"
                data-ai-hint="product 3d model"
                className="rounded-lg"
              />
            </div>
            <CardTitle>{project.nombreProyecto}</CardTitle>
             <CardDescription>
                Creado el {new Date(project.fechaCreacion).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Costo Total (Pieza):</span>
              <Badge variant="secondary">
                {project.resultadosCalculados?.costoTotalPieza.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) ?? 'N/A'}
              </Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Precio Venta (Pieza):</span>
               <Badge>
                  {project.resultadosCalculados?.precioVentaSugeridoPieza?.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) ?? 'N/A'}
               </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/projects/edit/${project.id}`} title="Recalcular/Editar">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Recalcular/Editar</span>
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" title="Eliminar">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto del catálogo.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(project.id)}>
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
