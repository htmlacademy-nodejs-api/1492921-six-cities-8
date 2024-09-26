
import { config } from 'dotenv';
import { IConfig } from './config.interface.js';
import { ILogger } from '../logger/index.js';
import { configRestSchema, TRestSchema } from './rest.schema.js';

export class RestConfig implements IConfig<TRestSchema> {
  private readonly config: TRestSchema;

  constructor(
   private readonly logger: ILogger
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Невозможно прочитать .env файл. Возможно файл не существует.');
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configRestSchema.getProperties();
    this.logger.info('.env файл найден и успешно распарсен!');
  }

  public get<T extends keyof TRestSchema>(key: T): TRestSchema[T] {
    return this.config[key];
  }
}
