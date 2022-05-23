import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import { fastify } from 'fastify';
import constants from './common/constants';
import diseasesRoutes from './routes/diseases';
import swaggerConfig from './utils/swaggerConfig';

const app = fastify({ logger: true });

/**
 * register plugins
 */
app.register(fastifyCors);
app.register(fastifySwagger, swaggerConfig);

/**
 * register routes
 */
app.register(diseasesRoutes, { prefix: '/diseases' });

/**
 * On server ready, it should start to listen
 */
app.addHook('onReady', () => {
  app.listen(constants.PORT, (_err, addr) => {
    console.log(`Server running in ${addr}`);
  });
});

export default app;
