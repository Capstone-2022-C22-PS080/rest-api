import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import { fastify } from 'fastify';
import diseasesRoutes from './diseases';

const app = fastify({ logger: true });
const port = process.env.PORT || 8080;

app.register(fastifyCors);
app.register(fastifySwagger, {
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
});

app.register(diseasesRoutes, { prefix: '/diseases' });

app.listen(port, (_err, addr) => {
  console.log(`running in ${addr}`);
});
