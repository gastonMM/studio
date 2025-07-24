

"use client";

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, X } from "lucide-react";
import Link from "next/link";
import { fetchProjects } from "./actions";
import { ProjectList } from "./components/project-list";
import { Project } from '@/types';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function SavedProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  useState(() => {
    async function loadProjects() {
      const fetchedProjects = await fetchProjects();
      setProjects(fetchedProjects);
    }
    loadProjects();
  });

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(p => p.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedTags.size === 0) {
      return projects;
    }
    return projects.filter(p => 
      p.tags && p.tags.some(tag => selectedTags.has(tag))
    );
  }, [projects, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      const newTags = new Set(prev);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Proyectos</h1>
          <p className="text-muted-foreground">Consulta y gestiona tus proyectos y cálculos guardados.</p>
        </div>
        <div className="flex gap-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> 
                Filtrar por Etiqueta
                {selectedTags.size > 0 && <Badge variant="secondary" className="ml-2">{selectedTags.size}</Badge>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Etiquetas Disponibles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allTags.length > 0 ? allTags.map(tag => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={selectedTags.has(tag)}
                  onCheckedChange={() => handleTagToggle(tag)}
                >
                  {tag}
                </DropdownMenuCheckboxItem>
              )) : (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">No hay etiquetas.</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild>
            <Link href="/projects/calculate">
              <PlusCircle className="mr-2 h-4 w-4" /> Nueva Calculación
            </Link>
          </Button>
        </div>
      </div>
       {selectedTags.size > 0 && (
        <div className="mb-4 flex items-center gap-2">
            <h3 className="text-sm font-medium">Filtros activos:</h3>
            <div className="flex flex-wrap gap-2">
            {Array.from(selectedTags).map(tag => (
                <Badge key={tag} variant="secondary">
                {tag}
                <button onClick={() => handleTagToggle(tag)} className="ml-1 rounded-full p-0.5 hover:bg-destructive/20">
                    <X className="h-3 w-3" />
                </button>
                </Badge>
            ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedTags(new Set())}>
                Limpiar filtros
            </Button>
        </div>
      )}
      <ProjectList projects={filteredProjects} />
    </div>
  );
}
