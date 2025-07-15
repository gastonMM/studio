import pool, { toPlainObject } from '@/lib/db';
import type { Accessory, AccessoryFormData } from "@/types";
import type { RowDataPacket, OkPacket } from 'mysql2';

type AccessoryRow = Accessory & RowDataPacket;

// --- Service Functions ---

export async function getAccessories(): Promise<Accessory[]> {
  const [rows] = await pool.query<AccessoryRow[]>("SELECT * FROM accessories ORDER BY nombreAccesorio ASC");
  return toPlainObject(rows);
}

export async function getAccessoryById(id: string): Promise<Accessory | undefined> {
  const [rows] = await pool.query<AccessoryRow[]>("SELECT * FROM accessories WHERE id = ?", [id]);
  return toPlainObject(rows[0]);
}

export async function createAccessory(formData: AccessoryFormData): Promise<Accessory> {
    if (!formData.nombreAccesorio || formData.precioPaqueteObtenido <= 0 || formData.unidadesPorPaqueteEnLink <= 0) {
        throw new Error("Datos inválidos.");
    }

    const costoPorUnidad = formData.precioPaqueteObtenido / formData.unidadesPorPaqueteEnLink;
    
    const newAccessoryData = {
        ...formData,
        costoPorUnidad,
        fechaUltimaActualizacionCosto: new Date(),
    };

    const [result] = await pool.query<OkPacket>("INSERT INTO accessories SET ?", newAccessoryData);
    
    const newId = result.insertId;
    
    const newAccessory: Accessory = {
        id: String(newId),
        ...newAccessoryData
    }
    
    return newAccessory;
}

export async function updateAccessory(id: string, formData: Partial<AccessoryFormData>): Promise<Accessory | null> {
    const accessoryToUpdate = await getAccessoryById(id);
    if (!accessoryToUpdate) {
        return null;
    }
    
    const updatedFields = { ...accessoryToUpdate, ...formData };

    // Recalculate cost per unit if relevant fields are changed
    if (formData.precioPaqueteObtenido !== undefined || formData.unidadesPorPaqueteEnLink !== undefined) {
        updatedFields.costoPorUnidad = updatedFields.precioPaqueteObtenido / updatedFields.unidadesPorPaqueteEnLink;
    }
    
    const finalData = {
        ...updatedFields,
        fechaUltimaActualizacionCosto: new Date(),
    };

    // Remove id from the object to be updated
    const { id: accessoryId, ...dataToUpdate } = finalData;

    await pool.query("UPDATE accessories SET ? WHERE id = ?", [dataToUpdate, id]);
    
    return await getAccessoryById(id) ?? null;
}

export async function deleteAccessory(id: string): Promise<boolean> {
    const [result] = await pool.query<OkPacket>("DELETE FROM accessories WHERE id = ?", [id]);
    return result.affectedRows > 0;
}
