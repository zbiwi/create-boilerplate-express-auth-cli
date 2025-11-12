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

    
    const oauthExtra = oauthConfig?.oauth ? `
    googleId:{type: String, required: true, unique: true },
    googleName:{type: String, required: false },
    googleFamilyName:{type: String, required: false },
` : "";

    const passwordLogic = oauthConfig?.oauth
      ? `required: function() { return !this.googleId; }`
      : `required: true`;


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

  else {
    const passwordSequelizeOptions = oauthConfig?.oauth
      ? [
          "allowNull: true",
          `validate: {
    notEmptyIfNoGoogle(value) {
      if (!this.googleId && (!value || value.trim() === "")) {
        throw new Error("Password is required unless signed in with Google");
      }
    }
  }`
        ]
      : ["allowNull: false"];

    const schemaFields = userFields.map(field => {
      if (field.name === "password") {
        const options = [
          `type: DataTypes.${toSequelizeType(field.type)}`,
          ...passwordSequelizeOptions
        ];
        if (field.unique) options.push("unique: true");
        return `  ${field.name}: { ${options.join(", ")} }`;
      } else {
        const options = [];
        options.push(`type: DataTypes.${toSequelizeType(field.type)}`);
        if (field.required) options.push("allowNull: false");
        if (field.unique) options.push("unique: true");
        return `  ${field.name}: { ${options.join(", ")} }`;
      }
    }).join(",\n");

    const oauthExtra = oauthConfig?.oauth ? `,\n  googleId: { type: DataTypes.STRING, allowNull: false, unique: true }, \n googleName:{type: DataTypes.STRING, allowNull: false }, \n googleFamilyName:{type: DataTypes.STRING, allowNull: false },` : "";

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