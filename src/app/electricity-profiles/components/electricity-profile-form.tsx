
"use client";

import type { ElectricityProfile, ElectricityProfileFormData } from "@/types";
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
import { useState, useEffect } from "react";
import { saveElectricityProfileAction } from "../actions";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  nombrePerfil: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  consumoMensualKWh: z.coerce.number().positive("El consumo debe ser un número positivo."),
  costoTotalFactura: z.coerce.number().positive("El costo debe ser un número positivo."),
});

interface ElectricityProfileFormProps {
  profile?: ElectricityProfile;
}

export function ElectricityProfileForm({ profile }: ElectricityProfileFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);

  const form = useForm<ElectricityProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile ? { ...profile } : {
      nombrePerfil: "",
      consumoMensualKWh: 0,
      costoTotalFactura: 0,
    },
  });

  const watchConsumption = form.watch("consumoMensualKWh");
  const watchBill = form.watch("costoTotalFactura");

  useEffect(() => {
    if (watchConsumption > 0 && watchBill > 0) {
      setCalculatedCost(watchBill / watchConsumption);
    } else {
      setCalculatedCost(null);
    }
  }, [watchConsumption, watchBill]);


  async function onSubmit(values: ElectricityProfileFormData) {
    setIsSubmitting(true);
    try {
      const result = await saveElectricityProfileAction(values, profile?.id);
      if (result.success) {
        toast({ title: "Perfil guardado", description: "El perfil de electricidad ha sido guardado." });
        router.push("/electricity-profiles");
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{profile ? "Editar Perfil Eléctrico" : "Nuevo Perfil Eléctrico"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombrePerfil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Perfil</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Tarifa Edesur" {...field} />
                  </FormControl>
                  <FormDescription>Un nombre para identificar esta tarifa (ej: proveedor, mes).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="consumoMensualKWh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consumo Total en la Factura (kWh)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Ej: 150" {...field} />
                    </FormControl>
                    <FormDescription>El total de kWh consumidos que figura en tu factura.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="costoTotalFactura"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto Total Pagado (ARS)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Ej: 8500.00" {...field} />
                    </FormControl>
                    <FormDescription>El importe final que pagaste.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {calculatedCost !== null && (
                <div className="p-4 bg-muted rounded-md text-center">
                    <p className="text-sm text-muted-foreground">Costo por kWh calculado:</p>
                    <p className="text-xl font-semibold text-primary">
                        {calculatedCost.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </p>
                </div>
            )}

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
