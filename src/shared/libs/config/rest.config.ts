
import { DotenvParseOutput, config } from 'dotenv';
import { IConfig } from './config.interface.js';
import { ILogger } from '../logger/index.js';

export class RestConfig implements IConfig {
  private readonly config: NodeJS.ProcessEnv;
  constructor(
   private readonly logger: ILogger
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Невозможно прочитать .env файл. Возможно файл не существует.');
    }

    this.config = <DotenvParseOutput>parsedOutput.parsed;
    this.logger.info('.env файл найден и успешно распарсен!');
  }

  public get(key: string): string | undefined {
    return this.config[key];
  }
}
