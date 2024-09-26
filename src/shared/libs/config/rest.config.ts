import { IConfig } from './config.interface.js';

export class RestConfig implements IConfig {
  constructor(
    private readonly config: NodeJS.ProcessEnv
  ) {}

  public get(key: string): string | undefined {
    return this.config[key];
  }
}
