

"use client";

import type { SalesProfile } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, PercentCircle } from "lucide-react";
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
import { deleteSalesProfileAction } from "../actions";

interface SalesProfileListProps {
  profiles: SalesProfile[];
}

export function SalesProfileList({ profiles }: SalesProfileListProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const result = await deleteSalesProfileAction(id);
    if (result.success) {
      toast({ title: "Perfil eliminado", description: "El perfil ha sido eliminado correctamente." });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  if (!profiles || profiles.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <PercentCircle className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-xl font-semibold">No hay perfiles de venta</h3>
        <p className="mt-2">Crea tu primer perfil para empezar.</p>
        <Button asChild className="mt-4">
          <Link href="/sales-profiles/new">Agregar Perfil</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre del Perfil</TableHead>
            <TableHead className="text-right">Ganancia Directa</TableHead>
            <TableHead className="text-right">Comisión ML</TableHead>
            <TableHead className="text-right">Cargo Fijo ML</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell className="font-medium">{profile.nombrePerfil}</TableCell>
              <TableCell className="text-right">{profile.margenGananciaDirecta}%</TableCell>
              <TableCell className="text-right">{profile.comisionMercadoLibre}%</TableCell>
              <TableCell className="text-right">{profile.costoFijoMercadoLibre.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</TableCell>
              
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/sales-profiles/edit/${profile.id}`}>
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
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el perfil.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(profile.id)}>
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
