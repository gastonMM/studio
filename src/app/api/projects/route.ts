
import { NextResponse } from 'next/server';
import { getProjects, createProject } from '@/services/project-service';
import type { Project } from '@/types';

// A simplified schema for creation. You might want a more specific one.
// The createProject service function already has validation.

export async function GET(request: Request) {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Omit<Project, 'id' | 'fechaCreacion' | 'fechaUltimoCalculo'> = await request.json();

    // The service function will perform basic validation
    const newProject = await createProject(body);
    return NextResponse.json(newProject, { status: 201 });

  } catch (error) {
    console.error("Error creating project:", error);
    const errorMessage = error instanceof Error ? error.message : "An internal server error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
