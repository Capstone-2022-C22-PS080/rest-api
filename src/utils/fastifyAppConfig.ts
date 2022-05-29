import { FastifyServerOptions } from 'fastify';

const fastifyAppConfig: FastifyServerOptions = {
  logger: {
    prettyPrint: true,
  },
};

export default fastifyAppConfig;
