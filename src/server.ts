import express from "express";
import routers from "routes";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "swagger";
import * as Sentry from "@sentry/node";

export const createApp = () => {
  const app = express();

  // Swagger
  const swaggerDocs = swaggerJSDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // Middleware
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Routes
  app.use("/api", routers);

  // Sentry
  Sentry.init({
    dsn: process.env.DNS,

    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
  });
  Sentry.setupExpressErrorHandler(app);

  return app;
};