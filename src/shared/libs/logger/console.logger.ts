import { ILogger } from './logger.interface.js';
import { getErrorMessage } from '../../helpers/index.js';

export class ConsoleLogger implements ILogger {
  public debug(message: string, ...args: unknown[]): void {
    console.debug(message, ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    console.error(message, ...args);
    console.error(`Ошибка: ${getErrorMessage(error)}`);
  }

  public info(message: string, ...args: unknown[]): void {
    console.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    console.warn(message, ...args);
  }
}
