import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import { fastify } from 'fastify';
import { onReady, onRequest } from './hooks';
import { authRoutes, diseaseRoutes, predictionRoutes } from './routes';
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
app.register(authRoutes, { prefix: '/auth' });
app.register(diseaseRoutes, { prefix: '/diseases' });
app.register(predictionRoutes, { prefix: '/predictions' });

/**
 * register hooks
 */
app.addHook('onRequest', onRequest);
app.addHook('onReady', onReady);

export default app;
