import got from 'got';
import { TMockServerData } from '../../shared/types/index.js';
import { ICommand } from './command.interface.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { truncate } from 'fs/promises';
import { existsSync } from 'fs';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';
import chalk from 'chalk';


export class GenerateCommand implements ICommand {
  private initialData: TMockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(usersFileName: string, offersFileName: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);

    if (existsSync(usersFileName)) {
      await truncate(usersFileName);
    }
    const tsvUsersFileWriter = new TSVFileWriter(usersFileName);
    await tsvUsersFileWriter.write(tsvOfferGenerator.generateUsers());

    const tsvOffersFileWriter = new TSVFileWriter(offersFileName);
    if (existsSync(offersFileName)) {
      await truncate(offersFileName);
    }
    for (let i = 0; i < offerCount; i++) {
      await tsvOffersFileWriter.write(tsvOfferGenerator.generateOffer());
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, usersFileName, offersFileName, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(usersFileName, offersFileName, offerCount);
      console.info(`Файл ${usersFileName} успешно создан!`);
      console.info(`Файл ${offersFileName} успешно создан!!`);
    } catch (error: unknown) {
      console.error('Не удалось сгенерировать данные');
      console.error(`Причина: ${chalk.yellow(getErrorMessage(error))}`);
    }
  }
}
