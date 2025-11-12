export const googleRoutesTemplate = () => {
    return `
import express from "express";
import { login } from "../../controllers/google/googleAuthController.js";
const router = express.Router();

router.post("/login", login);

export default router;
`;};