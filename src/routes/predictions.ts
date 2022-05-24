import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import { auth } from 'google-auth-library';
import got from 'got';
import constants from '../common/constants';
import { DefaultResponse400Schema } from '../common/schema';
import { createResponseSchema } from '../common/schemaUtils';
import secretManager from '../common/secretManager';
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

      let token: string | undefined | null;
      let aiEndpointId: string | undefined;

      try {
        token = await auth.getAccessToken();
        console.log(`token: ${token}`);
      } catch (e) {
        return res
          .code(500)
          .send({ message: `Error when create token: ${e}` } as any);
      }

      try {
        aiEndpointId = await secretManager.getSecretValue(
          constants.AI_ENDPOINT_ID!
        );
        console.log(`aiEndpointId: ${aiEndpointId}`);
      } catch (e) {
        return res
          .code(500)
          .send({ message: `Error when fetching endpoint id: ${e}` } as any);
      }

      const url = `https://asia-southeast1-aiplatform.googleapis.com/v1/projects/${constants.GOOGLE_CLOUD_PROJECT}/locations/asia-southeast1/endpoints/${aiEndpointId}:predict`;

      got
        .post(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          json: {
            instances: [
              {
                b64: req.body.base64,
              },
            ],
          },
        })
        .then((res1) => {
          res.code(200).send(res1.body as any);
          console.log(res1.statusCode);
        })
        .catch((err) => {
          console.log(err);
          res.code(500).send();
        });
    }
  );
};

export default predictionRoutes;
