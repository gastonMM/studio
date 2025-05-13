"use client";

import type { Material, MaterialFormData } from "@/types";
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
import { useState } from "react";
// import { saveMaterialAction } from "../actions"; // Server action
import { fetchPriceFromURL } from "@/ai/flows/fetch-price-from-url";
import { Loader2 } from "lucide-react";

const materialSchema = z.object({
  nombreMaterial: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  costoPorKg: z.coerce.number().positive("El costo debe ser un número positivo."),
  pesoSpoolCompradoGramos: z.coerce.number().positive("El peso debe ser positivo.").default(1000),
  urlProducto: z.string().url("Debe ser una URL válida.").optional().or(z.literal('')),
  selectorPrecioCSS: z.string().optional(),
  densidad: z.coerce.number().positive("La densidad debe ser positiva.").optional(),
  diametro: z.coerce.number().positive("El diámetro debe ser positivo.").optional(),
  notasAdicionales: z.string().optional(),
});

interface MaterialFormProps {
  material?: Material; // For editing
}

export function MaterialForm({ material }: MaterialFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: material ? {
      ...material,
      // Ensure Date types are not passed if not part of MaterialFormData
    } : {
      nombreMaterial: "",
      costoPorKg: 0,
      pesoSpoolCompradoGramos: 1000,
      urlProducto: "",
      selectorPrecioCSS: "",
      densidad: 1.24, // Common PLA density
      diametro: 1.75, // Common diameter
      notasAdicionales: "",
    },
  });

  async function onSubmit(values: MaterialFormData) {
    setIsSubmitting(true);
    try {
      // const result = await saveMaterialAction(values, material?.id);
      // if (result.success) {
      //   toast({ title: "Material guardado", description: "El material ha sido guardado correctamente." });
      //   router.push("/materials");
      //   router.refresh(); // Refresh server components
      // } else {
      //   toast({ title: "Error", description: result.error, variant: "destructive" });
      // }
      toast({ title: "Simulación: Material guardado", description: `Material ${values.nombreMaterial} sería guardado.` });
      router.push("/materials");
    } catch (error) {
      toast({ title: "Error", description: "Ocurrió un error inesperado.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFetchPrice = async () => {
    const url = form.getValues("urlProducto");
    if (!url) {
      toast({ title: "URL Requerida", description: "Por favor, ingrese una URL de producto.", variant: "destructive" });
      return;
    }
    setIsFetchingPrice(true);
    try {
      const result = await fetchPriceFromURL({ url });
      if (result && result.price !== undefined) {
        const pesoSpoolGramos = form.getValues("pesoSpoolCompradoGramos") || 1000;
        const costoKg = (result.price / pesoSpoolGramos) * 1000;
        form.setValue("costoPorKg", parseFloat(costoKg.toFixed(2)));
        toast({ title: "Precio Obtenido", description: `Precio sugerido: ${result.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}. Costo/kg calculado: ${costoKg.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}` });
      } else {
        toast({ title: "Error al obtener precio", description: "No se pudo obtener el precio. Por favor, ingréselo manualmente.", variant: "default" });
      }
    } catch (error) {
      console.error("Error fetching price:", error);
      toast({ title: "Error", description: "Ocurrió un error al contactar el servicio de precios.", variant: "destructive" });
    } finally {
      setIsFetchingPrice(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{material ? "Editar Material" : "Nuevo Material"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombreMaterial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Material</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: PLA Rojo Brillante" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="costoPorKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo por Kg (ARS)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Ej: 15000.50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pesoSpoolCompradoGramos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso Spool Comprado (gramos)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ej: 1000" {...field} />
                    </FormControl>
                    <FormDescription>Default: 1000g</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="urlProducto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Producto (Opcional)</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input placeholder="https://link_al_producto" {...field} />
                    </FormControl>
                    <Button type="button" onClick={handleFetchPrice} disabled={isFetchingPrice || !field.value} variant="outline">
                      {isFetchingPrice ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Obtener Precio
                    </Button>
                  </div>
                  <FormDescription>Link para obtener/actualizar precio automáticamente (experimental).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* <FormField
              control={form.control}
              name="selectorPrecioCSS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selector CSS de Precio (Avanzado, Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: .price-tag > span" {...field} />
                  </FormControl>
                  <FormDescription>Para extracción de precio específica si la automática falla.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="densidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Densidad (g/cm³)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Ej: 1.24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diametro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diámetro (mm)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Ej: 1.75" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notasAdicionales"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Adicionales</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Cualquier nota relevante sobre el material..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="px-0 pt-6">
              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {material ? "Actualizar Material" : "Crear Material"}
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
