import { FastifyPluginAsync } from 'fastify';
import { getPrediction, getPredictionSchema } from './getPrediction';

const diseasesRoutes: FastifyPluginAsync = async (app, _) => {
  app.post('', { schema: getPredictionSchema }, getPrediction);
};

export default diseasesRoutes;
