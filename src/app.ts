import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import { fastify } from 'fastify';
import onReady from './hooks/onReady';
import onRequest from './hooks/onRequest';
import diseasesRoutes from './routes/diseases';
import predictionRoutes from './routes/predictions';
import jwtConfig from './utils/jwtConfig';
import swaggerConfig from './utils/swaggerConfig';

const app = fastify({
  logger: {
    prettyPrint: true,
  },
});

/**
 * register plugins
 */
app.register(fastifyCors);
app.register(fastifySwagger, swaggerConfig);
app.register(fastifyJwt, jwtConfig);

/**
 * register routes
 */
app.register(diseasesRoutes, { prefix: '/diseases' });
app.register(predictionRoutes, { prefix: '/predictions' });

/**
 * register hooks
 */
app.addHook('onRequest', onRequest);
app.addHook('onReady', onReady);

export default app;
