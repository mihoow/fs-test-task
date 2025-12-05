export type Environment = 'dev' | 'prod';

export interface IConfig {
  port: number;
  env: Environment;
  mongoURI: string;
}
