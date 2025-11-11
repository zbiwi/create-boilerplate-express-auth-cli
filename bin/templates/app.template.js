export const appTemplate = (oauthConfig) => {
    const oauthSetup = oauthConfig.oauth ? `
        import session from "express-session";
        import passport from "passport";
        import "./config/passport.js";
        import routerGoogle from "./routes/google/googleAuth.js";
        app.use(
            session({
                secret: process.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
            })
        );
        app.use(passport.initialize());
        app.use(passport.session());
        app.use('/api', routerGoogle)
        `
        : "";

    return `
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
        ${oauthSetup}
        app.use("/api/auth", authRoutes);
        setupSwagger(app);

        export default app;
    `;
};
