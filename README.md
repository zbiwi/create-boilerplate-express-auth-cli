# ⚡ create-boilerplate-express-auth-cli

Because reconfiguring JWT, Express, Swagger, and an ORM for every project is time‑consuming.
This CLI saves you several hours on every new API.

A secure **Express MVC** API generator with **JWT**, **Swagger**, and an **ORM or ODM of your choice**:
- 🐘 PostgreSQL
- 🐬 MySQL
- 🍃 MongoDB (Mongoose)

[![npm version](https://img.shields.io/npm/v/create-boilerplate-express-auth-cli/svg)](https://www.npmjs.com/package/create-boilerplate-express-auth-cli)
[![GitHub stars](https://img.shields.io/github/stars/zbiwi/create-boilerplate-express-auth-cli.svg)](https://github.com/zbiwi/create-boilerplate-express-auth-cli/stargazers)

---

## 🛠️ Technologies used

Node.js / Express

JWT (jsonwebtoken)

bcryptjs

Swagger UI Express

Sequelize / Mongoose

---
## 🚀 Quick start

```bash
npx create-boilerplate-express-auth-cli
```

## 🧠 What this generator does

✅ Automatically scaffolds a ready‑to‑use Express MVC API  
✅ Automatic generation of the User entity via the CLI  
✅ JWT authentication (/auth/register, /auth/login)  
✅ Middleware generation to protect routes  
✅ Swagger documentation available at /api/docs  
✅ Choose your ODM/ORM: Mongoose, Sequelize (MySQL or Postgres)  
✅ Project structured with controllers, routes, models  
✅ .http file to test routes directly  
✅ seed.js script to populate the database

## 🏗️ Generated project structure

```bash
my-api/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   ├── server.js
│   └── swagger.js
├── http/
│   └── auth.http
├── seed/
│   ├── reset.js
│   └── seed.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🧩 Example usage
⚠️ For MySQL and Postgres, you must create the database manually.
```bash
# 1️⃣ Create a new project
npx create-boilerplate-express-auth-cli

# 2️⃣ Choose your ORM/ODM
? ORM to use:
  ❯ mongoose
    sequelize-mysql
    sequelize-postgres

    [...]
    [...]

# 3️⃣ Enter your folder
cd my-api

# 4️⃣ Start the server
npm run dev
```

## 🌍 Swagger documentation

Swagger documentation is generated automatically.  
Access it at:

```bash
http://localhost:3000/api/docs
```

## 🧾 Example .http file

The `http/auth.http` file lets you test routes directly:

```bash
### Register
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}

### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}
```