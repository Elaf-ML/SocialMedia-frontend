import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const checkLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.jwt;
    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const user = await User.findById((decoded as any)._id);
        if (user) {
            return res.status(200).json({ message: 'You are already logged in' });
        }
    } catch (error) {
        return next();
    }

    next();
};

export default checkLoggedIn;
