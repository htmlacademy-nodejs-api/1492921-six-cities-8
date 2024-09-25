import dayjs from 'dayjs';
//import pw from 'generate-pw';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';
import { TCityName, TMockServerData } from '../../types/index.js';
import { IOfferGenerator } from './offer-generator.interface.js';
import { Cities, cityNames, OFFER_GOODS, OFFER_TYPES } from '../../../const/data.js';
import { delimiterItems } from '../../../const/formats.js';

const priceSetting = {min: 120, max: 1550};
const weekDays = {first: 1, last: 7};
const ratingSetting = {min: 1, max: 5, precision: 1};
const bedroomsSettings = {min: 1, max: 8};
const adultsSettings = {min: 1, max: 10};
const locationSettings = {maxOffset: 1, precision: 6};

export class TSVOfferGenerator implements IOfferGenerator {
  constructor(private readonly mockData: TMockServerData) { }
  generate(): string {
    throw new Error('Method not implemented.');
  }

  public generateUsers(): string {
    const usersCount = this.mockData.emails.length;
    const emails = getRandomItems(this.mockData.emails, usersCount);
    const users = getRandomItems(this.mockData.users, usersCount);
    const avatars = getRandomItems(this.mockData.avatars, usersCount);
    return users.map((user, index) => [
      user,
      emails[index],
      '12345678', //pw.generatePassword({ length: 8, numbers: true }),
      getRandomItem(['false', 'true']),
      avatars[index]
    ].join('\t')).join('\n');
  }

  public generateOffer(): string {
    const city = Cities[getRandomItem(cityNames) as TCityName];
    const latitude = (
      city.location.latitude + generateRandomValue(0, locationSettings.maxOffset, locationSettings.precision)
    ).toFixed(locationSettings.precision);
    const longitude = (
      city.location.longitude + generateRandomValue(0, locationSettings.maxOffset, locationSettings.precision)
    ).toFixed(locationSettings.precision);
    const isFavorite = 'false';
    const isPremium = getRandomItem(['false', 'true']);
    const createdDate = dayjs()
      .subtract(generateRandomValue(weekDays.first, weekDays.last), 'day')
      .toISOString();

    return [
      getRandomItem(this.mockData.titles),
      getRandomItem(this.mockData.descriptions),
      createdDate,
      city.name,
      getRandomItem(this.mockData.offerImages),
      getRandomItems(this.mockData.offerImages, 6),
      isPremium,
      isFavorite,
      generateRandomValue(ratingSetting.min, ratingSetting.max, ratingSetting.precision).toString(),
      getRandomItem(OFFER_TYPES),
      generateRandomValue(bedroomsSettings.min, bedroomsSettings.max).toString(),
      generateRandomValue(adultsSettings.min, adultsSettings.max).toString(),
      generateRandomValue(priceSetting.min, priceSetting.max).toString(),
      getRandomItems(OFFER_GOODS).join(delimiterItems),
      getRandomItem(this.mockData.emails),
      [latitude, longitude].join(delimiterItems)
    ].join('\t');
  }
}
