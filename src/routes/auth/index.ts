import { FastifyPluginAsync } from 'fastify';
import { createToken, createTokenSchema } from './createToken';

const authRoutes: FastifyPluginAsync = async (app, _opt) => {
  app.post('/tokens', { schema: createTokenSchema }, createToken);
};

export default authRoutes;
