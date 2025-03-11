import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/generateToken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRATION = '1h'; 

export const register = async (req: Request, res: Response) => {
    try {
        console.log("Request body:", req?.body); // Add this line to log the request body

        if (!req.body) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        const { username = "DefaultName", password } = req.body;

        if (!username  || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }


        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: "An account with this name already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, password: hashedPassword }) as any;

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("this is the error " + error);
        res.status(500).json({ message: "Something went wrong server side" });
    }
};


// Login user
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req?.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (req.cookies.jwt) {
            return res.status(400).json({ message: "User already logged in" });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        if(password.length < 6){    
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            username: user.username,
            password: user.password,
      
        });

    } catch (error) {
        console.log("this is the error " + error);
        res.status(500).json({ message: "Something went wrong server side" });
    }
};

// Logout user
export const logout = (req: Request, res: Response) => {
    try {
        
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict',
        });
                res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({ message: 'Successfully logged out' });

    } catch (error) {
        console.log("this is the error " + error);
        res.status(500).json({ message: "Something went wrong server side" });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User is not here " });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("this is the error " + error);
        res.status(500).json({ message: "Something went wrong server side" });
    }
};