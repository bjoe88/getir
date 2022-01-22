import bunyan from 'bunyan';
import { injectable, inject } from 'inversify';
import { Mongoose } from 'mongoose';
import Configuration from '../config/Configuration';
import TYPES from '../config/TYPES';

@injectable()
export default class Connection {
  private readonly logger: bunyan;

  private readonly config: Configuration;

  private readonly mongoose: Mongoose;

  private readonly reconnectionDelay: number = 5000;

  constructor(
@inject(TYPES.Logger) logger: bunyan, @inject(TYPES.Configuration)
  config: Configuration,
        @inject(TYPES.Mongoose) mongoose: Mongoose,
  ) {
    this.logger = logger;
    this.config = config;
    this.mongoose = mongoose;
    this.connect();
  }

  connect() {
    this.mongoose.connect(this.config.get('DB_URL'))
      .then(() => {
        this.logger.info(`Connected to ${this.config.get('DB_URL')}`);
      })
      .catch((err) => {
        this.logger.error(err);
        this.logger.info(`Reconnect to ${this.config.get('DB_URL')} in ${this.reconnectionDelay}ms`);
        setTimeout(this.connect, this.reconnectionDelay);
      });
  }

  getConnection() {
    return this.mongoose.connection;
  }
}
