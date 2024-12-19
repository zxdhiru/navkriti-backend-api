import { Router } from "express";
import {handleUserLogin, handleUserLogout, handleUserSignup} from "../controller/userController";
import { setRequestUser } from "../../middlewares/setRequest";

const UserRouter = Router();

// Route for user registration
UserRouter.post("/register",handleUserSignup);
UserRouter.post("/login",handleUserLogin);
UserRouter.post("/logout",setRequestUser, handleUserLogout);


export default UserRouter;
