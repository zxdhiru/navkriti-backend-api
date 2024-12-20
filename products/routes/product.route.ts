import { Router } from "express";
import { handleAddProduct } from "../controller/product.controller";

const productRouter = Router();

productRouter.post('/', handleAddProduct)

export default productRouter;