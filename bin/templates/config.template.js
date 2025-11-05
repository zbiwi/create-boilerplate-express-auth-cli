export const configTemplate = (orm) => {
  if (orm === "mongoose") {
    return `
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(()=>console.log("✅ MongoDB connecté")).catch(err=>console.error(err));
`;
  } else {
    const dialect = orm === "sequelize-postgres" ? "postgres" : "mysql";
    return `
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS,{
  host:process.env.DB_HOST,dialect:"${dialect}",logging:false
});
try{ await sequelize.authenticate(); console.log("✅ ${dialect} connecté"); } 
catch(err){ console.error(err); }
export default sequelize;
`;
  }
};

