import { Router } from "express";
import { handlePostReview } from "../controller/review.controller";

const reviewRoute = Router();

reviewRoute.post("/:productId/:userId", handlePostReview)

export default reviewRoute;