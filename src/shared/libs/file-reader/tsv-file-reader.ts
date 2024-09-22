import { createReadStream } from 'node:fs';
import { IFileReader } from './file-reader.interface.js';
import { Guid } from 'guid-typescript';
import { cityNames, Cities, EMPTY_AVATAR } from '../../../const/data.js';
import { TCityName, TOffer, TOfferType } from '../../types/index.js';
import { TUser } from '../../types/user.type.js';
import { validateEmail } from '../../../utils/inet.js';
import { delimiterItems } from '../../../const/formats.js';
import EventEmitter from 'node:events';

export class TSVFileReader extends EventEmitter implements IFileReader {
  private CHUNK_SIZE = 16384; // 16KB

  constructor(
    private readonly filename: string,
    private readonly users?: TUser[]
  ) {
    super();
  }

  private parseItemToArray<T>(item: string): T[] {
    return item.split(delimiterItems) as T[];
  }

  private parseLineToUser(line: string): TUser {
    const items = line.split('\t');
    if (items.length !== 5 && items.length !== 4) {
      throw new Error('File with Users not correct (Items in line <> 5 or 4).');
    }
    const [
      name,
      email,
      password,
      isPro,
      avatarUrl
    ] = items;
    if (!validateEmail(email)) {
      throw new Error(`File with Users not correct (email: ${email} not valid).`);
    }
    if ('True~False~'.includes(`${isPro}~`)) {
      throw new Error('File with Users not correct (isPro is not boolean).');
    }

    return {
      name,
      email,
      password,
      isPro: isPro === 'True',
      avatarUrl: avatarUrl ?? EMPTY_AVATAR
    };
  }

  private parseLineToOffer(line: string): TOffer {
    if (!this.users) {
      throw new Error('Users not found');
    }
    const [
      title,
      description,
      date,
      cityName,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      typeOffer,
      bedrooms,
      maxAdults,
      price,
      goods,
      hostEmail,
      point
    ] = line.split('\t');

    const host = this.users.find((user) => user.email.toLowerCase() === hostEmail.toLowerCase());
    if (!host) {
      throw new Error(`User with ${hostEmail} not found`);
    }
    if (!cityNames.find((name) => name === cityName)) {
      throw new Error(`City ${cityName} not found`);
    }
    const guid = Guid.create().toString();

    const [latitude, longitude] = this.parseItemToArray(point);

    return {
      id: guid,
      title,
      description,
      date,
      city: { ...Cities[cityName as TCityName] },
      previewImage,
      images: this.parseItemToArray(images),
      isPremium: isPremium === 'True',
      isFavorite: isFavorite === 'True',
      rating: Number(rating),
      type: typeOffer as TOfferType,
      bedrooms: Number(bedrooms),
      maxAdults: Number(maxAdults),
      price: Number(price),
      goods: this.parseItemToArray(goods),
      host: host,
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude)
      }
    };
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        if (this.users) {
          const parsedOffer = this.parseLineToOffer(completeRow);
          this.emit('lineOffer', parsedOffer);
        }
        if (!this.users) {
          const parsedUser = this.parseLineToUser(completeRow);
          this.emit('lineUser', parsedUser);
        }
      }
    }
    this.emit('end', importedRowCount);
  }
}
