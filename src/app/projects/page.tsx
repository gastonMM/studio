import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { fetchProjects } from "./actions";
import { fetchTags } from '../tags/actions';
import { ProjectList } from "./components/project-list";
import { ProjectFilters } from "./components/project-filters";
import type { Metadata } from "next";
import { TagManager } from "./components/tag-manager";
import { RecalculateAllButton } from "./components/recalculate-all-button";

export const metadata: Metadata = {
  title: "Catálogo de Proyectos - Calculadora Costos 3D Pro",
  description: "Consulta y gestiona tus proyectos y cálculos guardados.",
};

export default async function SavedProjectsPage({
  searchParams
}: {
  searchParams: {
    tags?: string;
    search?: string;
  }
}) {
  const [projects, allTags] = await Promise.all([
    fetchProjects(),
    fetchTags(),
  ]);

  const selectedTags = searchParams?.tags?.split(',') || [];
  const searchTerm = searchParams?.search?.toLowerCase() || '';

  const filteredProjects = projects.filter(project => {
    const hasSelectedTags = selectedTags.length === 0 || (project.tags && project.tags.some(tag => selectedTags.includes(tag)));
    const matchesSearch = searchTerm === '' || project.nombreProyecto.toLowerCase().includes(searchTerm);
    return hasSelectedTags && matchesSearch;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-start mb-8 gap-4 flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Proyectos</h1>
          <p className="text-muted-foreground">Consulta y gestiona tus proyectos y cálculos guardados.</p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
           <ProjectFilters allTags={allTags} />
            <>
              <RecalculateAllButton />
              <TagManager allTags={allTags} />
              <Link href="/projects/calculate" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shrink-0">
                <PlusCircle className="mr-2 h-4 w-4" /> Nueva Calculación
              </Link>
            </>
        </div>
      </div>
      
      <ProjectList projects={filteredProjects} allTags={allTags} />
    </div>
  );
}
