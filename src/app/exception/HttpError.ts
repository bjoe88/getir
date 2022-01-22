export default class HttpError extends Error {
  public readonly responseCode: number;

  public readonly httpCode: number;

  public constructor(message: string) {
    super(message);
    this.responseCode = 500;
    this.httpCode = 500;
  }
}
