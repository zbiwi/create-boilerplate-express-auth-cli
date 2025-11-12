export const appTemplate = (oauthConfig) => `
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";


${oauthConfig.oauth ? 'import googleAuthRoutes from "./routes/google/googleAuth.js";' : ''}


import { setupSwagger } from "./swagger.js";
dotenv.config();

const app = express();
app.use(express.json());

${oauthConfig.oauth ? `
app.use(cors({
    origin: "http://localhost:5173", // <= Add your frontend address
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization"
    ],
    credentials: true
}));    
` : `app.use(cors());`}

app.use(helmet());

app.use("/api/auth", authRoutes);


${oauthConfig.oauth ? 'app.use("/api/auth/google", googleAuthRoutes);' : ''}

setupSwagger(app);

export default app;
`;

