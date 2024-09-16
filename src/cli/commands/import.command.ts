import { exit } from 'process';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { TUser } from '../../types/index.js';
import { ICommand } from './command.interface.js';

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
      console.error(`Can't import Users from file: ${usersFileName}`);
      console.error(`Details: ${err.message}`);
    }
    if (!offersFileName) {
      console.info('Данные о предложениях аренды не загружены, т.к. был указан только 1 файл с пользователями');
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
      console.error(`Can't import Offers from file: ${offersFileName}`);
      console.error(`Details: ${err.message}`);
    }
  }
}
