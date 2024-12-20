import {Router} from 'express';
import { handleAddAddress } from '../controller/address.controller';
import { setRequestUser } from '../../middlewares/setRequest';

const addressRouter = Router();

addressRouter.post('/', setRequestUser, handleAddAddress);

export default addressRouter;