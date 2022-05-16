import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';

const diseasesRoutes: FastifyPluginAsync = async (app, _) => {
  app.post(
    '',
    {
      schema: {
        consumes: ['image/png'],

        body: Type.String({
          file: Type.String({ format: 'binary' }),
        }),
      },
    },
    (req, res) => {}
  );
};

export default diseasesRoutes;
