import got from 'got';
import { TMockServerData } from '../../shared/types/index.js';
import { ICommand } from './command.interface.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { appendFile, truncate } from 'fs/promises';
import { existsSync } from 'fs';


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

    await appendFile(
      usersFileName,
      tsvOfferGenerator.generateUsers(),
      { encoding: 'utf8' }
    );

    if (existsSync(offersFileName)) {
      await truncate(offersFileName);
    }

    for (let i = 0; i < offerCount; i++) {
      await appendFile(
        offersFileName,
        `${tsvOfferGenerator.generateOffer()}\n`,
        { encoding: 'utf8' }
      );
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
      console.info(`File ${usersFileName} was created!`);
      console.info(`File ${offersFileName} was created!`);
    } catch (error: unknown) {
      console.error('Can\'t generate data');

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
