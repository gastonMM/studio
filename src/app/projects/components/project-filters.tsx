
"use client";

import { useState, useMemo, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Filter, X, Search } from "lucide-react";
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
import { Input } from '@/components/ui/input';

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

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const availableTags = useMemo(() => {
    return allTags.sort((a,b) => a.name.localeCompare(b.name));
  }, [allTags]);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm) {
        params.set('search', searchTerm);
      } else {
        params.delete('search');
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 300); // 300ms debounce
    return () => clearTimeout(timeoutId);
  }, [searchTerm, pathname, router, searchParams]);

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
    setSearchTerm('');
    const params = new URLSearchParams(searchParams);
    params.delete('tags');
    params.delete('search');
    startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
    });
  }

  const hasActiveFilters = selectedTags.size > 0 || searchTerm !== '';

  return (
    <div className="flex flex-wrap items-center gap-2 w-full">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar por nombre..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="shrink-0">
            <Filter className="mr-2 h-4 w-4" /> 
            Etiquetas
            {selectedTags.size > 0 && <Badge variant="secondary" className="ml-2">{selectedTags.size}</Badge>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filtrar por Etiqueta</DropdownMenuLabel>
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

       {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Limpiar filtros
          </Button>
      )}
    </div>
  );
}
