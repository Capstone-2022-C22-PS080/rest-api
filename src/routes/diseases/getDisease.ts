import { Type } from '@sinclair/typebox';
import db from '../../common/db';
import {
  defaultHeaderSchema,
  DefaultResponse401Schema,
} from '../../common/schema';
import {
  createErrorResponseSchema,
  createResponseSchemas,
  createSchema,
} from '../../common/schemaUtils';
import {
  CustomRouteHandler,
  HandlerGeneric,
  ObjectSchemaToType,
  ResponseSchema,
} from '../../common/types';

const getDiseaseParamsSchema = Type.Object({
  id: Type.Number({ description: 'Disease Id' }),
});

const getDiseaseResponseSchemas = createResponseSchemas({
  200: Type.Object(
    {
      id: Type.Number({ description: 'Disease Id' }),
      disease_name: Type.String({ description: 'The disease name' }),
      disease_description: Type.String({
        description: 'Disease description',
      }),
      first_aid_description: Type.String({
        description: 'First aid description',
      }),
    },
    {
      description: 'Success. Disease data successfully retrieved.',
    }
  ),

  404: createErrorResponseSchema(404, 'Disease data of current id not found'),
  401: DefaultResponse401Schema,
});

export type GetDiseaseSchema = HandlerGeneric<{
  Headers: ObjectSchemaToType<typeof defaultHeaderSchema>;
  Params: ObjectSchemaToType<typeof getDiseaseParamsSchema>;
  Reply: ResponseSchema<typeof getDiseaseResponseSchemas>;
}>;

export const getDiseaseSchema = createSchema({
  description: 'Get disease by id',
  tags: ['Disease'],
  headers: defaultHeaderSchema,
  params: getDiseaseParamsSchema,
  response: getDiseaseResponseSchemas,
});

export const getDisease: CustomRouteHandler<GetDiseaseSchema> = async (
  req,
  res
) => {
  try {
    return await db.op.disease
      .findFirst({
        where: {
          id: req.params.id,
        },
      })
      .then((d) => {
        if (!d) {
          return res.callNotFound();
        }

        return res.code(200).send({
          id: d.id,
          disease_name: d.diseaseName,
          disease_description: d.diseaseDescription,
          first_aid_description: d.firstAidDescription,
        });
      })
      .catch(() => {
        return res.code(500).send();
      });
  } catch (e) {
    return res.code(500).send();
  }
};
