export const googleControllerTemplate = () => {
    return `
import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const login = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Token manquant" });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        let user = await User.findOne?.({ where: { googleId: payload.sub } }) || await User.findOne?.({ googleId: payload.sub });
        if (!user) {
            user = await User.create({
                googleId: payload.sub,
                email: payload.email,
                googleName: payload.given_name,
                googleFamilyName: payload.family_name,
            });
        }

        const appToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({
            token: appToken,
            user: {
                id: user._id,
                name: user.name,
                googleName: user.googleName,
                googleFamilyName: user.googleFamilyName,
                email: user.email,
            },
        });
    } catch(error){ 
        console.error("Erreur Google OAuth:", error);
        res.status(401).json({ message: "Token Google invalide" });
    }
};
`;};