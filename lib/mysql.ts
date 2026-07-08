import mysql from 'mysql2/promise';

const connectionString = process.env.DATABASE_URL;

export const isMySQLConfigured = !!connectionString;

let pool: mysql.Pool | null = null;

if (isMySQLConfigured) {
  try {
    pool = mysql.createPool({
      uri: connectionString,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  } catch (error) {
    console.error('MySQL connection pool initialization failed:', error);
  }
}

export { pool };
