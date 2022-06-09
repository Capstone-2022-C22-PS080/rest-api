import { Type } from '@sinclair/typebox';
import db from '../../common/db';
import {
  defaultHeaderSchema,
  DefaultResponse400Schema,
  DefaultResponse401Schema,
} from '../../common/schema';
import {
  create204ResponseSchema,
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

const updateDiseaseParamsSchema = Type.Object({
  id: Type.Number({ description: 'Disease Id' }),
});

const updateDiseaseBodySchema = Type.Object({
  disease_name: Type.Optional(
    Type.String({
      description: 'The disease name',
    })
  ),
  disease_description: Type.Optional(
    Type.String({
      description: 'Disease description',
    })
  ),
  first_aid_description: Type.Optional(
    Type.String({
      description: 'First aid description',
    })
  ),
});

const updateDiseaseResponseSchemas = createResponseSchemas({
  204: create204ResponseSchema('Success. Disease updated.'),
  404: createErrorResponseSchema(404, 'Disease are not found.'),
  400: DefaultResponse400Schema,
  401: DefaultResponse401Schema,
});

export type UpdateDiseaseSchema = HandlerGeneric<{
  Headers: ObjectSchemaToType<typeof defaultHeaderSchema>;
  Params: ObjectSchemaToType<typeof updateDiseaseParamsSchema>;
  Body: ObjectSchemaToType<typeof updateDiseaseBodySchema>;
  Reply: ResponseSchema<typeof updateDiseaseResponseSchemas>;
}>;

export const updateDiseaseSchema = createSchema({
  description: 'Update disease data',
  tags: ['Disease'],
  headers: defaultHeaderSchema,
  params: updateDiseaseParamsSchema,
  body: updateDiseaseBodySchema,
  response: updateDiseaseResponseSchemas,
});

export const updateDisease: CustomRouteHandler<UpdateDiseaseSchema> = async (
  req,
  res
) => {
  try {
    // check if exists
    await db.op.disease
      .findFirst({ where: { id: req.params.id } })
      .then((d) => {
        if (!d) {
          return res.callNotFound();
        }
      })
      .catch(() => {
        return res.code(500).send();
      });

    /**
     * update if exists
     */
    return await db.op.disease
      .update({
        where: {
          id: req.params.id,
        },
        data: {
          id: req.params.id,
          diseaseName: req.body.disease_name,
          diseaseDescription: req.body.disease_description,
          firstAidDescription: req.body.first_aid_description,
        },
      })
      .then((v) => {
        return res.code(204).send();
      })
      .catch(() => {
        return res.code(500).send();
      });
  } catch (e) {
    return res.code(500).send();
  }
};
