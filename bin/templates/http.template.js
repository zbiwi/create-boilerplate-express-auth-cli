export const httpTemplate = (userFields) => {
  const generateHttpFields = () => {
    return userFields.map(field => {
      let exampleValue;
      const fieldLower = field.name.toLowerCase();
      
      if (field.name === "email") exampleValue = '"test@example.com"';
      else if (field.name === "password") exampleValue = '"123456"';
      else {
        switch (field.type) {
          case "string":
            if (fieldLower.includes("name")) exampleValue = '"John"';
            else if (fieldLower.includes("lastname")) exampleValue = '"Doe"';
            else if (fieldLower.includes("phone")) exampleValue = '"+1234567890"';
            else exampleValue = `"example_${field.name}"`;
            break;
          case "number":
            exampleValue = fieldLower.includes("age") ? "25" : "123";
            break;
          case "boolean":
            exampleValue = "true";
            break;
          case "date":
            exampleValue = '"2024-01-01"';
            break;
          default:
            exampleValue = '""';
        }
      }
      return `  "${field.name}": ${exampleValue}`;
    }).join(",\n");
  };

  return `
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
${generateHttpFields()}
}

###

POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}
`;
};

