import {Router} from 'express';
import { handleAddAddress } from '../controller/address.controller';

const addressRouter = Router();

addressRouter.post('/', handleAddAddress);