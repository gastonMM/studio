



"use client";

import type { Project, Tag } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, BookOpen, Tag as TagIcon } from "lucide-react";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
import { cn } from "@/lib/utils";


interface ProjectListProps {
  projects: Project[];
  allTags: Tag[];
}

export function ProjectList({ projects, allTags }: ProjectListProps) {
  const { toast } = useToast();
  const router = useRouter();

  const getTagColor = (tagName: string) => {
    const tag = allTags.find(t => t.name === tagName);
    return tag?.color;
  };

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
        <h3 className="text-xl font-semibold">No se encontraron proyectos</h3>
        <p className="mt-2">Intenta ajustar tus filtros o guarda un nuevo cálculo.</p>
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
          <CardHeader className="p-0">
             <Carousel className="w-full rounded-t-lg overflow-hidden">
              <CarouselContent>
                {project.imageUrls && project.imageUrls.length > 0 ? (
                  project.imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={url}
                          alt={`${project.nombreProyecto} - Imagen ${index + 1}`}
                          fill
                          className="object-cover"
                          data-ai-hint="product 3d model"
                        />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="aspect-[4/3] relative bg-muted">
                      <Image
                        src="https://placehold.co/400x300.png"
                        alt={project.nombreProyecto}
                        fill
                        className="object-cover"
                        data-ai-hint="product 3d model"
                      />
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              {project.imageUrls && project.imageUrls.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                </>
              )}
            </Carousel>
            <div className="p-6 pb-0">
              <CardTitle>{project.nombreProyecto}</CardTitle>
              <CardDescription>
                  Creado el {new Date(project.fechaCreacion).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-grow space-y-4 px-6 pt-4">
            {project.descripcionProyecto && (
                <p className="text-sm text-muted-foreground italic line-clamp-2">
                    {project.descripcionProyecto}
                </p>
            )}
            <div className="space-y-2">
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
            </div>
            {project.tags && project.tags.length > 0 && (
                <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center"><TagIcon className="w-4 h-4 mr-2 text-muted-foreground"/>Etiquetas</h4>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                            <Badge 
                                key={tag} 
                                className="border-transparent"
                                style={{ 
                                    backgroundColor: getTagColor(tag), 
                                    color: "hsl(var(--primary-foreground))"
                                }}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 p-6 pt-4">
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
