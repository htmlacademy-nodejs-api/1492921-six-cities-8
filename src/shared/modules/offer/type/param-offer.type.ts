import { ParamsDictionary } from 'express-serve-static-core';

type TParamOfferId = { offerId: string } | ParamsDictionary;
type TParamCityName = { cityName: string } | ParamsDictionary;

export { TParamOfferId, TParamCityName };
