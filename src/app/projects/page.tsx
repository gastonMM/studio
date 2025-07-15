
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { fetchProjects } from "./actions";
import { ProjectList } from "./components/project-list";

export const metadata: Metadata = {
  title: "Catálogo de Proyectos - Calculadora Costos 3D Pro",
  description: "Consulta y gestiona tus proyectos y cálculos guardados.",
};

export default async function SavedProjectsPage() {
  const projects = await fetchProjects();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Catálogo de Proyectos</h1>
        <Button asChild>
          <Link href="/projects/calculate">
            <PlusCircle className="mr-2 h-4 w-4" /> Nueva Calculación
          </Link>
        </Button>
      </div>
      <ProjectList projects={projects} />
    </div>
  );
}
