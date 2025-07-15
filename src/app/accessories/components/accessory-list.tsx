
"use client";

import type { Accessory } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink, Wrench } from "lucide-react";
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
import { deleteAccessoryAction } from "../actions";

interface AccessoryListProps {
  accessories: Accessory[];
}

export function AccessoryList({ accessories }: AccessoryListProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const result = await deleteAccessoryAction(id);
    if (result.success) {
      toast({ title: "Accesorio eliminado", description: "El accesorio ha sido eliminado correctamente." });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  if (!accessories || accessories.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Wrench className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-xl font-semibold">No hay accesorios registrados</h3>
        <p className="mt-2">Empieza agregando tu primer accesorio.</p>
        <Button asChild className="mt-4">
          <Link href="/accessories/new">Agregar Accesorio</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Costo/Unidad (ARS)</TableHead>
            <TableHead>Unidades/Paquete</TableHead>
            <TableHead>URL Producto</TableHead>
            <TableHead>Últ. Act.</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accessories.map((accessory) => (
            <TableRow key={accessory.id}>
              <TableCell className="font-medium">{accessory.nombreAccesorio}</TableCell>
              <TableCell>{accessory.costoPorUnidad.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</TableCell>
              <TableCell>{accessory.unidadesPorPaqueteEnLink ?? '-'}</TableCell>
              <TableCell>
                {accessory.urlProducto ? (
                  <a href={accessory.urlProducto} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">
                    Ver Link <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>{new Date(accessory.fechaUltimaActualizacionCosto).toLocaleDateString()}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/accessories/edit/${accessory.id}`}>
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
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el accesorio.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(accessory.id)}>
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
