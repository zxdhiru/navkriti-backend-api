import {Router } from 'express';
import { handleAddCoupon, handleValidateCoupon } from '../controller/coupon.controller';

const couponRoute = Router();
// PROTECTED ROUTES
couponRoute.post('/', handleAddCoupon)
couponRoute.post('/validate', handleValidateCoupon)

export default couponRoute