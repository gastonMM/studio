
"use client";

import type { Tag } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Tags } from "lucide-react";
import Link from "next/link";
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
import { deleteTagAction } from "../actions";

interface TagListProps {
  tags: Tag[];
}

export function TagList({ tags }: TagListProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const result = await deleteTagAction(id);
    if (result.success) {
      toast({
        title: "Etiqueta eliminada",
        description: "La etiqueta ha sido eliminada de todos los proyectos.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  if (!tags || tags.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Tags className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-xl font-semibold">No hay etiquetas registradas</h3>
        <p className="mt-2">
          Crea tu primera etiqueta para empezar a organizar tus proyectos.
        </p>
         <Button asChild className="mt-4">
          <Link href="/tags/new">Crear Etiqueta</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre de la Etiqueta</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/tags/edit/${tag.id}`}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará la
                        etiqueta de <strong>todos los proyectos</strong> que la
                        estén utilizando y la eliminará permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(tag.id)}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
