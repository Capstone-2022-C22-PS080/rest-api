import { SwaggerOptions } from '@fastify/swagger';
import constants from '../common/constants';

const swaggerConfig: SwaggerOptions = {
  routePrefix: '/',
  swagger: {
    info: {
      title: 'REST API SSkin',
      description: 'REST API untuk aplikasi SSkin',
      version: '0.0.1',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    schemes: constants.IS_PROD ? ['https', 'http'] : ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      Authorization: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      },
    },
    security: [
      {
        Authorization: [],
      },
    ],
  },
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },

  staticCSP: true,
  transformStaticCSP: (header) => header,
  exposeRoute: true,
};

export default swaggerConfig;
