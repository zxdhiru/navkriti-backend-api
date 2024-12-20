import { Router } from "express";
import { handleAddToCart } from "../controller/cart.controller";

const cartRoute = Router();
cartRoute.post("/", handleAddToCart)

export default cartRoute;