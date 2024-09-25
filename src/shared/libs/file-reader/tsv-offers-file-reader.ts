import { Guid } from 'guid-typescript';
import { cityNames, Cities } from '../../../const/data.js';
import { TCityName, TOfferType } from '../../types/index.js';
import { TUser } from '../../types/user.type.js';
import { TSVFileReader } from './tsv-file-reader.js';

export class TSVOffersFileReader extends TSVFileReader {

  constructor(
    filename: string,
    private readonly users: TUser[]
  ) {
    super(filename);
  }

  parseLineToObject(line: string): boolean {
    if (this.users.length === 0) {
      console.error('Справочник пользователей не найден!');
      return false;
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
      console.error(`Пользователь (email: ${hostEmail}) не найден`);
      return false;
    }
    if (!cityNames.find((name) => name === cityName)) {
      console.error(`Город ${cityName} не найден`);
      return false;
    }
    const guid = Guid.create().toString();

    const [latitude, longitude] = this.parseItemToArray(point);
    const offer = {
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
    this.emit('line', offer);
    return true;
  }

}
