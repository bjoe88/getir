import bunyan from 'bunyan';
import { injectable, inject } from 'inversify';

import FailedToFetchDBData from '../exception/FailedToFetchDBData';
import Connection from '../database/Connection';
import TYPES from '../config/TYPES';

export interface RecordFilter {
    key: string,
    createdAt: string,
    totalCount: number
}

@injectable()
export class RecordCollection {
  private readonly logger: bunyan;

  private filterByDateAndCountPipeline!: any;

  private readonly connection: Connection;

  constructor(
@inject(TYPES.Logger) logger: bunyan,
        @inject(TYPES.Connection) connection: Connection,
  ) {
    this.logger = logger;
    this.connection = connection;
    this.buildPipeline();
  }

  buildPipeline() {
    this.filterByDateAndCountPipeline = {
      $project: {
        _id: false,
        key: true,
        createdAt: true,
        totalCount: {
          $sum: '$counts',
        },
      },
    };
  }

  async filterByDateAndCount(startDate: string, endDate: string, minCount: number, maxCount: number) {
    const collection = this.connection.getConnection().db.collection<RecordFilter>('records');
    try {
      const matchPipeline = {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
          totalCount: {
            $gte: minCount,
            $lte: maxCount,
          },
        },
      };
      return collection
        .aggregate([this.filterByDateAndCountPipeline, matchPipeline])
        .toArray();
    } catch (error: unknown) {
      this.logger.error(error, 'Fail to fetch records');
      throw new FailedToFetchDBData('Fail to fetch records');
    }
  }
}
