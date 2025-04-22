import sequelize from './config/db';
import swaggerUi from "swagger-ui-express";
import * as dotenv from "dotenv";
import express from "express";
import routers from "routes";
import bodyParser from "body-parser";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "swagger";

const app = express();
dotenv.config();

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", routers);

sequelize
  .authenticate()
  .then(() => {
    console.log('DB connected!')
  })
  .catch((err) => console.log('sequelize authenticate error: ', err?.message))

app.listen(process.env.PORT, () => {
  console.log(`Application started on port ${process.env.PORT}!`);
});
