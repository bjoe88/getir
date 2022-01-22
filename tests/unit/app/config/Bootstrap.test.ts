import bunyan from 'bunyan';

import Bootstrap from '../../../../src/app/config/Bootstrap';
import TYPES from '../../../../src/app/config/TYPES';
import Configuration from '../../../../src/app/config/Configuration';

describe('Bootstrap', () => {
  it('will create the container only once', () => {
    const bootstrap = new Bootstrap();
    const container = bootstrap.getContainer();
    expect(container === bootstrap.getContainer()).toEqual(true);
  });

  it('will setup the right dependecy', () => {
    const bootstrap = new Bootstrap();
    const container = bootstrap.getContainer();
    expect(container.get<Configuration>(TYPES.Configuration)).toEqual(bootstrap.getConfig());
    expect(container.get<Configuration>(TYPES.Logger)).toBeInstanceOf(bunyan);
  });
});
