import got from 'got';
import { TMockServerData } from '../../shared/types/index.js';
import { ICommand } from './command.interface.js';

export class GenerateCommand implements ICommand {
  private initialData: TMockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
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
    } catch (error: unknown) {
      console.error('Can\'t generate data');

      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    console.log(usersFileName);
    console.log(offersFileName);
    console.log(offerCount);
    console.log(this.initialData);
  }
}
