import { injectable } from 'inversify';

import EnvironmentVariableNotFound from '../exception/EnvironmentVariableNotFound';

@injectable()
export default class Configuration {
  public readonly environment: string;

  public readonly appName: string;

  public constructor() {
    this.appName = this.get('appName') || 'Getir Challenge';
    this.environment = this.get('environment') || 'local';
  }

  /** @throws {EnvironmentVariableNotFound} */
  public get(name: string, required = false): string {
    const value = process.env[name];

    if (!value && required) {
      throw new EnvironmentVariableNotFound(name);
    }

    return value as string;
  }
}
