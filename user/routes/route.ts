import { Router } from "express";
import handleUserSignup from "../controller/userController";

const UserRouter = Router();

// Route for user registration
UserRouter.post("/register",handleUserSignup);


export default UserRouter;
