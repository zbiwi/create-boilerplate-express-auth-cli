// Helper: convertir type vers Mongoose
const toMongooseType = (type) => {
  const map = { string: "String", number: "Number", boolean: "Boolean", date: "Date" };
  return map[type] || "String";
};

// Helper: convertir type vers Sequelize
const toSequelizeType = (type) => {
  const map = { string: "STRING", number: "INTEGER", boolean: "BOOLEAN", date: "DATE" };
  return map[type] || "STRING";
};

export const modelTemplate = (orm, userFields, timestamps = true, oauthConfig) => {
  if (orm === "mongoose") {
    const schemaFields = userFields.map(field => {
      const options = [];
      options.push(`type: ${toMongooseType(field.type)}`);
      if (field.required) options.push("required: true");
      if (field.unique) options.push("unique: true");
      return `  ${field.name}: { ${options.join(", ")} }`;
    }).join(",\n");

    // --- Si OAuth activé, on ajoute les champs spécifiques + logique conditionnelle
    const oauthExtra = oauthConfig?.oauth ? `
  googleId: { type: String },
` : "";

    const passwordLogic = oauthConfig?.oauth
      ? `required: function() { return !this.googleId; }`
      : `required: true`;

    // On injecte la logique spéciale pour le champ password si présent
    const schemaCode = userFields.map(field => {
      if (field.name === "password") {
        const options = [
          `type: ${toMongooseType(field.type)}`,
          passwordLogic,
        ];
        return `  ${field.name}: { ${options.join(", ")} }`;
      } else {
        const options = [];
        options.push(`type: ${toMongooseType(field.type)}`);
        if (field.required) options.push("required: true");
        if (field.unique) options.push("unique: true");
        return `  ${field.name}: { ${options.join(", ")} }`;
      }
    }).join(",\n");

    return `
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
${schemaCode},
${oauthExtra}
}${timestamps ? ', { timestamps: true }' : ''});

export default mongoose.model("User", userSchema);
`;
  }

  // --- Cas Sequelize ---
  else {
    const schemaFields = userFields.map(field => {
      const options = [];
      options.push(`type: DataTypes.${toSequelizeType(field.type)}`);
      if (field.required) options.push("allowNull: false");
      if (field.unique) options.push("unique: true");
      return `  ${field.name}: { ${options.join(", ")} }`;
    }).join(",\n");

    // Ajout du champ googleId si OAuth actif
    const oauthExtra = oauthConfig?.oauth ? `,\n  googleId: { type: DataTypes.STRING }` : "";

    return `
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
${schemaFields}${oauthExtra}
}${timestamps ? ', { timestamps: true }' : ''});

await User.sync();
export default User;
`;
  }
};
