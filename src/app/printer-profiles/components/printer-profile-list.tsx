
"use client";

import type { PrinterProfile, ElectricityProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Printer } from "lucide-react";
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
import { deletePrinterProfileAction } from "../actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PrinterProfileListProps {
  profiles: PrinterProfile[];
  electricityProfiles: ElectricityProfile[];
}

export function PrinterProfileList({ profiles, electricityProfiles }: PrinterProfileListProps) {
  const { toast } = useToast();

  const getElectricityProfileName = (id?: string) => {
    if (!id) return "N/A";
    const profile = electricityProfiles.find(p => p.id === id);
    return profile ? profile.nombrePerfil : id;
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deletePrinterProfileAction(id);
      if (result.success) {
        toast({ title: "Perfil eliminado", description: "El perfil ha sido eliminado correctamente." });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch(e) {
         toast({ title: "Error en cascada", description: "Este perfil está siendo usado por un proyecto. No se puede eliminar.", variant: "destructive" });
    }
  };

  if (!profiles || profiles.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Printer className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-xl font-semibold">No hay perfiles de impresora</h3>
        <p className="mt-2">Crea tu primer perfil para empezar a hacer cálculos.</p>
        <Button asChild className="mt-4">
          <Link href="/printer-profiles/new">Agregar Perfil</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      {profiles.map((profile) => (
        <Card key={profile.id}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                        <Printer className="mr-3 h-6 w-6 text-primary" />
                        {profile.nombrePerfilImpresora}
                    </span>
                    <div className="space-x-2">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={`/printer-profiles/edit/${profile.id}`}>
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
                                Esta acción no se puede deshacer. Esto eliminará permanentemente el perfil de impresora.
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
                    </div>
                </CardTitle>
                <CardDescription>
                    {profile.modeloImpresora || "Sin modelo especificado"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div><span className="font-semibold">Consumo:</span> {profile.consumoEnergeticoImpresoraWatts}W</div>
                        <div><span className="font-semibold">Costo Adquisición:</span> {profile.costoAdquisicionImpresora?.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</div>
                        <div><span className="font-semibold">Vida Útil:</span> {profile.vidaUtilEstimadaHorasImpresora}h</div>
                        <div><span className="font-semibold">Tasa Fallas:</span> {profile.porcentajeFallasEstimado}%</div>
                        <div><span className="font-semibold">Costo Labor Op:</span> {profile.costoHoraLaborOperativa?.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}/hr</div>
                        <div><span className="font-semibold">Costo Labor PP:</span> {profile.costoHoraLaborPostProcesado?.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}/hr</div>
                    </div>
                     <div className="border-t pt-2 flex items-center justify-between">
                        <span className="font-semibold">Perfil Eléctrico:</span>
                        <Badge variant="outline">{getElectricityProfileName(profile.electricityProfileId)}</Badge>
                     </div>
                </div>
            </CardContent>
        </Card>
      ))}
    </div>
  );
}
