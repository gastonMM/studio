"use client";

import type { Material } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink, Layers } from "lucide-react";
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
import { deleteMaterialAction } from "../actions";

interface MaterialListProps {
  materials: Material[];
}

export function MaterialList({ materials }: MaterialListProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const result = await deleteMaterialAction(id);
    if (result.success) {
      toast({ title: "Material eliminado", description: "El material ha sido eliminado correctamente." });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  if (!materials || materials.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Layers className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-xl font-semibold">No hay materiales registrados</h3>
        <p className="mt-2">Empieza agregando tu primer material de impresión.</p>
        <Button asChild className="mt-4">
          <Link href="/materials/new">Agregar Material</Link>
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
            <TableHead>Costo/kg (ARS)</TableHead>
            <TableHead>Peso Spool (g)</TableHead>
            <TableHead>Densidad (g/cm³)</TableHead>
            <TableHead>Diámetro (mm)</TableHead>
            <TableHead>URL Producto</TableHead>
            <TableHead>Últ. Act.</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell className="font-medium">{material.nombreMaterial}</TableCell>
              <TableCell>{material.costoPorKg.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</TableCell>
              <TableCell>{material.pesoSpoolCompradoGramos}</TableCell>
              <TableCell>{material.densidad ?? '-'}</TableCell>
              <TableCell>{material.diametro ?? '-'}</TableCell>
              <TableCell>
                {material.urlProducto ? (
                  <a href={material.urlProducto} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">
                    Ver Link <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>{new Date(material.fechaUltimaActualizacionCosto).toLocaleDateString('es-AR')}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/materials/edit/${material.id}`}>
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
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el material.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(material.id)}>
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
