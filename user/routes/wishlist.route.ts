import { Router } from "express";
import { handleAddToWishlist } from "../controller/wishlist.controller";
import { setRequestUser } from "../../middlewares/setRequest";
const wishlistRoute = Router();

wishlistRoute.post("/",setRequestUser, handleAddToWishlist)

export default wishlistRoute;