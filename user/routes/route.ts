import { Router } from "express";
import handleUserSignup from "../controller/userController";

const UserRouter = Router();

// Route for user registration
UserRouter.route("/register").post(handleUserSignup);

export default UserRouter;
