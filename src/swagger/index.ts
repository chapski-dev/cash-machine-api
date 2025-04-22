export const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "App API",
      description:
        "API for getting, creating and updating users and their todo tasks",
      version: "1.0.0",
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            name: "Authorization",
          },
        },
      },
      contact: {
        name: "Chappa Savagge Dev",
        email: "alexey.chapski@gmail.com",
      },
      servers: ["http://localhost:3000"],
    },
  },
  apis: ["./src/swagger/docs/*/*.js"],
};