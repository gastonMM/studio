
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
import { Loader2 } from "lucide-react";

const tagSchema = z.object({
  name: z.string().min(1, "El nombre no puede estar vacío."),
});

interface TagFormProps {
  tag: Tag; // Editing is required, no creation form
}

export function TagForm({ tag }: TagFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag.name,
    },
  });

  async function onSubmit(values: TagFormData) {
    setIsSubmitting(true);
    try {
      const result = await saveTagAction(values, tag.id);
      if (result.success) {
        toast({
          title: "Etiqueta actualizada",
          description: "La etiqueta ha sido renombrada en todos los proyectos.",
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
        <CardTitle>Editar Etiqueta</CardTitle>
        <CardDescription>
          Este cambio se reflejará en todos los proyectos que usen esta
          etiqueta.
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
            <CardFooter className="px-0 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Actualizar Etiqueta
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
