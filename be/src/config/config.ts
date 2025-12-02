import type { IConfig } from '../interfaces/config';

export const config: IConfig = {
  port: Number(process.env['PORT']) || 3000,
  env: process.env['NODE_ENV'] || 'development',
};
