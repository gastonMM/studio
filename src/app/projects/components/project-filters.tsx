
"use client";

import { useState, useMemo, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { Tag } from '@/types';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface ProjectFiltersProps {
    allTags: Tag[];
}

export function ProjectFilters({ allTags }: ProjectFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selectedTags = useMemo(() => {
    const tags = searchParams.get('tags');
    return new Set(tags ? tags.split(',') : []);
  }, [searchParams]);

  const availableTags = useMemo(() => {
    return allTags.sort((a,b) => a.name.localeCompare(b.name));
  }, [allTags]);

  const handleTagToggle = (tagName: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tagName)) {
      newTags.delete(tagName);
    } else {
      newTags.add(tagName);
    }
    
    const params = new URLSearchParams(searchParams);
    if (newTags.size > 0) {
      params.set('tags', Array.from(newTags).join(','));
    } else {
      params.delete('tags');
    }

    startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('tags');
    startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
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

       {selectedTags.size > 0 && (
        <div className="flex items-center gap-2">
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
            <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpiar
            </Button>
        </div>
      )}
    </div>
  );
}
