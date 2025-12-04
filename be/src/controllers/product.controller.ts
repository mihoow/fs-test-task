import { QueryFilter } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { Product } from '../models';
import { PRODUCTS_PAGE_SIZE } from '../config';
import { parseQueryToOptions } from './product.filters';
import type { IProduct } from '../interfaces/product';
import type { Paginated } from '../interfaces/pagination';

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
      .limit(PRODUCTS_PAGE_SIZE + 1)
      .sort({ [sort]: 1 })
      .exec();

    const hasMore = products.length > PRODUCTS_PAGE_SIZE;
    const productsPage = products.slice(0, PRODUCTS_PAGE_SIZE);

    const data: Paginated<IProduct> = {
      items: productsPage,
      pagination: {
        page,
        pageSize: PRODUCTS_PAGE_SIZE,
        hasMore,
      },
    };

    res.json(data);
  } catch (error) {
    next(error);
  }
}
