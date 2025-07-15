
import { NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/services/project-service';
import { z } from 'zod';
import type { ProjectFormData, Project } from '@/types';

// A simplified schema for updates. You might want a more specific one.
const projectUpdateSchema = z.custom<Partial<Project>>();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error(`Error fetching project ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body: Partial<Project> = await request.json();
    
    // As validation is complex, we might skip Zod here or use a very permissive schema
    // For a real app, a proper Zod schema for updates would be ideal
    const updatedProject = await updateProject(id, body);

    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error(`Error updating project ${params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : "An internal server error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const success = await deleteProject(id);

    if (!success) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting project ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
