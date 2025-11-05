export const serverTemplate = () => `
import app from "./app.js";
import "./config/db.js";
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`✅ Server running on port \${PORT}\`));
`;

