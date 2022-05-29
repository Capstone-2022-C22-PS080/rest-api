import { FastifyPluginAsync } from 'fastify';
import { getPrediction, getPredictionSchema } from './getPrediction';

const diseasesRoutes: FastifyPluginAsync = async (app, _) => {
  app.get('', { schema: getPredictionSchema }, getPrediction);
};

export default diseasesRoutes;
