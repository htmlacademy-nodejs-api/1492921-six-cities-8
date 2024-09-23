import { TSVOffersFileReader, TSVUsersFileReader } from '../../shared/libs/file-reader/index.js';
import { TOffer, TUser } from '../../shared/types/index.js';
import { ICommand } from './command.interface.js';
import chalk from 'chalk';
import { getErrorMessage } from '../../shared/helpers/common.js';
import { existsSync } from 'node:fs';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';

type TImportFile = {
  fileName: string,
  content: string,
  paramNumber: number,
  onImportedLine: (obj: TUser | TOffer) => void,
  getFileReader: (fileName: string) => TSVFileReader
}

export class ImportCommand implements ICommand {
  private users: TUser[] = [];
  private files = {
    users: {
      fileName: '',
      content: 'пользователями',
      paramNumber: 1,
      onImportedLine: (obj: TUser | TOffer): void => {
        this.users.push(obj as TUser);
      },
      getFileReader: (fileName: string) => new TSVUsersFileReader(fileName.trim())
    },
    offers: {
      fileName: '',
      content: 'предложениями аренды',
      paramNumber: 2,
      onImportedLine: (obj: TUser | TOffer): void => {
        console.info(obj);
      },
      getFileReader: (fileName: string) => new TSVOffersFileReader(fileName.trim(), this.users)
    }
  } satisfies Record<string, TImportFile>;

  private onCompleteImport = (count: number) => {
    console.info(`${count} строк импортировано.`);
  };

  private checkFile(file: TImportFile): boolean {
    if (!file.fileName){
      console.error(`Файл с ${file.content} ${chalk.red.bold('НЕ передан')} ${file.paramNumber}-м параметром`);
      return false;
    }
    if (!existsSync(file.fileName)) {
      console.error(`Файл с ${file.content} (${file.fileName}) ${chalk.red.bold('НЕ найден')}`);
      return false;
    }
    return true;
  }

  public getName(): string {
    return '--import';
  }

  public async importFile(file: TImportFile): Promise<void> {
    if (!this.checkFile(file)) {
      throw new Error(`Проблемы с файлом: ${file.fileName}`);
    }
    const fileReader = file.getFileReader(file.fileName);
    fileReader.on('line', file.onImportedLine);
    fileReader.on('end', this.onCompleteImport);
    if (file.paramNumber === 1) {
      fileReader.on('endUsers', () => {
        console.log(this.users);
        this.importFile(this.files.offers);
      });
    }

    try {
      fileReader.read();
    } catch (error) {
      console.error(`Не удалось импортировать данные из файла: ${chalk.white(file.fileName)}`);
      console.error(`Причина: ${chalk.yellow(getErrorMessage(error))}`);
    }
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [usersFileName, offersFileName] = parameters;
    this.files.users.fileName = usersFileName;
    this.files.offers.fileName = offersFileName;
    this.importFile(this.files.users);

    // const offersFile = new TSVFileReader(offersFileName.trim(), this.users);
    // offersFile.on('line', this.onImportedOffer);
    // offersFile.on('end', this.onCompleteImport);
    // try {
    //   offersFile.read();
    // } catch (error) {
    //   console.error(`Can't import Offers from file: ${chalk.white(offersFileName)}`);
    //   console.error(`Details: ${chalk.yellow(getErrorMessage(error))}`);
    // }
  }
}
