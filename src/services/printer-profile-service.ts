
import pool, { toPlainObject } from '@/lib/db';
import type { PrinterProfile, PrinterProfileFormData } from "@/types";
import type { RowDataPacket, OkPacket } from 'mysql2';

type PrinterProfileRow = PrinterProfile & RowDataPacket;

export async function getPrinterProfiles(): Promise<PrinterProfile[]> {
  const [rows] = await pool.query<PrinterProfileRow[]>("SELECT * FROM printer_profiles ORDER BY nombrePerfilImpresora ASC");
  return toPlainObject(rows);
}

export async function getPrinterProfileById(id: string): Promise<PrinterProfile | undefined> {
  const [rows] = await pool.query<PrinterProfileRow[]>("SELECT * FROM printer_profiles WHERE id = ?", [id]);
  return toPlainObject(rows[0]);
}

export async function createPrinterProfile(formData: PrinterProfileFormData): Promise<PrinterProfile> {
    if (!formData.nombrePerfilImpresora) {
        throw new Error("El nombre del perfil es obligatorio.");
    }
    
    const newProfileData = {
        ...formData,
        fechaUltimaActualizacionConfig: new Date(),
    };

    const [result] = await pool.query<OkPacket>("INSERT INTO printer_profiles SET ?", newProfileData);
    
    const newId = result.insertId;

    return (await getPrinterProfileById(String(newId)))!;
}

export async function updatePrinterProfile(id: string, formData: Partial<PrinterProfileFormData>): Promise<PrinterProfile | null> {
    const profileToUpdate = await getPrinterProfileById(id);
    if (!profileToUpdate) {
        return null;
    }
    
    const finalData = { 
        ...profileToUpdate, 
        ...formData,
        fechaUltimaActualizacionConfig: new Date(),
    };

    const { id: profileId, ...dataToUpdate } = finalData;

    await pool.query("UPDATE printer_profiles SET ? WHERE id = ?", [dataToUpdate, id]);

    return await getPrinterProfileById(id) ?? null;
}

export async function deletePrinterProfile(id: string): Promise<boolean> {
  const [result] = await pool.query<OkPacket>("DELETE FROM printer_profiles WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
