import { Router } from "express";
import {handleGetAllUsers, handleGetSingleUser, handleGetUserProfile, handleUserLogin, handleUserLogout, handleUserSignup, handleVerifyUser} from "../controller/user.controller";
import { setRequestUser } from "../../middlewares/setRequest";

const UserRouter = Router();

// Route for user registration
UserRouter.post("/register",handleUserSignup);
UserRouter.post("/verify",setRequestUser,handleVerifyUser);
UserRouter.post("/login",handleUserLogin);
UserRouter.post("/logout",setRequestUser, handleUserLogout);

// Route for fetching user details
UserRouter.get("/me",setRequestUser, handleGetUserProfile); 
UserRouter.get("/all", handleGetAllUsers) //protected route
UserRouter.get("/:id", handleGetSingleUser); //protected route


export default UserRouter;
