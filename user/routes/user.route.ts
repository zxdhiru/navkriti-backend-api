import { Router } from "express";
import {handleGetAllUsers, handleGetSingleUser, handleGetUserProfile, handleRefreshToken, handleUserLogin, handleUserLogout, handleUserSignup, handleVerifyUser} from "../controller/user.controller";
import { checkForAdmin, setRequestUser } from "../../middlewares/setRequest";

const UserRouter = Router();

// Route for user registration
UserRouter.post("/register",handleUserSignup);
UserRouter.post("/verify",setRequestUser,handleVerifyUser);
UserRouter.post("/login",handleUserLogin);
UserRouter.post("/logout",setRequestUser, handleUserLogout);
UserRouter.post("/refresh-token",setRequestUser, handleRefreshToken);

// Route for fetching user details
UserRouter.get("/me",setRequestUser, handleGetUserProfile); 
UserRouter.get("/all", setRequestUser, checkForAdmin, handleGetAllUsers) //protected route
UserRouter.get("/:id",  handleGetSingleUser); //protected route


export default UserRouter;
