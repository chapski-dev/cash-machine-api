import pool from "config/db";

export const initializeDatabase = async () => {
  try {
    await pool.connect();
    console.log("DB connected!");
  } catch (err: any) {
    console.error("Ошибка подключения к базе данных:", err?.message);
    throw err; // Передаем ошибку дальше, чтобы `index.ts` мог ее обработать
  }
};