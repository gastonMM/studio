

import { PlusCircle, Filter } from "lucide-react";
import Link from "next/link";
import { fetchProjects } from "./actions";
import { fetchTags } from '../tags/actions';
import { ProjectList } from "./components/project-list";
import { ProjectFilters } from "./components/project-filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de Proyectos - Calculadora Costos 3D Pro",
  description: "Consulta y gestiona tus proyectos y cálculos guardados.",
};

export default async function SavedProjectsPage({
  searchParams
}: {
  searchParams?: {
    tags?: string;
  }
}) {
  const [projects, allTags] = await Promise.all([
    fetchProjects(),
    fetchTags(),
  ]);

  const selectedTags = searchParams?.tags?.split(',') || [];

  const filteredProjects = selectedTags.length > 0
    ? projects.filter(p => p.tags && p.tags.some(tag => selectedTags.includes(tag)))
    : projects;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Proyectos</h1>
          <p className="text-muted-foreground">Consulta y gestiona tus proyectos y cálculos guardados.</p>
        </div>
        <div className="flex gap-2">
          <ProjectFilters allTags={allTags} />
          <Link href="/projects/calculate" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Nueva Calculación
          </Link>
        </div>
      </div>
      
      <ProjectList projects={filteredProjects} allTags={allTags} />
    </div>
  );
}