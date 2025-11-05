export const appTemplate = () => `
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import { setupSwagger } from "./swagger.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/api/auth", authRoutes);
setupSwagger(app);

export default app;
`;

