export interface IConfig<U> {
  get<T extends keyof U>(key: T): U[T];
}
