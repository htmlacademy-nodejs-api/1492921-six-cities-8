import { cityNames, Cities, OfferFieldsInLine } from '../../../const/index.js';
import { TCityName, TOfferType } from '../../types/index.js';
import { TUser } from '../../types/user.type.js';
import { TSVFileReader } from './tsv-file-reader.js';

export class TSVOffersFileReader extends TSVFileReader {
  parseLineToObject<T>(line: string): T {
    const items = line.split('\t');
    if (items.length !== OfferFieldsInLine.count) {
      throw new Error(
        `Файл с предложениями аренды не корректный (в одной строке должно быть ${OfferFieldsInLine.count} значений, разделенных табуляцией).`
      );
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
      point,
    ] = items;

    const host: TUser = {
      name: '',
      email: hostEmail,
      password: '',
      isPro: false,
    };
    if (!cityNames.find((name) => name === cityName)) {
      throw new Error(
        `Файл с предложениями аренды не корректный (Город ${cityName} не найден)`
      );
    }

    const [latitude, longitude] = this.parseItemToArray(point);
    return {
      title,
      description,
      date,
      city: { ...Cities[cityName as TCityName] },
      previewImage,
      images: this.parseItemToArray(images),
      isPremium: isPremium === 'true',
      isFavorite: isFavorite === 'true',
      rating: Number(rating),
      type: typeOffer as TOfferType,
      bedrooms: Number(bedrooms),
      maxAdults: Number(maxAdults),
      price: Number(price),
      goods: this.parseItemToArray(goods),
      host: host,
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
    } as T;
  }
}
