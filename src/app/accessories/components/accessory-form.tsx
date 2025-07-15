
"use client";

import type { Accessory, AccessoryFormData } from "@/types";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { saveAccessoryAction } from "../actions";
import { Loader2 } from "lucide-react";

const accessorySchema = z.object({
  nombreAccesorio: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  precioPaqueteObtenido: z.coerce.number().positive("El precio debe ser un número positivo."),
  unidadesPorPaqueteEnLink: z.coerce.number().int().positive("Las unidades deben ser un número entero positivo."),
  urlProducto: z.string().url("Debe ser una URL válida.").optional().or(z.literal('')),
  notasAdicionales: z.string().optional(),
});

interface AccessoryFormProps {
  accessory?: Accessory;
}

export function AccessoryForm({ accessory }: AccessoryFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);

  const form = useForm<AccessoryFormData>({
    resolver: zodResolver(accessorySchema),
    defaultValues: accessory ? {
        ...accessory
    } : {
      nombreAccesorio: "",
      precioPaqueteObtenido: 0,
      unidadesPorPaqueteEnLink: 1,
      urlProducto: "",
      notasAdicionales: "",
    },
  });

  const watchPrice = form.watch("precioPaqueteObtenido");
  const watchUnits = form.watch("unidadesPorPaqueteEnLink");

  useEffect(() => {
    if (watchPrice > 0 && watchUnits > 0) {
      setCalculatedCost(watchPrice / watchUnits);
    } else {
      setCalculatedCost(null);
    }
  }, [watchPrice, watchUnits]);


  async function onSubmit(values: AccessoryFormData) {
    setIsSubmitting(true);
    try {
      const result = await saveAccessoryAction(values, accessory?.id);
      if (result.success) {
        toast({ title: "Accesorio guardado", description: "El accesorio ha sido guardado correctamente." });
        router.push("/accessories");
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
        <CardTitle>{accessory ? "Editar Accesorio" : "Nuevo Accesorio"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombreAccesorio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Accesorio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Cadenas para llavero" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="precioPaqueteObtenido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio del Paquete (ARS)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Ej: 5000.00" {...field} />
                    </FormControl>
                     <FormDescription>El costo total del paquete que compras.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unidadesPorPaqueteEnLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidades por Paquete</FormLabel>
                    <FormControl>
                      <Input type="number" step="1" placeholder="Ej: 100" {...field} />
                    </FormControl>
                    <FormDescription>Cantidad de items en el paquete.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {calculatedCost !== null && (
                <div className="p-3 bg-muted rounded-md text-center">
                    <p className="text-sm text-muted-foreground">Costo por unidad calculado:</p>
                    <p className="text-lg font-semibold text-primary">
                        {calculatedCost.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </p>
                </div>
            )}

            <FormField
              control={form.control}
              name="urlProducto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Producto (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://link_al_producto" {...field} />
                  </FormControl>
                  <FormDescription>Link de referencia del producto.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notasAdicionales"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Adicionales</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Cualquier nota relevante sobre el accesorio..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="px-0 pt-6">
              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {accessory ? "Actualizar Accesorio" : "Crear Accesorio"}
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
