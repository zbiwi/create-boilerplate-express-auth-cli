export const controllerTemplate = (userFields) => {
  const fieldsToExtract = userFields.map(f => f.name).join(", ");
  const responseFields = userFields.filter(f => f.name !== "password").map(f => `${f.name}: user.${f.name}`).join(", ");
  const createFieldsList = userFields.map(f => f.name === "password" ? "password: hashed" : `${f.name}`).join(", ");
  
  // Check if role field exists
  const hasRole = userFields.some(f => f.name === "role");
  const tokenPayload = hasRole 
    ? "{ id: user.id || user._id, email: user.email, role: user.role }"
    : "{ id: user.id || user._id, email: user.email }";

  return `
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const register = async (req, res) => {
  try {
    const { ${fieldsToExtract} } = req.body;
    const existing = await User.findOne?.({ where: { email } }) || await User.findOne?.({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ ${createFieldsList} });

    res.status(201).json({ id: user.id || user._id, ${responseFields} });
  } catch(e){ res.status(500).json({ error:e.message }) }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne?.({ where: { email } }) || await User.findOne?.({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(${tokenPayload}, process.env.JWT_SECRET, { expiresIn:"1h" });
    res.json({ token, user: { id: user.id || user._id, ${responseFields} } });
  } catch(e){ res.status(500).json({ error:e.message }) }
};
`;
};

