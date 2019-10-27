import { Maybe, Nullable } from './helpers';

export enum Environment {
  development = 'development',
  production = 'production',
}

export interface EnvConfig {
  [key: string]: Maybe<Nullable<string>>;
}
