import mongoose from "mongoose";
import type { Request, Response } from "express";

export const getUserbyId = async (req: Request, res: Response) => {

    
    try {
        const id = req.params;
        
    

    }catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}