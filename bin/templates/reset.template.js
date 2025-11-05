export const resetTemplate = (orm) => {
  if (orm === "mongoose") {
    return `
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "../src/models/user.js";
await mongoose.connect(process.env.MONGO_URI);

async function reset() {
  try {
    const result = await User.deleteMany({});
    console.log(\`🗑️  \${result.deletedCount} user(s) deleted\`);
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
reset();
`;
  } else {
    return `
import dotenv from "dotenv";
dotenv.config();
import sequelize from "../src/config/db.js";
import User from "../src/models/user.js";
await sequelize.authenticate();

async function reset() {
  try {
    // Count users before deleting
    const count = await User.count();
    
    // Delete all users
    await User.destroy({ where: {}, truncate: true });
    
    console.log(\`🗑️  \${count} user(s) deleted\`);
    await sequelize.close();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
reset();
`;
  }
};

