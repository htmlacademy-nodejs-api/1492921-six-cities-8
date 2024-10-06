import { createReadStream } from 'node:fs';
import { IFileReader } from './file-reader.interface.js';
import { DELIMITER_ITEMS } from '../../../const/index.js';
import EventEmitter from 'node:events';
import { TImportObjects } from '../../types/import.type.js';

export abstract class TSVFileReader extends EventEmitter implements IFileReader {
  private CHUNK_SIZE = 16384; // 16KB
  private importedRowCount: number;

  constructor(private readonly filename: string) {
    super();
    this.importedRowCount = 0;
  }

  abstract parseLineToObject<T>(line: string): T;

  private async parseLine(line: string) {
    const obj: TImportObjects = this.parseLineToObject(line);
    await new Promise((resolve) => {
      this.emit('line', obj, resolve);
    });
    this.importedRowCount++;
  }

  protected parseItemToArray<T>(item: string): T[] {
    return item.split(DELIMITER_ITEMS) as T[];
  }

  protected endFileRead() {
    this.emit('end', this.importedRowCount);
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    this.importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition).trim();
        remainingData = remainingData.slice(++nextLinePosition).trim();
        if (completeRow) {
          await this.parseLine(completeRow);
        }
      }
      if (remainingData) {
        await this.parseLine(remainingData);
      }
    }
    this.endFileRead();
  }
}
