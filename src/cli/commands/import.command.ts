import { exit } from 'node:process';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { TOffer, TUser } from '../../shared/types/index.js';
import { ICommand } from './command.interface.js';
import chalk from 'chalk';
import { getErrorMessage } from '../../shared/helpers/common.js';

export class ImportCommand implements ICommand {
  private users: TUser[] = [];

  private onImportedUser(user: TUser): void {
    this.users.push(user);
    console.info(user);
  }

  private onImportedOffer(offer: TOffer): void {
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [usersFileName, offersFileName] = parameters;

    const userFile = new TSVFileReader(usersFileName.trim());
    userFile.on('line', this.onImportedUser);
    userFile.on('end', this.onCompleteImport);

    try {
      userFile.read();
    } catch (error) {
      console.error(`Can't import Users from file: ${chalk.white(usersFileName)}`);
      console.error(`Details: ${chalk.yellow(getErrorMessage(error))}`);
    }
    if (!offersFileName) {
      console.info(`Данные о предложениях аренды ${chalk.red.bold('НЕ загружены')}, т.к. был указан только 1 файл с пользователями`);
      exit();
    }
    const offersFile = new TSVFileReader(offersFileName.trim(), this.users);
    offersFile.on('lineOffer', this.onImportedOffer);
    offersFile.on('end', this.onCompleteImport);
    try {
      offersFile.read();
    } catch (error) {
      console.error(`Can't import Offers from file: ${chalk.white(offersFileName)}`);
      console.error(`Details: ${chalk.yellow(getErrorMessage(error))}`);
    }
  }
}
