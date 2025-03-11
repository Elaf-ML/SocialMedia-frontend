// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import User from '../models/userModel';

// const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//     if (req.path === '/api/auth/register' || req.path === '/api/auth/login') {
//         return next();
//     }

//     const token = req.header('x-auth-token');
//     if (!token) {
//         return res.status(401).json({ message: 'Access denied. No token provided.' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//         const user = await User.findById((decoded as any)._id);
//         req.user = user ? user : undefined;
//         next();
//     } catch (error) {
//         res.status(400).json({ message: 'Invalid token.' });
//     }
// };

// export default authMiddleware;

import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from '../models/userModel';

// Extend Express Request to include user
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Define token structure
interface DecodedToken extends JwtPayload {
  userID: string;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not defined" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

    if (!decoded?.userID) {
      return res.status(401).json({ message: "Invalid token" });
    }

    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.userID).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
