export const GoogleRoutesTemplate = (userFields) => {
    return `
        import express from "express";
        import passport from "passport";
        import { googleLogin, googleCallback, googleLogout } from "../../controllers/google/googleAuthController.js"
        const routerGoogle = express.Router();

        routerGoogle.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }), googleLogin);
        routerGoogle.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), googleCallback);
        routerGoogle.get("/google/logout", googleLogout);

        export default routerGoogle;
    `;
};

