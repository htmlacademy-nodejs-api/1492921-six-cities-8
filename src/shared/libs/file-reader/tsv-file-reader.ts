import { createReadStream } from 'node:fs';
import { IFileReader } from './file-reader.interface.js';
import { DELIMITER_ITEMS } from '../../../const/formats.js';
import EventEmitter from 'node:events';
import { exit } from 'node:process';

export abstract class TSVFileReader extends EventEmitter implements IFileReader {
  private CHUNK_SIZE = 16384; // 16KB
  private importedRowCount: number;

  constructor(
    private readonly filename: string
  ) {
    super();
    this.importedRowCount = 0;
  }

  abstract parseLineToObject(line: string): boolean;

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
        remainingData = remainingData.slice(++nextLinePosition);
        if (completeRow) {
          if (this.parseLineToObject(completeRow)) {
            this.importedRowCount++;
          } else {
            exit(1);
          }
        }
      }
      if (remainingData.trim()) {
        if (this.parseLineToObject(remainingData)) {
          this.importedRowCount++;
        } else {
          exit(1);
        }
      }
    }
    this.endFileRead();
  }
}
