import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);
export interface RecordsRequest {
    startDate: string
    endDate: string
    minCount: number
    maxCount: number
}
export const RecordsRequestSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  properties: {
    startDate: {
      type: 'string',
      format: 'date',
    },
    endDate: {
      type: 'string',
      format: 'date',
    },
    minCount: {
      type: 'number',
    },
    maxCount: {
      type: 'number',
    },
  },
  required: [
    'startDate',
    'endDate',
    'minCount',
    'maxCount',
  ],
  type: 'object',
};
export const isRecordsRequest = ajv.compile(RecordsRequestSchema) as ValidateFunction<RecordsRequest>;
