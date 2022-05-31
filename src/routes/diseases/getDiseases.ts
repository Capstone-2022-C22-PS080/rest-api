import { Type } from '@sinclair/typebox';
import db from '../../common/db';
import {
  defaultHeaderSchema,
  DefaultResponse401Schema,
} from '../../common/schema';
import { createResponseSchemas, createSchema } from '../../common/schemaUtils';
import {
  CustomRouteHandler,
  HandlerGeneric,
  ObjectSchemaToType,
  ResponseSchema,
} from '../../common/types';

const getDiseasesQuerySchema = Type.Object({
  nameLike: Type.Optional(
    Type.String({
      description: 'Find disease with name contain the string',
    })
  ),
});

const getDiseasesResponseSchemas = createResponseSchemas({
  200: Type.Array(
    Type.Object(
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
        description: 'Array of disease data',
      }
    ),
    { description: 'Success. Arrays of disease datas successfully retrieved' }
  ),
  401: DefaultResponse401Schema,
});

type GetDiseasesSchema = HandlerGeneric<{
  Querystring: ObjectSchemaToType<typeof getDiseasesQuerySchema>;
  Reply: ResponseSchema<typeof getDiseasesResponseSchemas>;
  Headers: ObjectSchemaToType<typeof defaultHeaderSchema>;
}>;

export const getDiseasesSchema = createSchema({
  tags: ['Disease'],
  description: 'Get diseases data',
  headers: defaultHeaderSchema,
  querystring: getDiseasesQuerySchema,
  response: getDiseasesResponseSchemas,
});

export const getDiseases: CustomRouteHandler<GetDiseasesSchema> = async (
  req,
  res
) => {
  try {
    return await db.op.disease
      .findMany({
        where: {
          diseaseName: {
            search: req.query.nameLike,
          },
        },
      })
      .then((vals) => {
        return res.code(200).send(
          vals.map((v) => ({
            id: v.id,
            disease_name: v.diseaseName,
            disease_description: v.diseaseDescription,
            first_aid_description: v.firstAidDescription,
          }))
        );
      })
      .catch((e) => {
        console.error(e);
        return res.code(500).send();
      });
  } catch (e) {
    console.error(e);
    return res.code(500).send();
  }
};
