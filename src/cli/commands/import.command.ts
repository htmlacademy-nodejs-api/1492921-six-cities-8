import { exit } from 'node:process';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { TUser } from '../../types/index.js';
import { ICommand } from './command.interface.js';
import chalk from 'chalk';

export class ImportCommand implements ICommand {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [usersFileName, offersFileName] = parameters;
    let users: TUser[] = [];
    const userFile = new TSVFileReader(usersFileName.trim());
    try {
      userFile.read();
      users = userFile.toArrayUsers();
      console.log(users);
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }
      console.error(`Can't import Users from file: ${chalk.white(usersFileName)}`);
      console.error(`Details: ${chalk.yellow(err.message)}`);
    }
    if (!offersFileName) {
      console.info(`Данные о предложениях аренды ${chalk.red.bold('НЕ загружены')}, т.к. был указан только 1 файл с пользователями`);
      exit();
    }
    const offersFile = new TSVFileReader(offersFileName.trim(), users);
    offersFile.read();
    try {
      offersFile.read();
      const offers = offersFile.toArrayOffers();
      console.log(JSON.stringify(offers, null, 2));
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }
      console.error(`Can't import Offers from file: ${chalk.white(offersFileName)}`);
      console.error(`Details: ${chalk.yellow(err.message)}`);
    }
  }
}
