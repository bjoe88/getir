import HttpError from './HttpError';

export default class EnvironmentVariableNotFound extends HttpError {
  public readonly responseCode: number;

  public readonly httpCode: number;

  public constructor(varName: string) {
    super(`Environment variable '${varName}' not found.`);
    this.responseCode = 1;
    this.httpCode = 500;
  }
}
