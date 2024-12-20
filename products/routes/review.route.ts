import { Router } from "express";
import { handlePostReview } from "../controller/review.controller";
import { setRequestUser } from "../../middlewares/setRequest";

const reviewRoute = Router();

reviewRoute.post("/:slug/", setRequestUser, handlePostReview)

export default reviewRoute;