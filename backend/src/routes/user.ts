import express from "express";

const userRouter = express.Router();

import { getUserbyId, updateUser } from "../controllers/user";
import { requireAuth } from "../middleware/auth";

userRouter.get("/:id", requireAuth, getUserbyId);

//only admin and medical staff can update user details.
userRouter.put("/update/:id", requireAuth, updateUser);


export default userRouter;