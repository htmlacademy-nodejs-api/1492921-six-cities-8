import dayjs from 'dayjs';

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

export class TSVOfferGenerator implements IOfferGenerator {
  constructor(private readonly mockData: TMockServerData) { }

  public generate(): string {
    const city = Cities[getRandomItem(cityNames) as TCityName];
    const latitude = (
      city.location.latitude + generateRandomValue(0, 1, 8)
    ).toString();
    const longitude = (
      city.location.longitude + generateRandomValue(0, 1, 8)
    ).toString();
    const isFavorite = 'false';
    const isPremium = getRandomItem(['false', 'true']);
    const createdDate = dayjs()
      .subtract(generateRandomValue(weekDays.first, weekDays.last), 'day')
      .toISOString();

    return [
      getRandomItem(this.mockData.titles),
      getRandomItem(this.mockData.descriptions),
      city.name,
      createdDate,
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
      getRandomItem(this.mockData.users),
      latitude,
      longitude,
    ].join('\t');
  }
}
