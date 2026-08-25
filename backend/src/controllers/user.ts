import mongoose from "mongoose";
import type { Request, Response } from "express";

export const getUserbyId = async (req: Request, res: Response) => {

    
    try {
        const {id} = req.params; 

        const currentUser = (req as any).user; //assuming the user is attached to the request

        //check permission. a user can view their own profile
        if (currentUser.id !== id && currentUser.role !== "patient") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const queryId = id?.length === 24 ? new mongoose.Types.ObjectId(id as string) : id;
        const collection = mongoose.connection.collection("user");
        const user = await collection.findOne(
            { _id: queryId as mongoose.Types.ObjectId }, 
            { projection: { password: 0 } }
        );


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        res.json(user);
    

    }catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}


export const updateUser = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const {name, email, role, password, ...customFields} = req.body;


        const queryId = id?.length === 24 ? new mongoose.Types.ObjectId(id as string) : id;
        const collection = mongoose.connection.collection("user");

        const existingUser = await collection.findOne({ _id: queryId as mongoose.Types.ObjectId });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatePayload: any = {
            name,
            email,
            role,
            password,
            ...customFields
        };

        //remove undefined fields from the update payload
        Object.keys(updatePayload).forEach(
            key => (updatePayload[key] === undefined || updatePayload[key] === null) && delete updatePayload[key],
        );


        //update user
        const result = await collection.updateOne(
            { _id: new mongoose.Types.ObjectId(queryId as string) }, 
        { $set: updatePayload });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(
            { message: "User updated successfully" ,
              updateUser: result,

            }

        );

    }catch (error) {
        console.error("Error updating user by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}   