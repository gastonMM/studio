

"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, X } from "lucide-react";
import Link from "next/link";
import { fetchProjects } from "./actions";
import { fetchTags } from '../tags/actions';
import { ProjectList } from "./components/project-list";
import { Project, Tag } from '@/types';
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
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    async function loadData() {
        const [projectsData, tagsData] = await Promise.all([
            fetchProjects(),
            fetchTags()
        ]);
        setProjects(projectsData);
        setAllTags(tagsData);
    }
    loadData();
  }, []);

  const availableTags = useMemo(() => {
    return allTags.sort((a,b) => a.name.localeCompare(b.name));
  }, [allTags]);


  const filteredProjects = useMemo(() => {
    if (selectedTags.size === 0) {
      return projects;
    }
    return projects.filter(p => 
      p.tags && p.tags.some(tag => selectedTags.has(tag))
    );
  }, [projects, selectedTags]);

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev => {
      const newTags = new Set(prev);
      if (newTags.has(tagName)) {
        newTags.delete(tagName);
      } else {
        newTags.add(tagName);
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
              {availableTags.length > 0 ? availableTags.map(tag => (
                <DropdownMenuCheckboxItem
                  key={tag.id}
                  checked={selectedTags.has(tag.name)}
                  onCheckedChange={() => handleTagToggle(tag.name)}
                >
                  {tag.name}
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
                <Badge 
                    key={tag} 
                    className="border-transparent"
                    style={{ 
                        backgroundColor: availableTags.find(t => t.name === tag)?.color, 
                        color: "hsl(var(--primary-foreground))"
                    }}
                >
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
      <ProjectList projects={filteredProjects} allTags={allTags} />
    </div>
  );
}
