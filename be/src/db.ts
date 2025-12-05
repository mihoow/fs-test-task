import mongoose from 'mongoose';
import { config } from './config';
import { Product } from './models';
import { mockData } from '@app/shared/products';

export async function connectDB() {
  try {
    await mongoose.connect(config.mongoURI);

    if (config.env === 'dev') {
      const count = await Product.countDocuments();

      if (count === 0) {
        // Seeding mock products...
        await Product.insertMany(mockData);
      }
    }
  } catch (error) {
    console.error('MongoDB connection error: ', error);
    process.exit(1);
  }
}
