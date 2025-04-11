import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const MAX_TOKEN_AGE = 24 * 60 * 60; // 24 hours in seconds

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token and get user id
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    
    // Check token age
    const now = Math.floor(Date.now() / 1000);
    if (decoded.iat && now - decoded.iat > MAX_TOKEN_AGE) {
      return res.status(401).json({ message: "Token expired" });
    }

    // Get fresh user data from database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }


    // Attach fresh user data to request
    req.user = {
      id: user.id,
      userType: user.user_type,
      email: user.email,
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ 
        message: "You do not have permission to perform this action"
      });
    }
    next();
  };
};
