import express from "express";

const userRouter = express.Router();

import { getUserbyId, updateUser } from "../controllers/user";
import { requireAuth } from "../middleware/auth";
import { checkRole } from "../middleware/checkRole";

userRouter.get("/:id", requireAuth, getUserbyId);

//only admin and medical staff can update user details.
userRouter.put("/update/:id", requireAuth, checkRole(["admin", "doctor", "nurse"]), updateUser);


export default userRouter;