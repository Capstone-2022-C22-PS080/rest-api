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

export type GetDiseasesSchema = HandlerGeneric<{
  Querystring: ObjectSchemaToType<typeof getDiseasesQuerySchema>;
  Reply: ResponseSchema<typeof getDiseasesResponseSchemas>;
  Headers: ObjectSchemaToType<typeof defaultHeaderSchema>;
}>;

export const getDiseasesSchema = createSchema({
  tags: ['Disease'],
  description: 'Get diseases data (Need Authorization)',
  headers: defaultHeaderSchema,
  querystring: getDiseasesQuerySchema,
  response: getDiseasesResponseSchemas,
});

export const getDiseases: CustomRouteHandler<GetDiseasesSchema> =
  async function (req, res) {
    const diseases = await db.op.disease
      .findMany({
        where: {
          diseaseName: {
            search: req.query.nameLike,
          },
        },
      })
      .then((fetchedDiseases) => {
        this.log.info(`Fetched diseases => ${fetchedDiseases}`);

        return fetchedDiseases.map((fetchedDisease) => ({
          id: fetchedDisease.id,
          disease_name: fetchedDisease.diseaseName,
          disease_description: fetchedDisease.diseaseDescription,
          first_aid_description: fetchedDisease.firstAidDescription,
        }));
      })
      .catch((e) => {
        this.log.error(`Failed when getting diseases`);
        this.log.error(e);

        return undefined;
      });

    if (!diseases) {
      return res.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed when fetching diseases',
      });
    }

    return res.code(200).send(diseases);
  };
