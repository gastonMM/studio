import pool, { toPlainObject } from '@/lib/db';
import type { Project } from "@/types";
import type { RowDataPacket, OkPacket } from 'mysql2';

type ProjectRow = Omit<Project, 'imageUrls' | 'accesoriosUsadosEnProyecto' | 'inputsOriginales' | 'resultadosCalculados'> & {
    imageUrls: string;
    accesoriosUsadosEnProyecto: string;
    inputsOriginales: string;
    resultadosCalculados: string;
} & RowDataPacket;

function parseProject(row: ProjectRow): Project {
    return {
        ...row,
        id: String(row.id),
        fechaCreacion: new Date(row.fechaCreacion),
        fechaUltimoCalculo: new Date(row.fechaUltimoCalculo),
        imageUrls: row.imageUrls ? JSON.parse(row.imageUrls) : [],
        accesoriosUsadosEnProyecto: row.accesoriosUsadosEnProyecto ? JSON.parse(row.accesoriosUsadosEnProyecto) : [],
        inputsOriginales: row.inputsOriginales ? JSON.parse(row.inputsOriginales) : {},
        resultadosCalculados: row.resultadosCalculados ? JSON.parse(row.resultadosCalculados) : {},
    };
}

function prepareProjectForDb(projectData: Partial<Project>): any {
    const dataForDb = { ...projectData };
    if (dataForDb.imageUrls) {
        dataForDb.imageUrls = JSON.stringify(dataForDb.imageUrls) as any;
    }
    if (dataForDb.accesoriosUsadosEnProyecto) {
        dataForDb.accesoriosUsadosEnProyecto = JSON.stringify(dataForDb.accesoriosUsadosEnProyecto) as any;
    }
    if (dataForDb.inputsOriginales) {
        dataForDb.inputsOriginales = JSON.stringify(dataForDb.inputsOriginales) as any;
    }
    if (dataForDb.resultadosCalculados) {
        dataForDb.resultadosCalculados = JSON.stringify(dataForDb.resultadosCalculados) as any;
    }
    return dataForDb;
}


export async function getProjects(): Promise<Project[]> {
  const [rows] = await pool.query<ProjectRow[]>("SELECT * FROM projects ORDER BY fechaCreacion DESC");
  return rows.map(parseProject);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const [rows] = await pool.query<ProjectRow[]>("SELECT * FROM projects WHERE id = ?", [id]);
  if (rows.length === 0) return undefined;
  return parseProject(rows[0]);
}

export async function createProject(
  projectData: Omit<Project, 'id' | 'fechaCreacion' | 'fechaUltimoCalculo'>
): Promise<Project> {
  if (!projectData.nombreProyecto) {
    throw new Error("El nombre del proyecto es obligatorio.");
  }
  const now = new Date();
  
  const dataToInsert = prepareProjectForDb({
    ...projectData,
    fechaCreacion: now,
    fechaUltimoCalculo: now,
  });

  const [result] = await pool.query<OkPacket>("INSERT INTO projects SET ?", dataToInsert);
  
  const newId = result.insertId;

  return (await getProjectById(String(newId)))!;
}

export async function updateProject(id: string, projectData: Partial<Project>): Promise<Project | null> {
  const projectToUpdate = await getProjectById(id);
  if (!projectToUpdate) {
      return null;
  }
  
  const updatedData = {
    ...projectData,
    fechaUltimoCalculo: new Date(),
  };

  const dataForDb = prepareProjectForDb(updatedData);
  delete dataForDb.id; // Don't try to update the ID

  await pool.query("UPDATE projects SET ? WHERE id = ?", [dataForDb, id]);
  
  return await getProjectById(id) ?? null;
}

export async function deleteProject(id: string): Promise<boolean> {
  const [result] = await pool.query<OkPacket>("DELETE FROM projects WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
