export const envTemplate = (orm, oauthConfif) => `
PORT=3000
JWT_SECRET=your_secret_key
${oauthConfif.oauth ? "GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com" : ``}
${orm === "mongoose" ? "MONGO_URI=mongodb://localhost:27017/my_api" : `
DB_HOST=localhost
DB_NAME=my_api
DB_USER=root
DB_PASS=password
DB_DIALECT=${orm === "sequelize-postgres" ? "postgres" : "mysql"}`}
`;

