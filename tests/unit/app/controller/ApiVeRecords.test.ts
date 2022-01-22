import 'reflect-metadata';
import {
  It, Mock, MockBehavior, Times,
} from 'typemoq';
import { Request } from 'express';
import FailedToFetchDBData from '../../../../src/app/exception/FailedToFetchDBData';
import RecordController from '../../../../src/app/controller/ApiV1Record';
import { RecordCollection } from '../../../../src/app/model/RecordCollection';

describe('ApiVeRecords', () => {
  const recordCollection = Mock.ofType<RecordCollection>(undefined, MockBehavior.Loose, false);
  const recordController = new RecordController(recordCollection.object);
  beforeEach(() => {
    recordCollection.reset();
  });

  afterEach(() => {
    recordCollection.verifyAll();
  });

  it('will return success when calling the post endpoint', async () => {
    const reqBody = {
      startDate: '2016-01-26',
      endDate: '2018-02-02',
      minCount: 2700,
      maxCount: 3000,
    };
    const reqMock = Mock.ofType<Request>(undefined, MockBehavior.Loose, false);
    reqMock
      .setup((s) => s.body)
      .returns(() => reqBody)
      .verifiable(Times.once());

    recordCollection
      .setup((s) => s.filterByDateAndCount(reqBody.startDate, reqBody.endDate, reqBody.minCount, reqBody.maxCount))
      .returns(() => Promise.resolve([]))
      .verifiable(Times.once());

    expect(recordController.post(reqMock.object)).resolves.toStrictEqual({ code: 0, msg: 'Success', records: [] });
  });

  it('will return 400 when req body in not send properly', async () => {
    const reqBody = {
    };
    const reqMock = Mock.ofType<Request>(undefined, MockBehavior.Loose, false);
    reqMock
      .setup((s) => s.body)
      .returns(() => reqBody)
      .verifiable(Times.once());

    recordCollection
      .setup((s) => s.filterByDateAndCount(It.isAny(), It.isAny(), It.isAny(), It.isAny()))
      .returns(() => Promise.resolve([]))
      .verifiable(Times.never());

    expect(recordController.post(reqMock.object)).resolves.toStrictEqual({ code: 400, msg: "must have required property 'startDate'", records: [] });
  });

  it('will return "Fail to fetch records" error when unable to fetch from database', async () => {
    const reqBody = {
      startDate: '2016-01-26',
      endDate: '2018-02-02',
      minCount: 2700,
      maxCount: 3000,
    };
    const reqMock = Mock.ofType<Request>(undefined, MockBehavior.Loose, false);
    reqMock
      .setup((s) => s.body)
      .returns(() => reqBody)
      .verifiable(Times.once());

    recordCollection
      .setup((s) => s.filterByDateAndCount(It.isAny(), It.isAny(), It.isAny(), It.isAny()))
      .returns(() => Promise.reject(new FailedToFetchDBData('Fail to fetch records')))
      .verifiable(Times.once());

    expect(recordController.post(reqMock.object)).resolves.toStrictEqual({ code: 1, msg: 'Fail to fetch records', records: [] });
  });

  it('will return "Internal Server Error" error when get unknown error', async () => {
    const reqBody = {
      startDate: '2016-01-26',
      endDate: '2018-02-02',
      minCount: 2700,
      maxCount: 3000,
    };
    const reqMock = Mock.ofType<Request>(undefined, MockBehavior.Loose, false);
    reqMock
      .setup((s) => s.body)
      .returns(() => reqBody)
      .verifiable(Times.once());

    recordCollection
      .setup((s) => s.filterByDateAndCount(It.isAny(), It.isAny(), It.isAny(), It.isAny()))
      .returns(() => Promise.reject(new Error('Unknown error')))
      .verifiable(Times.once());

    expect(recordController.post(reqMock.object)).resolves.toStrictEqual({ code: 500, msg: 'Internal Server Error', records: [] });
  });
});
