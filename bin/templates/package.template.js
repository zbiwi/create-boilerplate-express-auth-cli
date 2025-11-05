export const packageTemplate = (projectName) => ({
  name: projectName,
  version: "1.0.0",
  type: "module",
  description: "API Express with auth JWT",
  main: "src/server.js",
  scripts: {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "db:seed": "node seed/seed.js",
    "db:reset": "node seed/reset.js"
  },
  keywords: ["express", "api", "auth", "jwt"],
  author: "",
  license: "MIT"
});

