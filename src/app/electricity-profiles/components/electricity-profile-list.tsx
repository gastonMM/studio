
"use client";

import type { ElectricityProfile } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Zap } from "lucide-react";
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
import { deleteElectricityProfileAction } from "../actions";

interface ElectricityProfileListProps {
  profiles: ElectricityProfile[];
}

export function ElectricityProfileList({ profiles }: ElectricityProfileListProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const result = await deleteElectricityProfileAction(id);
    if (result.success) {
      toast({ title: "Perfil eliminado", description: "El perfil ha sido eliminado correctamente." });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  if (!profiles || profiles.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Zap className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-xl font-semibold">No hay perfiles de electricidad</h3>
        <p className="mt-2">Crea tu primer perfil para empezar.</p>
        <Button asChild className="mt-4">
          <Link href="/electricity-profiles/new">Agregar Perfil</Link>
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
            <TableHead className="text-right">Consumo Mensual (kWh)</TableHead>
            <TableHead className="text-right">Costo Factura (ARS)</TableHead>
            <TableHead className="text-right">Costo por kWh (ARS)</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell className="font-medium">{profile.nombrePerfil}</TableCell>
              <TableCell className="text-right">{profile.consumoMensualKWh.toLocaleString('es-AR')} kWh</TableCell>
              <TableCell className="text-right">{profile.costoTotalFactura.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary">
                  {profile.costoPorKWh.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 4 })}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/electricity-profiles/edit/${profile.id}`}>
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
