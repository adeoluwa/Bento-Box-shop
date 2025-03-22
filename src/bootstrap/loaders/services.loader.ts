import { asFunction } from 'awilix';
import glob from 'glob';
import path from 'path';

import { formatRegistrationName } from '../../core/utils/container';
import { Loader } from '../../shared/types/container';

export default <Loader<void>>function ({ container }) {
  const servicesPath = path.join(__dirname, '../../modules/**/*.service.{ts,js}');
  const foundServices = glob.sync(servicesPath, { cwd: __dirname });

  foundServices.forEach((fn) => {
    const loaded = require(fn).default;

    if (loaded) {
      const name = formatRegistrationName(fn);
      const service = asFunction((cradle) => new loaded(cradle));

      container.register({
        [name]: loaded.__LIFETIME__ === 'SCOPED' ? service.scoped() : service.singleton(),
      });
    }
  });
};
