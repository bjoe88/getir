import 'reflect-metadata';
import bunyan from 'bunyan';
import { InversifyExpressServer } from 'inversify-express-utils';
import { injectable } from 'inversify';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import * as express from 'express';

import Bootstrap from './config/Bootstrap';
import TYPES from './config/TYPES';

// Load controller
import './controller/ApiV1Record';

@injectable()
export default class Server {
  public readonly bootstrap: Bootstrap;

  server: InversifyExpressServer;

  app: express.Application;

  constructor() {
    this.bootstrap = new Bootstrap();
    this.server = new InversifyExpressServer(this.bootstrap.getContainer());
    this.registerMiddleware();
    this.app = this.server.build();
  }

  registerMiddleware() {
    this.server.setConfig((app) => {
      app.use(bodyParser.urlencoded({
        extended: true,
      }));
      app.use(bodyParser.json());
      app.use(helmet());
    });
  }

  start() {
    this.app.listen(3000);
    this.bootstrap.getContainer().get<bunyan>(TYPES.Logger).info('Server started on port 3000 :)');
  }
}
