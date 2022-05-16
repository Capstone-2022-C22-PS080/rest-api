import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import { fastify } from 'fastify';
import diseasesRoutes from './routes/diseases';
import swaggerConfig from './utils/swaggerConfig';

const app = fastify({ logger: true });
const port = process.env.PORT || 8080;

app.register(fastifyCors);
app.register(fastifySwagger, swaggerConfig);

app.register(diseasesRoutes, { prefix: '/diseases' });

app.listen(port, (_err, addr) => {
  console.log(`running in ${addr}`);
});
