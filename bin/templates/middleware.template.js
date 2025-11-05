export const middlewareTemplate = () => `
import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });
  try { 
    req.user = jwt.verify(token, process.env.JWT_SECRET); 
    next(); 
  } catch { 
    res.status(401).json({ message: "Invalid token" }); 
  }
}

// Middleware to check user role
export function checkRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (!req.user.role) {
      return res.status(403).json({ message: "Role not defined for this user" });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: \`Access denied. Required role: \${allowedRoles.join(" or ")}\` 
      });
    }
    
    next();
  };
}

export default auth;
`;

