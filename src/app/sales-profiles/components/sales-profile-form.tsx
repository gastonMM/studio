

"use client";

import type { SalesProfile, SalesProfileFormData } from "@/types";
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
import { saveSalesProfileAction } from "../actions";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  nombrePerfil: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  margenGananciaDirecta: z.coerce.number().min(0, "El margen debe ser un número positivo."),
  comisionMercadoLibre: z.coerce.number().min(0).max(100, "La comisión debe ser entre 0 y 100."),
  costoFijoMercadoLibre: z.coerce.number().min(0, "El costo fijo debe ser un número positivo."),
});

interface SalesProfileFormProps {
  profile?: SalesProfile;
}

export function SalesProfileForm({ profile }: SalesProfileFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SalesProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile ? { ...profile } : {
      nombrePerfil: "",
      margenGananciaDirecta: 30,
      comisionMercadoLibre: 15,
      costoFijoMercadoLibre: 800,
    },
  });

  async function onSubmit(values: SalesProfileFormData) {
    setIsSubmitting(true);
    try {
      const result = await saveSalesProfileAction(values, profile?.id);
      if (result.success) {
        toast({ title: "Perfil guardado", description: "El perfil de venta ha sido guardado." });
        router.push("/sales-profiles");
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
        <CardTitle>{profile ? "Editar Perfil de Venta" : "Nuevo Perfil de Venta"}</CardTitle>
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
                    <Input placeholder="Ej: General, Productos Chicos" {...field} />
                  </FormControl>
                  <FormDescription>Un nombre para identificar esta configuración de venta.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <h3 className="text-lg font-semibold border-b pb-2 pt-4">Venta Directa</h3>
            <FormField
              control={form.control}
              name="margenGananciaDirecta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Margen de Ganancia (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" placeholder="Ej: 30" {...field} />
                  </FormControl>
                  <FormDescription>Tu ganancia neta deseada sobre el costo total del producto.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="text-lg font-semibold border-b pb-2 pt-4">Mercado Libre</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="comisionMercadoLibre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comisión Variable de ML (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="Ej: 15.5" {...field} />
                    </FormControl>
                    <FormDescription>El porcentaje que cobra ML por la venta.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="costoFijoMercadoLibre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo Fijo de ML (ARS)</FormLabel>
                    <FormControl>
                      <Input type="number" step="1" placeholder="Ej: 800" {...field} />
                    </FormControl>
                    <FormDescription>El cargo fijo que ML aplica a cada venta.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
