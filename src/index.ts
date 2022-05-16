import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifySwagger from '@fastify/swagger';
import { fastify } from 'fastify';
import diseasesRoutes from './routes/diseases';
import uploadSkinPhotoRoutes from './routes/uploadSkinPhoto';
import swaggerConfig from './utils/swaggerConfig';

const app = fastify({ logger: true });
const port = process.env.PORT || 8080;

app.register(fastifyCors);
app.register(fastifySwagger, swaggerConfig);
app.register(fastifyMultipart, { attachFieldsToBody: true });
// app.register(fastifyFileUpload);

app.register(diseasesRoutes, { prefix: '/diseases' });
app.register(uploadSkinPhotoRoutes, { prefix: '/uploadSkinPhoto' });

app.listen(port, (_err, addr) => {
  console.log(`running in ${addr}`);
});
