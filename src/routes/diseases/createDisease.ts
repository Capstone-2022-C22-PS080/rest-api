import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import db from '../../common/db';
import { defaultHeaderSchema } from '../../common/schema';
import { createResponseSchemas } from '../../common/schemaUtils';
import {
  CustomRouteHandler,
  HandlerGeneric,
  ObjectSchemaToType,
  ResponseSchema,
} from '../../common/types';

/**
 * create a disease
 */

const createDiseaseBodySchema = Type.Object({
  disease_name: Type.String({ description: 'The disease name' }),
  disease_description: Type.String({ description: 'Disease description' }),
  first_aid_description: Type.String({
    description: 'First aid description',
  }),
});

const createDiseaseResponseSchemas = createResponseSchemas({
  200: Type.Object({
    id: Type.Number({ description: 'Id of added disease data' }),
  }),
});

export const createDiseaseSchema: FastifySchema = {
  tags: ['Disease'],
  description: 'Create a disease data',
  headers: defaultHeaderSchema,
  body: createDiseaseBodySchema,
  response: createDiseaseResponseSchemas,
};

type CreateDiseaseSchema = HandlerGeneric<{
  Headers: ObjectSchemaToType<typeof defaultHeaderSchema>;
  Body: ObjectSchemaToType<typeof createDiseaseBodySchema>;
  Reply: ResponseSchema<typeof createDiseaseResponseSchemas>;
}>;

export const createDisease: CustomRouteHandler<CreateDiseaseSchema> = async (
  req,
  res
) => {
  try {
    return await db.op.disease
      .create({
        data: {
          diseaseName: req.body.disease_name,
          diseaseDescription: req.body.disease_description,
          firstAidDescription: req.body.first_aid_description,
        },
      })
      .then(({ id }) => {
        return res.code(200).send({ id });
      })
      .catch(() => {
        return res.code(500).send();
      });
  } catch (e) {
    return res.code(500).send();
  }
};
