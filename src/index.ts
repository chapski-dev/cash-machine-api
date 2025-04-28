import * as dotenv from "dotenv";
dotenv.config();

import { initializeDatabase } from "./database";
import { createApp } from "./server";

async function startApp() {
  try {
    await initializeDatabase(); // First connect to DB
    const app = createApp();    // Init express app
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Application started on port ${process.env.PORT || 3000}!`);
    });
  } catch (err) {
    console.error("Failed to start the application:", err);
    process.exit(1); // Terminate if somthing went wrong
  }
}

startApp();