import { Maybe } from '../types/helpers';

const maybePort: Maybe<string> = process.env.APP_PORT;

export default {
  nodeEnv: process.env.NODE_ENV || 'development',
  appPort: maybePort ? parseInt(process.env.APP_PORT, 10) : 8080,
};
