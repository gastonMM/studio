
"use client";

import type { PrinterProfile, PrinterProfileFormData } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { savePrinterProfileAction } from "../actions";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  nombrePerfilImpresora: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  modeloImpresora: z.string().optional(),
  consumoEnergeticoImpresoraWatts: z.coerce.number().min(0, "Debe ser cero o positivo.").optional(),
  costoKWhElectricidad: z.coerce.number().min(0, "Debe ser cero o positivo.").optional(),
  costoAdquisicionImpresora: z.coerce.number().min(0, "Debe ser cero o positivo.").optional(),
  vidaUtilEstimadaHorasImpresora: z.coerce.number().positive("La vida útil debe ser un número positivo.").optional(),
  porcentajeFallasEstimado: z.coerce.number().min(0).max(100, "Debe ser un porcentaje entre 0 y 100.").optional(),
  costoHoraLaborOperativa: z.coerce.number().min(0, "Debe ser cero o positivo.").optional(),
  costoHoraLaborPostProcesado: z.coerce.number().min(0, "Debe ser cero o positivo.").optional(),
});

interface PrinterProfileFormProps {
  profile?: PrinterProfile;
}

export function PrinterProfileForm({ profile }: PrinterProfileFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PrinterProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile ? { ...profile } : {
      nombrePerfilImpresora: "",
      modeloImpresora: "",
      consumoEnergeticoImpresoraWatts: 200,
      costoKWhElectricidad: 40,
      costoAdquisicionImpresora: 1200000,
      vidaUtilEstimadaHorasImpresora: 4000,
      porcentajeFallasEstimado: 5,
      costoHoraLaborOperativa: 2500,
      costoHoraLaborPostProcesado: 2000,
    },
  });

  async function onSubmit(values: PrinterProfileFormData) {
    setIsSubmitting(true);
    try {
      const result = await savePrinterProfileAction(values, profile?.id);
      if (result.success) {
        toast({ title: "Perfil guardado", description: "El perfil de impresora ha sido guardado correctamente." });
        router.push("/printer-profiles");
        router.refresh();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Ocurrió un error inesperado.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{profile ? "Editar Perfil de Impresora" : "Nuevo Perfil de Impresora"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="nombrePerfilImpresora"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nombre del Perfil</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Ender 3 Pro - Boquilla 0.4mm" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="modeloImpresora"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Modelo de Impresora</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Creality Ender 3 Pro" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <h3 className="text-lg font-semibold border-b pb-2 mt-6">Parámetros de Costos</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField control={form.control} name="consumoEnergeticoImpresoraWatts"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Consumo (Watts)</FormLabel>
                        <FormControl><Input type="number" step="1" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="costoKWhElectricidad"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Costo KWh (ARS)</FormLabel>
                        <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="porcentajeFallasEstimado"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tasa de Fallas (%)</FormLabel>
                        <FormControl><Input type="number" step="1" {...field} /></FormControl>
                        <FormDescription>Valor entre 0 y 100.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <FormField control={form.control} name="costoAdquisicionImpresora"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Costo Adquisición (ARS)</FormLabel>
                        <FormControl><Input type="number" step="1" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="vidaUtilEstimadaHorasImpresora"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Vida Útil (Horas)</FormLabel>
                        <FormControl><Input type="number" step="1" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <FormField control={form.control} name="costoHoraLaborOperativa"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Costo Labor Operativa (ARS/hr)</FormLabel>
                        <FormControl><Input type="number" step="1" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="costoHoraLaborPostProcesado"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Costo Labor Post-Procesado (ARS/hr)</FormLabel>
                        <FormControl><Input type="number" step="1" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>


            <CardFooter className="px-0 pt-6">
              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {profile ? "Actualizar Perfil" : "Crear Perfil"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} className="ml-2 w-full md:w-auto">
                Cancelar
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
