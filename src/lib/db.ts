// src/lib/db.ts
import mysql from 'mysql2/promise';
import 'dotenv/config';

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;

// Helper to convert MySQL RowDataPacket to a plain object
export function toPlainObject<T>(rows: any): T {
    return JSON.parse(JSON.stringify(rows));
}
