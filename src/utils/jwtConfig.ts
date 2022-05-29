import { FastifyJWTOptions } from '@fastify/jwt';
import constants from '../common/constants';
import secretManager from '../services/secretManager';

const jwtConfig: FastifyJWTOptions = {
  secret: async function () {
    if (constants.IS_PROD) {
      return await secretManager.getSecretValue(constants.JWT_SECRET!);
    }

    return constants.JWT_SECRET;
  },
};

export default jwtConfig;
