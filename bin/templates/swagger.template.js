export const swaggerTemplate = () => `
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "API", version: "1.0.0", description: "API Express with JWT and Swagger" },
    servers: [{ url: "http://localhost:3000" }],
    components: { securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } } },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/routes/*.js"]
};
export function setupSwagger(app) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)));
}
`;

