import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import db from '../../common/db';
import {
  defaultHeaderSchema,
  DefaultResponse401Schema,
} from '../../common/schema';
import {
  createErrorResponseSchema,
  createResponseSchemas,
} from '../../common/schemaUtils';
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
  200: Type.Object(
    {
      id: Type.Number({ description: 'Id of added disease data' }),
    },
    {
      description: 'Success. Disease data are created.',
    }
  ),
  400: createErrorResponseSchema(
    400,
    'One of the fields or more is not match requirement.'
  ),
  401: DefaultResponse401Schema,
});

export const createDiseaseSchema: FastifySchema = {
  tags: ['Disease'],
  description: 'Create a disease data (Need Authorization)',
  headers: defaultHeaderSchema,
  body: createDiseaseBodySchema,
  response: createDiseaseResponseSchemas,
};

export type CreateDiseaseSchema = HandlerGeneric<{
  Headers: ObjectSchemaToType<typeof defaultHeaderSchema>;
  Body: ObjectSchemaToType<typeof createDiseaseBodySchema>;
  Reply: ResponseSchema<typeof createDiseaseResponseSchemas>;
}>;

export const createDisease: CustomRouteHandler<CreateDiseaseSchema> =
  async function (req, res) {
    const id = await db.op.disease
      .create({
        data: {
          diseaseName: req.body.disease_name,
          diseaseDescription: req.body.disease_description,
          firstAidDescription: req.body.first_aid_description,
        },
      })
      .then(({ id }) => {
        this.log.info(`Created disease Id => ${id}`);

        return id;
      })
      .catch((err) => {
        this.log.error(`Failed when creating disease`);
        this.log.error(err);

        return undefined;
      });

    /**
     * check if create success
     */
    if (!id) {
      return res.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed when creating disease',
      });
    }

    return res.code(200).send({
      id: id,
    });
  };
