import { QueryFilter } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { Product } from '../models';
import type { IProduct } from '../interfaces/product';
import { PRODUCTS_PAGE_SIZE } from '../config';
import { parseQueryToOptions } from './product.filters';

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      capacity,
      energyClass,
      feature,
      sort = 'price',
      query,
      page = 1,
    } = parseQueryToOptions(req.query);

    const doc: QueryFilter<IProduct> = {};
    if (capacity) {
      doc.capacity = capacity;
    }
    if (energyClass) {
      doc.energyClass = energyClass;
    }
    if (feature) {
      doc.features = feature;
    }
    if (query) {
      doc.$or = [{ $text: { $search: query } }, { code: { $regex: `^${query}`, $options: 'i' } }];
    }

    const products = await Product.find(doc)
      .skip((page - 1) * PRODUCTS_PAGE_SIZE)
      .limit(PRODUCTS_PAGE_SIZE)
      .sort({ [sort]: 1 })
      .exec();

    res.json(products);
  } catch (error) {
    next(error);
  }
}
