import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ConnectionOptions } from 'typeorm';
import { EnvConfig, Environment } from '../../types/app';
import { Nullable } from '../../types/helpers';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  private readonly env: Environment;
  private readonly database: ConnectionOptions;
  private readonly secret: string;
  private readonly port: number;

  constructor() {
    this.env = ConfigService.getEnvironment();
    this.envConfig = dotenv.parse(fs.readFileSync(`.env`));
    this.database = this.getConnectionOptions();
    this.secret = this.get('SECRET');
    this.port = this.getPort();
  }

  private static getEnvironment() {
    const nodeEnv = process.env.NODE_ENV;
    return nodeEnv !== Environment.development &&
      nodeEnv !== Environment.production
      ? Environment.development
      : nodeEnv;
  }

  private get(key: string): string {
    const value = this.envConfig[key];
    if (!value) throw new Error(`${key} is not set in .env`);
    return value;
  }

  private getIfSet(key: string): Nullable<string> {
    return this.envConfig[key] || null;
  }

  private getConnectionOptions(): ConnectionOptions {
    return {
      type: 'postgres',
      host: this.get('TYPEORM_HOST'),
      username: this.get('TYPEORM_USERNAME'),
      password: this.get('TYPEORM_PASSWORD'),
      database: this.get('TYPEORM_DATABASE'),
      port: parseInt(this.getIfSet('TYPEORM_PORT') || '5432', 10),
      logging: this.getIfSet('TYPEORM_LOGGING') === 'true',
      entities: this.get('TYPEORM_ENTITIES').split(','),
      migrationsRun: this.getIfSet('TYPEORM_MIGRATIONS_RUN') === 'true',
      synchronize: this.getIfSet('TYPEORM_SYNCHRONIZE') === 'true',
    };
  }

  private getPort(): number {
    const portString = this.getIfSet('APP_PORT');
    return portString ? parseInt(portString, 10) : 8080;
  }

  get Port(): number {
    return this.port;
  }

  get Env(): Environment {
    return this.env;
  }

  get Database(): ConnectionOptions {
    return this.database;
  }

  get Secret(): string {
    return this.secret;
  }
}
