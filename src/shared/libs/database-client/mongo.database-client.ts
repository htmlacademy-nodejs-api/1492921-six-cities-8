import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';

import { IDatabaseClient } from './database-client.interface.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../logger/index.js';
import { setTimeout } from 'node:timers/promises';

const RETRY_COUNT = 5;
const RETRY_TIMEOUT = 500;

@injectable()
export class MongoDatabaseClient implements IDatabaseClient {
  private mongoose: typeof Mongoose;
  private isConnected: boolean;

  constructor(
    @inject(Component.Logger) private readonly logger: ILogger
  ) {
    this.isConnected = false;
  }

  public isConnectedToDatabase() {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDatabase()) {
      throw new Error('Клиент уже установил соединение с базой MongoDB.');
    }

    this.logger.info('Подключение к базе MongoDB…');

    let attempt = 0;
    while (attempt < RETRY_COUNT) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.isConnected = true;
        this.logger.info('Подключение к базе MongoDB установлено.');
        return;
      } catch (error) {
        attempt++;
        this.logger.error(`Подключение к базе MongoDB не установлено. Попытка ${attempt}.`, error as Error);
        await setTimeout(RETRY_TIMEOUT);
      }
    }
    throw new Error(`Не удалось установить подключение к базе данных после ${RETRY_COUNT} попыток.`);
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase()) {
      throw new Error('С базой MongoDB нет соединения');
    }

    await this.mongoose.disconnect?.();
    this.isConnected = false;
    this.logger.info('Соединение с базой MongoDB закрыто.');
  }
}
