import { Router } from "express";
import { handleCreateOrder } from "../controller/order.controller";
import { setRequestUser } from "../../middlewares/setRequest";

const orderRoute = Router()

orderRoute.post('/', setRequestUser, handleCreateOrder)

export default orderRoute