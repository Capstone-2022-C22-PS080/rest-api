import { SwaggerOptions } from '@fastify/swagger';

const swaggerConfig: SwaggerOptions = {
  routePrefix: '/docs',
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
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  openapi: {
    info: {
      title: 'REST API SSkin',
      description: 'REST API untuk aplikasi SSkin',
      version: '0.0.1',
    },
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
