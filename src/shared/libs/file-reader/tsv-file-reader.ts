import { readFileSync } from 'node:fs';
import { IFileReader } from './file-reader.interface.js';
import { Guid } from 'guid-typescript';
import { cityNames, Cities } from '../../../const/data.js';
import { TCityName, TOffer, TOfferType } from '../../../types/index.js';
import { TUser } from '../../../types/user.type.js';
import { validateEmail } from '../../../utils/inet.js';

export class TSVFileReader implements IFileReader {
  private rawData = '';
  private delimiterItem = ';';

  constructor(
    private readonly filename: string,
    private readonly users?: TUser[]
  ) { }

  private validateRawData(): void {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseItemToArray<T>(item: string): T[] {
    return item.split(this.delimiterItem) as T[];
  }

  private parseRawDataToUsers(): TUser[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToUser(line));
  }

  private parseLineToUser(line: string): TUser {
    const emptyAvatar = 'http://localhost:5173/img/avatar.svg';
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
      avatarUrl: avatarUrl ?? emptyAvatar
    };
  }

  private parseRawDataToOffers(): TOffer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): TOffer {
    if (!this.users) {
      throw new Error('Users not found');
    }
    const [
      title,
      description,
      cityName,
      date,
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

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArrayOffers(): TOffer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }

  public toArrayUsers(): TUser[] {
    this.validateRawData();
    return this.parseRawDataToUsers();
  }
}
