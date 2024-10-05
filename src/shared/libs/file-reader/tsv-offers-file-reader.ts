import { cityNames, Cities } from '../../../const/index.js';
import { TCityName, TOfferType } from '../../types/index.js';
import { TUser } from '../../types/user.type.js';
import { TSVFileReader } from './tsv-file-reader.js';

export class TSVOffersFileReader extends TSVFileReader {

  async parseLineToObject(line: string): Promise<boolean> {

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

    const host: TUser = {name: '', email: hostEmail, password: '', isPro: false};
    if (!cityNames.find((name) => name === cityName)) {
      console.error(`Город ${cityName} не найден`);
      return false;
    }

    const [latitude, longitude] = this.parseItemToArray(point);
    const parsedOffer = {
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
    await new Promise((resolve) => {
      this.emit('line', parsedOffer, resolve);
    });
    return true;
  }

}
