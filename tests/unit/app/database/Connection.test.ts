import 'reflect-metadata';
import bunyan from 'bunyan';
import { Mock, MockBehavior, Times } from 'typemoq';
import { Mongoose, Connection as MongooseConnection } from 'mongoose';

import Configuration from '../../../../src/app/config/Configuration';
import Connection from '../../../../src/app/database/Connection';

describe('Connection', () => {
  const logger = Mock.ofType<bunyan>(undefined, MockBehavior.Loose, false);
  const config = Mock.ofType<Configuration>(undefined, MockBehavior.Loose, false);
  const mongoose = Mock.ofType<Mongoose>(undefined, MockBehavior.Loose, false);
  beforeEach(() => {
    logger.reset();
    config.reset();
    mongoose.reset();
  });

  afterEach(() => {
    logger.verifyAll();
    config.verifyAll();
    mongoose.verifyAll();
  });

  it('will connect to DB when instantiate the connection object', async () => {
    const DB_URL = 'DB_URL';
    config
      .setup((s) => s.get(DB_URL))
      .returns(() => DB_URL)
      .verifiable(Times.exactly(2));
    mongoose
      .setup((s) => s.connect(DB_URL))
      .returns(() => Promise.resolve(mongoose.object))
      .verifiable(Times.once());

    mongoose
      .setup((x: any) => x.then)
      .returns(() => undefined)
      .verifiable(Times.atLeastOnce());

    logger
      .setup((s) => s.info(`Connected to ${DB_URL}`))
      .verifiable(Times.once());

    // eslint-disable-next-line no-new
    new Connection(logger.object, config.object, mongoose.object);
  });

  it('will return mongoose connection', async () => {
    const DB_URL = 'DB_URL';
    const CONN = Mock.ofType<MongooseConnection>(undefined, MockBehavior.Loose, false);
    config
      .setup((s) => s.get(DB_URL))
      .returns(() => DB_URL)
      .verifiable(Times.exactly(2));

    mongoose
      .setup((s) => s.connect(DB_URL))
      .returns(() => Promise.resolve(mongoose.object))
      .verifiable(Times.once());

    mongoose
      .setup((s) => s.connection)
      .returns(() => CONN.object)
      .verifiable(Times.atLeastOnce());

    mongoose
      .setup((x: any) => x.then)
      .returns(() => undefined)
      .verifiable(Times.atLeastOnce());

    logger
      .setup((s) => s.info(`Connected to ${DB_URL}`))
      .verifiable(Times.once());

    const conn = new Connection(logger.object, config.object, mongoose.object);
    expect(conn.getConnection()).toBe(CONN.object);
  });
  it('will retry to reconnect to DB when failed initially', async () => {
    const DB_URL = 'DB_URL';
    const err = new Error('failed to connect');

    config
      .setup((s) => s.get(DB_URL))
      .returns(() => DB_URL)
      .verifiable(Times.exactly(2));

    mongoose
      .setup((s) => s.connect(DB_URL))
      .returns(() => Promise.reject(err))
      .verifiable(Times.once());

    logger
      .setup((s) => s.info(`Reconnect to ${DB_URL} in 5000ms`))
      .verifiable(Times.once());

    logger
      .setup((s) => s.error(err))
      .returns(() => undefined)
      .verifiable(Times.once());

    // eslint-disable-next-line no-new
    new Connection(logger.object, config.object, mongoose.object);
  });
});
