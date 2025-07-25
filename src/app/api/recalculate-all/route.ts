
import { NextResponse, NextRequest } from 'next/server';
import { recalculateAllProjectsAction } from '@/app/projects/actions';

// En una aplicación real, esto debería ser una variable de entorno.
const SECRET_KEY = process.env.RECALCULATE_SECRET_KEY || 'SUPER_SECRET_KEY';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== SECRET_KEY) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  try {
    const result = await recalculateAllProjectsAction();
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Recalculados ${result.count} proyectos exitosamente.`,
        count: result.count,
      });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
