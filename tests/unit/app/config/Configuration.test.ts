import 'reflect-metadata';
import EnvironmentVariableNotFound from '../../../../src/app/exception/EnvironmentVariableNotFound';
import Configuration from '../../../../src/app/config/Configuration';

describe('Configuration', () => {
  const config = new Configuration();

  beforeEach(() => {
    process.env = {};
  });

  it('will set default values when instance is created and env variables do not exist', () => {
    expect(config.environment).toEqual('local');
  });

  it('will throw EnvironmentalVariableNotFound error when env variable is not set and it is required', () => {
    expect(() => {
      config.get('notExist', true);
    }).toThrow(EnvironmentVariableNotFound);
  });
});
