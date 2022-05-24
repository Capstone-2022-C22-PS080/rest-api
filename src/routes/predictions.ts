import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import constants from '../common/constants';
import { DefaultResponse400Schema } from '../common/schema';
import { createResponseSchema } from '../common/schemaUtils';
import { ObjectSchemaToType, ResponseSchema } from '../common/types';

const predictionRoutes: FastifyPluginAsync = async (app, _) => {
  const getDetectionBodySchema = Type.Object({
    base64: Type.RegEx(
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
      { description: 'Base64 image representation' }
    ),
  });

  type GetDetectionBodySchema = ObjectSchemaToType<
    typeof getDetectionBodySchema
  >;

  const getDetectionResponseSchemas = createResponseSchema({
    200: Type.Object({
      confidence: Type.Number({ description: 'Prediction confidence' }),
      disease_name: Type.String({
        description: 'Name of the detected disease',
      }),
      disease_description: Type.String({
        description: 'Description of the disease',
      }),
      first_aid_description: Type.String({
        description: 'Description of the first aid treatment',
      }),
    }),

    400: DefaultResponse400Schema,
  });

  type GetDetectionResponseSchemas = ResponseSchema<
    typeof getDetectionResponseSchemas
  >;

  app.post<{
    Body: GetDetectionBodySchema;
    Reply: GetDetectionResponseSchemas;
  }>(
    '',
    {
      schema: {
        body: getDetectionBodySchema,
        response: getDetectionResponseSchemas,
        consumes: ['application/json'],
      },
    },
    async (req, res) => {
      if (!constants.IS_PROD) {
        console.log('Not implemented in dev environment');
        return res.code(500).send();
      }
    }
  );
};

export default predictionRoutes;
