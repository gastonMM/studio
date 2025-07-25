
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Tag } from '@/types';
import { saveTagAction, deleteTagAction } from '@/app/tags/actions';
import { Tags, Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const tagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre no puede estar vacío.'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Debe ser un color hexadecimal.'),
});

const formSchema = z.object({
  tags: z.array(tagSchema),
});

const colorPalette = [
  "#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
  "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe",
  "#008080", "#e6beff", "#9A6324", "#fffac8", "#800000",
  "#aaffc3", "#808000", "#ffd8b1", "#000075", "#a9a9a9",
  "#d32f2f", "#1976d2", "#388e3c", "#fbc02d", "#8e24aa"
];

export function TagManager({ allTags }: { allTags: Tag[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tags: allTags,
    },
  });
  
  // Reset form with latest tags when dialog opens
  if (isOpen && JSON.stringify(form.getValues('tags')) !== JSON.stringify(allTags)) {
      form.reset({ tags: allTags });
  }

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Find new and updated tags
      for (const tagData of data.tags) {
        const originalTag = allTags.find(t => t.id === tagData.id);
        if (!originalTag) { // It's a new tag
          await saveTagAction({ name: tagData.name, color: tagData.color });
        } else if (originalTag.name !== tagData.name || originalTag.color !== tagData.color) { // It's an updated tag
          await saveTagAction({ name: tagData.name, color: tagData.color }, tagData.id);
        }
      }
      toast({ title: "Etiquetas guardadas", description: "Tus cambios han sido guardados." });
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (tagId: string, index: number) => {
    try {
        await deleteTagAction(tagId);
        remove(index);
        toast({ title: "Etiqueta eliminada" });
        router.refresh();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
        toast({ title: 'Error al eliminar', description: errorMessage, variant: 'destructive' });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Tags className="mr-2 h-4 w-4" /> Administrar Etiquetas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Administrar Etiquetas</DialogTitle>
          <DialogDescription>
            Crea, edita o elimina las etiquetas que se usan en tus proyectos.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="max-h-[50vh] overflow-y-auto space-y-4 pr-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 p-2 border rounded-lg">
                        <FormField
                            control={form.control}
                            name={`tags.${index}.color`}
                            render={({ field: colorField }) => (
                                <FormItem>
                                     <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="p-2 h-auto"
                                            >
                                                <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: colorField.value }} />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <div className="grid grid-cols-5 gap-2 p-3">
                                                {colorPalette.map(color => (
                                                    <button type="button" key={color}
                                                        className={cn( "h-8 w-8 rounded-md border-2 transition-all",
                                                            colorField.value.toLowerCase() === color.toLowerCase()
                                                            ? "ring-2 ring-offset-2 ring-ring"
                                                            : "border-transparent"
                                                        )}
                                                        style={{ backgroundColor: color }}
                                                        onClick={() => {
                                                            update(index, { ...form.getValues(`tags.${index}`), color: color });
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`tags.${index}.name`}
                            render={({ field: nameField }) => (
                                <FormItem className="flex-grow">
                                    <FormControl>
                                        <Input {...nameField} placeholder="Nombre de la etiqueta" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(field.id as string, index)}
                            disabled={!field.id} // Disable delete for new, unsaved tags
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
             <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => append({ name: '', color: '#a9a9a9' })}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Nueva Etiqueta
            </Button>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

