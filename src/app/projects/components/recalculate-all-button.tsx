
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { RefreshCw, Loader2 } from "lucide-react";
import { recalculateAllProjectsAction } from "../actions";

export function RecalculateAllButton() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleRecalculate = async () => {
    setIsLoading(true);
    try {
      const result = await recalculateAllProjectsAction();
      if (result.success) {
        toast({
          title: "Recálculo Completo",
          description: `${result.count} proyectos han sido actualizados con los últimos costos.`,
        });
      } else {
        toast({
          title: "Error en el recálculo",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al intentar recalcular los proyectos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Recalcular Todos
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro de recalcular todo?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción actualizará los costos y precios de TODOS los proyectos en tu catálogo con los valores más recientes de materiales, electricidad y perfiles de venta.
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleRecalculate} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Sí, recalcular todo
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
