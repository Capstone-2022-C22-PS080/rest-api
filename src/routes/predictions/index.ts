import { FastifyPluginAsync } from 'fastify';
import { onRequestAuthorize } from '../routeUtils';
import {
  getPrediction,
  GetPredictionSchema,
  getPredictionSchema,
} from './getPrediction';

const diseasesRoutes: FastifyPluginAsync = async (app, _) => {
  app.post<GetPredictionSchema>(
    '',
    {
      onRequest: [onRequestAuthorize],
      schema: getPredictionSchema,
    },
    getPrediction
  );
};

export default diseasesRoutes;
