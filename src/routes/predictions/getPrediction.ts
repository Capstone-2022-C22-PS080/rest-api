import { Type } from '@sinclair/typebox';
import {
  defaultHeaderSchema,
  DefaultResponse400Schema,
  DefaultResponse404Schema,
} from '../../common/schema';
import { createResponseSchema, createSchema } from '../../common/schemaUtils';
import {
  CustomRouteHandler,
  HandlerGeneric,
  ObjectSchemaToType,
  ResponseSchema,
} from '../../common/types';

const getPredictionBodySchema = Type.Object({
  base64: Type.RegEx(
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
    {
      description: 'Base64 image representation',
    }
  ),
});

const getPredictionResponseSchemas = createResponseSchema({
  200: Type.Object({
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
  404: DefaultResponse404Schema,
});

type GetPredictionSchema = HandlerGeneric<{
  Headers: ObjectSchemaToType<typeof defaultHeaderSchema>;
  Body: ObjectSchemaToType<typeof getPredictionBodySchema>;
  Reply: ResponseSchema<typeof getPredictionResponseSchemas>;
}>;

export const getPredictionSchema = createSchema({
  description:
    'Get prediction from Vertex AI endpoint (Cannot be used in development environment)',
  tags: ['Prediction'],
  headers: defaultHeaderSchema,
  body: getPredictionBodySchema,
  response: getPredictionResponseSchemas,
});

export const getPrediction: CustomRouteHandler<GetPredictionSchema> = async (
  req,
  res
) => {
  /**
   * Currently skip all operation
   */
  return res.code(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Currently cannot be used',
  });
};
