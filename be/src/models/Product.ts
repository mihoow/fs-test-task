import { Schema, model } from 'mongoose';
import type { IProduct } from '../interfaces/product';

const productSchema = new Schema<IProduct>({
  image: { type: String, required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  capacity: {
    type: Number,
    required: true,
  },
  dimensions: { type: String, required: true },
  features: [
    {
      type: String,
      required: true,
    },
  ],
  energyClass: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: true,
  },
  price: {
    value: { type: Number, required: true },
    currency: { type: String, required: true },
    installment: {
      value: { type: Number, required: true },
      period: { type: Number, required: true },
    },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
  },
});

productSchema.index({ code: 1 });
productSchema.index({ code: 'text', name: 'text' });

export const Product = model('Product', productSchema);
