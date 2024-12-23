import { Router } from "express";
import { handleAddProduct, handleGetProducts, handleGetSingleProduct } from "../controller/product.controller";

const productRouter = Router();

// PROTECTED ROUTES
productRouter.post('/', handleAddProduct)
productRouter.get('/', handleGetProducts)
productRouter.get('/:slug', handleGetSingleProduct)

export default productRouter;