import 'reflect-metadata';
import mongoose from 'mongoose';
import bunyan from 'bunyan';

import { Container } from 'inversify';
import { RecordCollection } from '../model/RecordCollection';
import Server from '../Server';
import Configuration from './Configuration';
import TYPES from './TYPES';
import Connection from '../database/Connection';

export default class Bootstrap {
  private readonly config: Configuration;

  private container: Container;

  private logger: bunyan;

  public constructor() {
    this.config = new Configuration();
    this.logger = bunyan.createLogger({ name: this.config.appName });
    this.container = this.setupContainer(new Container());
  }

  public getConfig() {
    return this.config;
  }

  public getContainer(): Container {
    return this.container;
  }

  private setupContainer(container: Container): Container {
    container.bind<string>(TYPES.CorrelationId).toConstantValue('');
    container
      .bind<Configuration>(TYPES.Configuration)
      .toDynamicValue(() => this.config)
      .inSingletonScope();

    container
      .bind<bunyan>(TYPES.Logger)
      .toDynamicValue(() => this.logger)
      .inSingletonScope();

    container
      .bind<Connection>(TYPES.Connection)
      .to(Connection)
      .inSingletonScope();

    container
      .bind<RecordCollection>(TYPES.RecordCollection)
      .to(RecordCollection)
      .inSingletonScope();

    container
      .bind<Server>(TYPES.Server)
      .to(Server)
      .inSingletonScope();

    container.bind<mongoose.Mongoose>(TYPES.Mongoose).toConstantValue(mongoose);
    return container;
  }
}
