import HttpError from './HttpError';

export default class FailedToFetchDBData extends HttpError {
  public readonly responseCode: number;

  public readonly httpCode: number;

  public constructor(message: string) {
    super(message);
    this.responseCode = 1;
    this.httpCode = 500;
  }
}
