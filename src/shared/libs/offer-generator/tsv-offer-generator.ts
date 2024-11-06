import dayjs from 'dayjs';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';
import { TCityName, TMockServerData } from '../../types/index.js';
import { IOfferGenerator } from './offer-generator.interface.js';
import {
  Cities,
  cityNames,
  OFFER_GOODS,
  OFFER_TYPES,
  BedroomsLimit,
  MaxAdultsLimit,
  PriceLimit,
  RatingLimit,
} from '../../../const/index.js';
import { DELIMITER_ITEMS } from '../../../const/index.js';
import { CityOffsetLimit, WeekDaysLimit } from '../../../const/limits.js';

export class TSVOfferGenerator implements IOfferGenerator {
  constructor(private readonly mockData: TMockServerData) {}
  generate(): string {
    throw new Error('Method not implemented.');
  }

  public generateUsers(): string {
    const usersCount = this.mockData.emails.length;
    const emails = getRandomItems(this.mockData.emails, usersCount);
    const users = getRandomItems(this.mockData.users, usersCount);
    const avatars = getRandomItems(this.mockData.avatars, usersCount);
    return users
      .map((user, index) =>
        [
          user,
          emails[index],
          getRandomItem(['false', 'true']),
          avatars[index],
        ].join('\t')
      )
      .join('\n');
  }

  public generateOffer(): string {
    const city = Cities[getRandomItem(cityNames) as TCityName];
    const latitude = (
      city.location.latitude +
      generateRandomValue(
        CityOffsetLimit.min,
        CityOffsetLimit.max,
        CityOffsetLimit.precision
      )
    ).toFixed(CityOffsetLimit.precision);
    const longitude = (
      city.location.longitude +
      generateRandomValue(
        CityOffsetLimit.min,
        CityOffsetLimit.max,
        CityOffsetLimit.precision
      )
    ).toFixed(CityOffsetLimit.precision);
    const isFavorite = 'false';
    const isPremium = getRandomItem(['false', 'true']);
    const createdDate = dayjs()
      .subtract(
        generateRandomValue(WeekDaysLimit.min, WeekDaysLimit.max),
        'day'
      )
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
      generateRandomValue(
        RatingLimit.min,
        RatingLimit.max,
        RatingLimit.precision
      ).toString(),
      getRandomItem(OFFER_TYPES),
      generateRandomValue(BedroomsLimit.min, BedroomsLimit.max).toString(),
      generateRandomValue(MaxAdultsLimit.min, MaxAdultsLimit.max).toString(),
      generateRandomValue(PriceLimit.min, PriceLimit.max).toString(),
      getRandomItems(OFFER_GOODS).join(DELIMITER_ITEMS),
      getRandomItem(this.mockData.emails),
      [latitude, longitude].join(DELIMITER_ITEMS),
    ].join('\t');
  }
}
