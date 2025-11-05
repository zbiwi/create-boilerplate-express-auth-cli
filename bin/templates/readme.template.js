export const readmeTemplate = (projectName, userFields) => {
  const userFieldsDocs = userFields.map(field => {
    const badges = [];
    if (field.required) badges.push("required");
    if (field.unique) badges.push("unique");
    const badgeStr = badges.length ? ` [${badges.join(", ")}]` : "";
    return `- **${field.name}**: ${field.type}${badgeStr}`;
  }).join("\n");

  return `
# ${projectName}

API Express generated dynamically with JWT and Swagger.

## User model

${userFieldsDocs}

## Installation

\`\`\`bash
cd ${projectName}
cp .env.example .env  # Configure your environment variables
npm install
\`\`\`

## Start

\`\`\`bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
\`\`\`

## Documentation Swagger

Access the interactive API documentation :  
🔗 [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Seed

Create an user by default (if you have added additional fields, don't forget to add values to the seed):

If you use Mysql you have to create the database before to run the seed command
\`\`\`bash
MYSQL : CREATE DATABASE my_api;
\`\`\`

If you use Postgres you have to create the user before to run the seed command
\`\`\`bash
POSTGRES : CREATE USER my_api WITH PASSWORD 'password';
\`\`\`

\`\`\`bash
npm run db:seed
\`\`\`

**Login credentials :**
- Email: \`admin@example.com\`
- Password: \`admin123\`

To reset all users :

\`\`\`bash
npm run db:reset
\`\`\`

## Role-based Access Control

If you added a \`role\` field, you can protect routes by role:

\`\`\`javascript
import { auth, checkRole } from "./middleware/auth.js";

// Only admins can access
router.get("/admin", auth, checkRole("admin"), (req, res) => {
  res.json({ message: "Admin only" });
});

// Admins or moderators
router.get("/moderation", auth, checkRole("admin", "moderator"), (req, res) => {
  res.json({ message: "Admin or moderator only" });
});
\`\`\`

## Tests HTTP

A file \`http/auth.http\` is available to test the API with the extension [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) of VS Code.

## Project structure

\`\`\`
${projectName}/
├── src/
│   ├── app.js              # Configuration Express
│   ├── server.js           # Entry point
│   ├── swagger.js          # Configuration Swagger
│   ├── controllers/        # Business logic
│   ├── routes/             # Routes API
│   ├── models/             # Data models
│   ├── middleware/         # Middleware (auth, etc.)
│   └── config/             # Database configuration
├── seed/                   # Seed scripts
├── http/                   # Tests HTTP
└── .env.example            # Environment variables
\`\`\`
`;
};

