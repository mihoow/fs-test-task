import { NextFunction, Request, Response } from 'express';
import { Product } from '../models';

export async function getProducts(_req: Request, res: Response, next: NextFunction) {
  try {
    const products = await Product.find({});

    res.json(products);
  } catch (error) {
    next(error);
  }
}
