import jwt from 'jsonwebtoken';

export const generateToken = (userID: string, res: any) => {
 if (!process.env.JWT_SECRET) {
   throw new Error("JWT_SECRET is not defined");
 }
 const token = jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: "15d" })

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 15,
    });}