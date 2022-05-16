import { FastifyPluginAsync } from 'fastify';

const diseasesRoutes: FastifyPluginAsync = async (app, _) => {
  app.post('', {}, (req, res) => {});
};

export default diseasesRoutes;
