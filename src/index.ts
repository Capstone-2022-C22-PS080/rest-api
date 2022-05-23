import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import { fastify } from 'fastify';
import constants from './common/constants';
import db from './common/db';
import diseasesRoutes from './routes/diseases';
import swaggerConfig from './utils/swaggerConfig';

const app = fastify({ logger: true });
const port = process.env.PORT || 8080;

app.register(fastifyCors);
app.register(fastifySwagger, swaggerConfig);

/**
 * register routes
 */
app.register(diseasesRoutes, { prefix: '/diseases' });

(async () => {
  /**
   * connect to db
   */
  await db.connect().then(() => {
    /**
     * if ok then starts server
     */
    app.listen(port, (_err, addr) => {
      console.log(`server running in ${addr}`);

      if (constants.IS_PROD) {
        console.log(JSON.stringify(constants));
      }
    });
  });
})();
