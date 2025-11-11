#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import {
  appTemplate,
  serverTemplate,
  swaggerTemplate,
  middlewareTemplate,
  controllerTemplate,
  routesTemplate,
  modelTemplate,
  configTemplate,
  envTemplate,
  gitignoreTemplate,
  httpTemplate,
  seedTemplate,
  resetTemplate,
  readmeTemplate,
  packageTemplate,
  GoogleControllerTemplate,
  GoogleRoutesTemplate,
  PassportConfigTemplate
} from './templates/export.js';

const run = (cmd, cwd = process.cwd()) => execSync(cmd, { stdio: "inherit", cwd });

const { orm, projectName } = await inquirer.prompt([
  {
    type: "list",
    name: "orm",
    message: "Choose your ORM / database :",
    choices: ["mongoose", "sequelize-postgres", "sequelize-mysql"],
  },
  {
    type: "input",
    name: "projectName",
    message: "Project name :",
    default: "my-api",
  },
]);

// ================== Oauth2 configuration ==================
console.log("\n🔒 Oauth2 configuration");

const oauthConfig = await inquirer.prompt([
  {
    type: "confirm",
    name: "oauth",
    message: "Do you want to add oauthConfig ?",
    default: true,
  },
]);

// ================== User model configuration ==================
console.log("\n📝 User model configuration");
console.log("The fields 'email' and 'password' are included by default.\n");

const modelConfig = await inquirer.prompt([
  {
    type: "confirm",
    name: "timestamps",
    message: "Add timestamps (createdAt, updatedAt) ?",
    default: true,
  },
  {
    type: "confirm",
    name: "addRole",
    message: "Add a 'role' field for user roles ?",
    default: false,
  }
]);

const userFields = [
  { name: "email", type: "string", required: true, unique: true },
  { name: "password", type: "string", required: true, unique: false }
];

// Add role field if requested
if (modelConfig.addRole) {
  userFields.push({ name: "role", type: "string", required: true, unique: false });
  console.log("✅ Field 'role' added (string) [required]\n");
}

let addMoreFields = true;

while (addMoreFields) {
  const fieldAnswers = await inquirer.prompt([
    {
      type: "confirm",
      name: "addField",
      message: "Do you want to add a additional field ?",
      default: false,
    },
  ]);

  if (!fieldAnswers.addField) {
    addMoreFields = false;
    break;
  }

  const fieldDetails = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Field name :",
      validate: (input) => {
        if (!input) return "The field name cannot be empty";
        if (userFields.find(f => f.name === input)) return "This field already exists";
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(input)) return "Invalid name (letters, numbers, _ only)";
        return true;
      }
    },
    {
      type: "list",
      name: "type",
      message: "Field type :",
      choices: ["string", "number", "boolean", "date"],
    },
    {
      type: "confirm",
      name: "required",
      message: "Required field ?",
      default: false,
    },
    {
      type: "confirm",
      name: "unique",
      message: "Unique field ?",
      default: false,
    },
  ]);

  userFields.push(fieldDetails);
  console.log(`✅ Field "${fieldDetails.name}" added (${fieldDetails.type})\n`);
}

const projectPath = path.join(process.cwd(), projectName);
if (!fs.existsSync(projectPath)) fs.mkdirSync(projectPath, { recursive: true });

// Folders creation
const folders = 
[
  "src",
  "src/controllers",
  "src/routes",
  "src/models",
  "src/config",
  "src/middleware", 
  "seed", 
  "http"
]

if(oauthConfig.oauth) {
  folders.push("src/controllers/google");
  folders.push("src/routes/google");
}

folders.forEach(dir => {
  fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
});

if(oauthConfig.oauth) {
  fs.writeFileSync(path.join(projectPath, "src/controllers/google/googleAuthController.js"), GoogleControllerTemplate());
  fs.writeFileSync(path.join(projectPath, "src/routes/google/googleAuth.js"), GoogleRoutesTemplate());
  fs.writeFileSync(path.join(projectPath, "src/config/passport.js"), PassportConfigTemplate());
}
// ================== Generate all files ==================
console.log("📝 Generate files...");

fs.writeFileSync(path.join(projectPath, "src/app.js"), appTemplate(oauthConfig));
fs.writeFileSync(path.join(projectPath, "src/server.js"), serverTemplate());
fs.writeFileSync(path.join(projectPath, "src/swagger.js"), swaggerTemplate());
fs.writeFileSync(path.join(projectPath, "src/middleware/auth.js"), middlewareTemplate());
fs.writeFileSync(path.join(projectPath, "src/controllers/authController.js"), controllerTemplate(userFields));
fs.writeFileSync(path.join(projectPath, "src/routes/auth.js"), routesTemplate(userFields));
fs.writeFileSync(path.join(projectPath, "src/models/user.js"), modelTemplate(orm, userFields, modelConfig.timestamps, oauthConfig));
fs.writeFileSync(path.join(projectPath, "src/config/db.js"), configTemplate(orm));
fs.writeFileSync(path.join(projectPath, ".env.example"), envTemplate(orm));
fs.writeFileSync(path.join(projectPath, ".gitignore"), gitignoreTemplate());
fs.writeFileSync(path.join(projectPath, "http/auth.http"), httpTemplate(userFields));
fs.writeFileSync(path.join(projectPath, "seed/seed.js"), seedTemplate(orm, userFields));
fs.writeFileSync(path.join(projectPath, "seed/reset.js"), resetTemplate(orm));
fs.writeFileSync(path.join(projectPath, "README.md"), readmeTemplate(projectName, userFields));
fs.writeFileSync(path.join(projectPath, "package.json"), JSON.stringify(packageTemplate(projectName), null, 2));

// ================== Install dependencies ==================
console.log("📦 Install dependencies...");
let deps = ["express","jsonwebtoken","bcrypt","dotenv","cors","helmet","swagger-ui-express","swagger-jsdoc"];
if(oauthConfig.oauth) {
  deps.push("passport", "passport-google-oauth20", "express-session");
}
if (orm === "mongoose") deps.push("mongoose");
if (orm.includes("sequelize")) deps.push("sequelize","pg","pg-hstore","mysql2");

run(`npm install ${deps.join(" ")}`, projectPath);

console.log("📦 Install development dependencies...");
run(`npm install --save-dev nodemon`, projectPath);

// ================== Summary ==================
console.log("\n✅ Project generated successfully !");
console.log("\n📋 User model created with the following fields :");
userFields.forEach(field => {
  const badges = [];
  if (field.required) badges.push("required");
  if (field.unique) badges.push("unique");
  const badgeStr = badges.length ? ` [${badges.join(", ")}]` : "";
  console.log(`  - ${field.name} (${field.type})${badgeStr}`);
});
if (modelConfig.timestamps) {
  console.log(`  - createdAt (date) [auto]`);
  console.log(`  - updatedAt (date) [auto]`);
}
console.log("\n🚀 Commands to start :");
console.log(`   cd ${projectName}`);
console.log(`   cp .env.example .env  # Configure your environment variables`);
console.log(`   npm run dev`);
console.log(`\n📖 Swagger documentation : http://localhost:3000/api/docs`);
console.log(`\n🌱 Seed : npm run db:seed (admin@example.com / admin123)`);
