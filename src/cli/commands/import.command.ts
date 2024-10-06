import {
  TSVOffersFileReader,
  TSVUsersFileReader,
} from '../../shared/libs/file-reader/index.js';
import {
  TImportFile,
  TImportObjects,
  TOffer,
  TUser,
} from '../../shared/types/index.js';
import { ICommand } from './command.interface.js';
import chalk from 'chalk';
import { getErrorMessage } from '../../shared/helpers/common.js';
import { existsSync } from 'node:fs';
import {
  DefaultUserService,
  IUserService,
  UserModel,
} from '../../shared/modules/user/index.js';
import {
  DefaultOfferService,
  IOfferService,
  OfferModel,
} from '../../shared/modules/offer/index.js';
import { ILogger } from '../../shared/libs/logger/index.js';
import {
  IDatabaseClient,
  MongoDatabaseClient,
} from '../../shared/libs/database-client/index.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';
import { getMongoURI } from '../../shared/helpers/index.js';
export class ImportCommand implements ICommand {
  private onImportedUser = async (
    user: TImportObjects,
    resolve: () => void
  ) => {
    await this.saveUser(user as TUser);
    return resolve();
  };

  private onImportedOffer = async (
    offer: TImportObjects,
    resolve: () => void
  ) => {
    await this.saveOffer(offer as TOffer);
    resolve();
  };

  private files = {
    users: {
      fileName: '',
      content: 'пользователями',
      paramNumber: 1,
      onImportedLine: this.onImportedUser,
      getFileReader: (fileName: string) =>
        new TSVUsersFileReader(fileName.trim()),
    },
    offers: {
      fileName: '',
      content: 'предложениями аренды',
      paramNumber: 2,
      onImportedLine: this.onImportedOffer,
      getFileReader: (fileName: string) =>
        new TSVOffersFileReader(fileName.trim()),
    },
  } satisfies Record<string, TImportFile>;

  private userService: IUserService;
  private offerService: IOfferService;
  private databaseClient: IDatabaseClient;
  private logger: ILogger;
  private salt: string;
  private uri: string;

  constructor() {
    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  private async saveUser(user: TUser) {
    await this.userService.findOrCreate(
      {
        ...user,
        password: DEFAULT_USER_PASSWORD,
      },
      this.salt
    );
  }

  private async saveOffer(offer: TOffer) {
    const host = await this.userService.findByEmail(offer.host.email);
    if (host) {
      await this.offerService.create({
        ...offer,
        hostId: host.id,
      });
    } else {
      throw new Error(
        `Файл с предложениями аренды не корректный (Пользователь с email: ${offer.host.email} не найден).`
      );
    }
  }

  private onCompleteImport = (count: number) => {
    console.info(`${count} строк импортировано.`);
  };

  private checkFile(file: TImportFile): boolean {
    if (!file.fileName) {
      console.error(
        `Файл с ${file.content} ${chalk.red.bold('НЕ передан')} ${file.paramNumber}-м параметром`
      );
      return false;
    }
    if (!existsSync(file.fileName)) {
      console.error(
        `Файл с ${file.content} (${file.fileName}) ${chalk.red.bold('НЕ найден')}`
      );
      return false;
    }
    return true;
  }

  public getName(): string {
    return '--import';
  }

  public async importFile(file: TImportFile): Promise<boolean> {
    if (!this.checkFile(file)) {
      return false;
    }
    const fileReader = file.getFileReader(file.fileName);
    fileReader.on('line', file.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
      return true;
    } catch (error) {
      console.error(
        `Не удалось импортировать данные из файла: ${chalk.white(file.fileName)}`
      );
      console.error(`Причина: ${chalk.yellow(getErrorMessage(error))}`);
      return false;
    }
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [usersFileName, offersFileName, login, password, host, dbname, salt] =
      parameters;

    this.uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;
    this.files.users.fileName = usersFileName;
    this.files.offers.fileName = offersFileName;

    await this.databaseClient.connect(this.uri);
    try {
      this.logger.info('Начинаем загрузку пользователей');
      if (await this.importFile(this.files.users)) {
        this.logger.info('Начинаем загрузку предложений по аренде');
        await this.importFile(this.files.offers);
      }
      this.databaseClient.disconnect();
    } catch {
      this.databaseClient.disconnect();
    }
  }
}
