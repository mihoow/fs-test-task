import { Router } from 'express';
import productsRouter from './products.router';

const mainRouter = Router();

mainRouter.use('/products', productsRouter);

export default mainRouter;
