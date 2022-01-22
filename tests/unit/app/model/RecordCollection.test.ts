import 'reflect-metadata';
import bunyan from 'bunyan';
import {
  It, Mock, MockBehavior, Times,
} from 'typemoq';
import { Connection as MongooseConnection } from 'mongoose';
import mongodb from 'mongodb';

import FailedToFetchDBData from '../../../../src/app/exception/FailedToFetchDBData';
import Connection from '../../../../src/app/database/Connection';
import { RecordCollection } from '../../../../src/app/model/RecordCollection';

describe('RecordCollection', () => {
  const logger = Mock.ofType<bunyan>(undefined, MockBehavior.Loose, false);
  const connection = Mock.ofType<Connection>(undefined, MockBehavior.Loose, false);
  const conn = Mock.ofType<MongooseConnection>(undefined, MockBehavior.Loose, false);
  const db = Mock.ofType<mongodb.Db>(undefined, MockBehavior.Loose, false);
  const collection = Mock.ofType<mongodb.Collection>(undefined, MockBehavior.Loose, false);
  const aggregationCursor = Mock.ofType<mongodb.AggregationCursor>(undefined, MockBehavior.Loose, false);

  const recordController = new RecordCollection(logger.object, connection.object);

  beforeEach(() => {
    logger.reset();
    connection.reset();
    conn.reset();
    db.reset();
    collection.reset();
    aggregationCursor.reset();
  });

  afterEach(() => {
    logger.verifyAll();
    connection.verifyAll();
    conn.verifyAll();
    db.verifyAll();
    collection.verifyAll();
    aggregationCursor.verifyAll();
  });

  it('will resolve when passing all the data', async () => {
    const reqBody = {
      startDate: '2016-01-26',
      endDate: '2018-02-02',
      minCount: 2700,
      maxCount: 3000,
    };

    aggregationCursor
      .setup((s) => s.toArray())
      .returns(() => It.isAny())
      .verifiable(Times.once());

    collection
      .setup((s) => s.aggregate(It.isAny()))
      .returns(() => aggregationCursor.object)
      .verifiable(Times.once());

    db
      .setup((s) => s.collection('records'))
      .returns(() => collection.object)
      .verifiable(Times.once());

    conn
      .setup((s) => s.db)
      .returns(() => db.object)
      .verifiable(Times.once());

    connection
      .setup((s) => s.getConnection())
      .returns(() => conn.object)
      .verifiable(Times.once());

    expect(recordController.filterByDateAndCount(reqBody.startDate, reqBody.endDate, reqBody.minCount, reqBody.maxCount)).resolves.not.toThrowError();
  });

  it('will throw FailedToFetchDBData when fail to get data from database', async () => {
    const reqBody = {
      startDate: '2016-01-26',
      endDate: '2018-02-02',
      minCount: 2700,
      maxCount: 3000,
    };
    const err = new FailedToFetchDBData('Fail to fetch records');
    collection
      .setup((s) => s.aggregate(It.isAny()))
      .returns(() => {
        throw err;
      })
      .verifiable(Times.once());

    db
      .setup((s) => s.collection('records'))
      .returns(() => collection.object)
      .verifiable(Times.once());

    conn
      .setup((s) => s.db)
      .returns(() => db.object)
      .verifiable(Times.once());

    connection
      .setup((s) => s.getConnection())
      .returns(() => conn.object)
      .verifiable(Times.once());

    logger
      .setup((s) => s.error(err, 'Fail to fetch records'))
      .verifiable(Times.once());

    expect(recordController.filterByDateAndCount(reqBody.startDate, reqBody.endDate, reqBody.minCount, reqBody.maxCount)).rejects.toThrow(err);
  });
});
