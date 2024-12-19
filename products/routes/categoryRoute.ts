import {Router } from 'express';
import { handleAddCategory } from '../controller/category.controller';

const categoryRoute = Router();

categoryRoute.post('/', handleAddCategory)

export default categoryRoute