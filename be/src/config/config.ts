import type { Environment, IConfig } from '../interfaces/config';

const mongoURI = process.env['MONGO_URI'];
if (!mongoURI) {
  throw new Error('MONGO_URI is required');
}

export const config: IConfig = {
  port: Number(process.env['PORT']) || 3000,
  env: (process.env['NODE_ENV'] as Environment) || 'dev',
  mongoURI,
};
