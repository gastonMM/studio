import pool, { toPlainObject } from '@/lib/db';
import type { Material, MaterialFormData } from "@/types";
import type { RowDataPacket, OkPacket } from 'mysql2';

type MaterialRow = Material & RowDataPacket;

// --- Service Functions ---

export async function getMaterials(): Promise<Material[]> {
  const [rows] = await pool.query<MaterialRow[]>("SELECT * FROM materials ORDER BY nombreMaterial ASC");
  return toPlainObject(rows);
}

export async function getMaterialById(id: string): Promise<Material | undefined> {
  const [rows] = await pool.query<MaterialRow[]>("SELECT * FROM materials WHERE id = ?", [id]);
  return toPlainObject(rows[0]);
}

export async function createMaterial(formData: MaterialFormData): Promise<Material> {
    if (!formData.nombreMaterial || formData.costoPorKg <= 0) {
        throw new Error("Datos inválidos.");
    }
    
    const newMaterialData = {
        ...formData,
        fechaUltimaActualizacionCosto: new Date(),
    };

    const [result] = await pool.query<OkPacket>("INSERT INTO materials SET ?", newMaterialData);
    
    const newId = result.insertId;

    const newMaterial: Material = {
        id: String(newId),
        ...newMaterialData
    };

    return newMaterial;
}

export async function updateMaterial(id: string, formData: Partial<MaterialFormData>): Promise<Material | null> {
    const materialToUpdate = await getMaterialById(id);
    if (!materialToUpdate) {
        return null;
    }
    
    const finalData = { 
        ...materialToUpdate, 
        ...formData,
        fechaUltimaActualizacionCosto: new Date(),
    };

    const { id: materialId, ...dataToUpdate } = finalData;

    await pool.query("UPDATE materials SET ? WHERE id = ?", [dataToUpdate, id]);

    return await getMaterialById(id) ?? null;
}

export async function deleteMaterial(id: string): Promise<boolean> {
  const [result] = await pool.query<OkPacket>("DELETE FROM materials WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
