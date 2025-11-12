## 🚀 Quick start

```bash
npx create-boilerplate-express-auth-cli
```

# ⚡ create-boilerplate-express-auth-cli

Because reconfiguring JWT, Express, Swagger, and an ORM for every project is time‑consuming.
This CLI saves you several hours on every new API.

A secure **Express MVC** API generator with **JWT**, **Swagger**, and an **ORM or ODM of your choice**:
- 🐘 PostgreSQL
- 🐬 MySQL
- 🍃 MongoDB (Mongoose)

[![npm version](https://img.shields.io/npm/v/create-boilerplate-express-auth-cli/svg)](https://www.npmjs.com/package/create-boilerplate-express-auth-cli)
[![GitHub stars](https://img.shields.io/github/stars/zbiwi/create-boilerplate-express-auth-cli.svg)](https://github.com/zbiwi/create-boilerplate-express-auth-cli/stargazers)


## 🛠️ Technologies used

Node.js / Express  
JWT (jsonwebtoken)  
bcryptjs  
Swagger UI Express  
Sequelize / Mongoose  
Google auth library  

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
│     └── google/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│     └── google/
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

## 🔐 Using Google Auth Library

- **Enable the option**: when running the CLI, answer `Yes` to *Do you want to add Google oauthConfig ?*. This scaffolds the Google routes/controllers and installs `google-auth-library`.
- **Configure Google Cloud**: create a project, enable *Google Identity Services*, set up an OAuth consent screen, and create a Web client ID. Add `http://localhost:3000/api/auth/google/login` to the list of authorized backend redirect URIs if needed.
- **Update `.env`**: paste your `GOOGLE_CLIENT_ID` into `GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com`, then restart the server (`npm run dev`).
- Don't forget to add the frontend address in app.js for allow the cors
- **Call the endpoint**: send the ID token returned by Google Sign-In to the backend via `POST /api/auth/google/login` with a JSON body `{ "token": "<GOOGLE_ID_TOKEN>" }`. If the user does not exist yet, it is created with `googleId`, `googleName`, and `googleFamilyName`.
- **Response payload**: the backend returns a standard JWT (`token`) along with the user info. Reuse this JWT for protected endpoints just like the classic auth flow.

Quick client-side example:

```html
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <title>tuto_react</title>
</head>
```

```js
const googleSignIn = async (googleToken) => {
  const res = await fetch("http://localhost:3000/api/auth/google/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token: googleToken }),
  });
  if (!res.ok) throw new Error("Google login failed");
  return res.json(); // { token, user }
};
```