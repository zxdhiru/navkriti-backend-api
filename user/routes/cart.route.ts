import { Router } from "express";
import { handleAddToCart } from "../controller/cart.controller";
import { setRequestUser } from "../../middlewares/setRequest";

const cartRoute = Router();
cartRoute.post("/", setRequestUser,  handleAddToCart)

export default cartRoute;