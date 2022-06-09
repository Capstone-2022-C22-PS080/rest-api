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
  description: 'Get disease by id (Need Authorization)',
  tags: ['Disease'],
  headers: defaultHeaderSchema,
  params: getDiseaseParamsSchema,
  response: getDiseaseResponseSchemas,
});

export const getDisease: CustomRouteHandler<GetDiseaseSchema> = async function (
  req,
  res
) {
  const foundDisease = await db.op.disease
    .findFirst({
      where: {
        id: req.params.id,
      },
    })
    .then((fetchedDisease) => {
      if (!fetchedDisease) {
        this.log.info(`Disease id of ${req.params.id} are not found`);

        return undefined;
      }

      this.log.info(`Fetched disease id => ${fetchedDisease.id}`);

      return fetchedDisease;
    })
    .catch((err) => {
      this.log.error(`Failed when fetching disease from DB`);
      this.log.error(err);

      return undefined;
    });

  /**
   * check if exists
   */
  if (!foundDisease) {
    return res.callNotFound();
  }

  return res.code(200).send({
    id: foundDisease.id,
    disease_name: foundDisease.diseaseName,
    disease_description: foundDisease.diseaseDescription,
    first_aid_description: foundDisease.firstAidDescription,
  });
};
