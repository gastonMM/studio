
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { fetchTags } from "./actions";
import { TagList } from "./components/tag-list";

export const metadata: Metadata = {
  title: "Gestión de Etiquetas - Calculadora Costos 3D Pro",
  description: "Administra las etiquetas utilizadas en tus proyectos.",
};

export default async function TagsPage() {
  const tags = await fetchTags();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Etiquetas</h1>
        <Button asChild>
          <Link href="/tags/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Nueva Etiqueta
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Listado de Etiquetas</CardTitle>
          <CardDescription>
            Estas son todas las etiquetas utilizadas en tus proyectos. Puedes
            editarlas o eliminarlas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TagList tags={tags} />
        </CardContent>
      </Card>
    </div>
  );
}
