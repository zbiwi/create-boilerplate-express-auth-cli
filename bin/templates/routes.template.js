export const routesTemplate = (userFields) => {
  // Générer les champs requis pour Swagger
  const requiredFields = userFields.filter(f => f.required).map(f => `\n *               - ${f.name}`).join("");
  
  // Générer les propriétés pour Swagger
  const swaggerProperties = userFields.filter(f => f.name !== "password").map(field => {
    const swaggerType = field.type === "date" ? "string" : field.type;
    const format = field.name === "email" ? "\n *                 format: email" : "";
    const example = field.type === "string" ? `"example_${field.name}"` : 
                   field.type === "number" ? "123" :
                   field.type === "boolean" ? "true" : 
                   field.type === "date" ? '"2024-01-01"' : '""';
    return `\n *               ${field.name}:\n *                 type: ${swaggerType}${format}\n *                 example: ${example}`;
  }).join("");

  const responseProperties = userFields.filter(f => f.name !== "password").map(f => 
    `\n *                 ${f.name}:\n *                   type: ${f.type === "date" ? "string" : f.type}`
  ).join("");

  return `
import express from "express";
import { register, login } from "../controllers/authController.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Routes d'authentification
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Créer un compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:${requiredFields}
 *             properties:${swaggerProperties}
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string${responseProperties}
 *       400:
 *         description: Email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Utilisateur introuvable
 *       401:
 *         description: Mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */
router.post("/login", login);

export default router;
`;
};

