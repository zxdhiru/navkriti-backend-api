import { Router } from "express";
import {handleGetAllUsers, handleGetSingleUser, handleGetUserProfile, handleUserLogin, handleUserLogout, handleUserSignup} from "../controller/user.controller";
import { setRequestUser } from "../../middlewares/setRequest";

const UserRouter = Router();

// Route for user registration
UserRouter.post("/register",handleUserSignup);
UserRouter.post("/login",handleUserLogin);
UserRouter.post("/logout",setRequestUser, handleUserLogout);

// Route for fetching user details
UserRouter.get("/me",setRequestUser, handleGetUserProfile);
UserRouter.get("/all", handleGetAllUsers)
UserRouter.get("/:id", handleGetSingleUser);


export default UserRouter;
