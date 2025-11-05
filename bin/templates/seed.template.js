export const seedTemplate = (orm, userFields) => {
  // Generate default value for each field
  const generateDefaultValue = (field) => {
    const fieldLower = field.name.toLowerCase();
    
    switch (field.type) {
      case "string":
        if (fieldLower === "role") return '"admin"';
        return '"string_value"';
      case "number":
        return "0";
      case "boolean":
        return "false";
      case "date":
        return "null";
      default:
        return "null";
    }
  };

  // Generate additional constants
  const additionalConstants = userFields
    .filter(f => f.name !== "email" && f.name !== "password")
    .map(field => `  const ${field.name} = ${generateDefaultValue(field)};`)
    .join("\n");

  // Generate all fields for the create
  const allFields = userFields.map(f => f.name).join(", ");

  return `
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import User from "../src/models/user.js";
${orm === "mongoose" ? "import mongoose from 'mongoose'; await mongoose.connect(process.env.MONGO_URI);" : "import sequelize from '../src/config/db.js'; await sequelize.sync();" }

async function seed(){
  const email = "admin@example.com";
  const password = await bcrypt.hash("admin123", 10);
${additionalConstants}

  const existing = await User.findOne?.({ email }) || await User.findOne?.({ where:{email} });
  if(!existing) {
    await User.create({ ${allFields} });
    console.log("✅ Seed completed");
  } else {
    console.log("ℹ️  Admin user already exists");
  }
  ${orm === "mongoose" ? "mongoose.disconnect();" : ""}
}
seed();
`;
};

