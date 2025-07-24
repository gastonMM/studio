
"use client";

import type { Tag, TagFormData } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveTagAction } from "../actions";
import { Loader2, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const tagSchema = z.object({
  name: z.string().min(1, "El nombre no puede estar vacío."),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Debe ser un color hexadecimal válido (ej: #RRGGBB)."),
});

const colorPalette = [
  "#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
  "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe",
  "#008080", "#e6beff", "#9A6324", "#fffac8", "#800000",
  "#aaffc3", "#808000", "#ffd8b1", "#000075", "#a9a9a9",
  "#d32f2f", "#1976d2", "#388e3c", "#fbc02d", "#8e24aa"
];


interface TagFormProps {
  tag?: Tag;
}

export function TagForm({ tag }: TagFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: tag ? {
      name: tag.name,
      color: tag.color,
    } : {
        name: "",
        color: "#3498db"
    },
  });

  const selectedColor = form.watch("color");

  async function onSubmit(values: TagFormData) {
    setIsSubmitting(true);
    try {
      const result = await saveTagAction(values, tag?.id);
      if (result.success) {
        toast({
          title: tag ? "Etiqueta actualizada" : "Etiqueta creada",
          description: `La etiqueta ha sido ${tag ? 'actualizada' : 'creada'} correctamente.`,
        });
        router.push("/tags");
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{tag ? "Editar Etiqueta" : "Nueva Etiqueta"}</CardTitle>
        <CardDescription>
          {tag ? "Este cambio se reflejará en todos los proyectos que usen esta etiqueta." : "Crea una nueva etiqueta para organizar tus proyectos."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Etiqueta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Llaveros" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Color de la Etiqueta</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                    "w-[280px] justify-between",
                                    !field.value && "text-muted-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-4 h-4 rounded-full border" 
                                            style={{ backgroundColor: field.value }}
                                        />
                                        {field.value}
                                    </div>
                                    <Palette className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                             <div className="grid grid-cols-5 gap-2 p-3">
                                {colorPalette.map(color => (
                                <button
                                    type="button"
                                    key={color}
                                    className={cn(
                                    "h-10 w-10 rounded-md border-2 transition-all",
                                    selectedColor.toLowerCase() === color.toLowerCase()
                                        ? "ring-2 ring-offset-2 ring-ring"
                                        : "border-transparent",
                                    color === "#ffffff" && "border-input"
                                    )}
                                    style={{ backgroundColor: color }}
                                    onClick={() => {
                                        form.setValue("color", color, { shouldValidate: true });
                                    }}
                                    aria-label={`Select color ${color}`}
                                />
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="px-0 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {tag ? "Actualizar Etiqueta" : "Crear Etiqueta"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="ml-2 w-full md:w-auto"
              >
                Cancelar
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    