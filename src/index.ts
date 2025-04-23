import pool from "config/db";
import swaggerUi from "swagger-ui-express";
import * as dotenv from "dotenv";
import express from "express";
import routers from "routes";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "swagger";

const app = express();
dotenv.config();

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", routers);

pool.connect()
  .then(() => {
    console.log('DB connected!');
  })
  .catch((err) => console.log('pg pool connect error: ', err?.message));

app.listen(process.env.PORT, () => {
  console.log(`Application started on port ${process.env.PORT}!`);
});
