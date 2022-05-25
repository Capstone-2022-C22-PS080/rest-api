import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync, FastifySchema } from 'fastify';
import db from '../common/db';
import {
  defaultHeaderSchema,
  DefaultResponse204Schema,
  DefaultResponse400Schema,
  DefaultResponse404Schema,
} from '../common/schema';
import { createResponseSchema, createSchema } from '../common/schemaUtils';
import {
  HandlerGeneric,
  ObjectSchemaToType,
  ResponseSchema,
} from '../common/types';

const diseasesRoutes: FastifyPluginAsync = async (app, _) => {
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

  const createDiseaseResponseSchemas = createResponseSchema({
    200: Type.Object({
      id: Type.Number({ description: 'Id of added disease data' }),
    }),
  });

  const createDiseaseSchema: FastifySchema = {
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

  app.post<CreateDiseaseSchema>(
    '',
    {
      schema: createDiseaseSchema,
    },
    async (req, res) => {
      try {
        // TODO: implement

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
    }
  );

  /**
   * Get diseases
   */

  const getDiseasesQuerySchema = Type.Object({
    nameLike: Type.Optional(
      Type.String({
        description: 'Find disease with name contain the string',
      })
    ),
  });

  const getDiseasesResponseSchemas = createResponseSchema({
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
          description: 'Disease description',
        }
      ),
      { description: 'Array of diseases' }
    ),
  });

  const getDiseasesSchema = createSchema({
    tags: ['Disease'],
    description: 'Get diseases data',
    headers: defaultHeaderSchema,
    querystring: getDiseasesQuerySchema,
    response: getDiseasesResponseSchemas,
  });

  type GetDiseasesSchema = HandlerGeneric<{
    Querystring: ObjectSchemaToType<typeof getDiseasesQuerySchema>;
    Reply: ResponseSchema<typeof getDiseasesResponseSchemas>;
    Headers: ObjectSchemaToType<typeof defaultHeaderSchema>;
  }>;

  app.get<GetDiseasesSchema>(
    '',
    {
      schema: getDiseasesSchema,
    },
    async (req, res) => {
      try {
        // TODO: implement

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
    }
  );

  /**
   * Get disease by id
   */

  const getDiseaseParamsSchema = Type.Object({
    id: Type.Number({ description: 'Disease Id' }),
  });

  const getDiseaseResponseSchemas = createResponseSchema({
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
        description: 'Disease description',
      }
    ),

    404: DefaultResponse404Schema,
  });

  const getDiseaseSchema = createSchema({
    description: 'Get disease by id',
    tags: ['Disease'],
    headers: defaultHeaderSchema,
    params: getDiseaseParamsSchema,
    response: getDiseaseResponseSchemas,
  });

  type GetDiseaseSchema = HandlerGeneric<{
    Headers: ObjectSchemaToType<typeof defaultHeaderSchema>;
    Params: ObjectSchemaToType<typeof getDiseaseParamsSchema>;
    Reply: ResponseSchema<typeof getDiseaseResponseSchemas>;
  }>;

  app.get<GetDiseaseSchema>(
    '/:id',
    {
      schema: getDiseaseSchema,
    },
    async (req, res) => {
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
    }
  );

  /**
   * For updating disease data
   */
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

  const updateDiseaseResponseSchemas = createResponseSchema({
    204: DefaultResponse204Schema,
    404: DefaultResponse404Schema,
    400: DefaultResponse400Schema,
  });

  const updateDiseaseSchema = createSchema({
    description: 'Update disease data',
    tags: ['Disease'],
    headers: defaultHeaderSchema,
    params: updateDiseaseParamsSchema,
    body: updateDiseaseBodySchema,
    response: updateDiseaseResponseSchemas,
  });

  type UpdateDiseaseSchema = HandlerGeneric<{
    Headers: ObjectSchemaToType<typeof defaultHeaderSchema>;
    Params: ObjectSchemaToType<typeof updateDiseaseParamsSchema>;
    Body: ObjectSchemaToType<typeof updateDiseaseBodySchema>;
    Reply: ResponseSchema<typeof updateDiseaseResponseSchemas>;
  }>;

  app.put<UpdateDiseaseSchema>(
    '/:id',
    {
      schema: updateDiseaseSchema,
    },
    async (req, res) => {
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
    }
  );

  /**
   * For deleting disease
   */
  const deleteDiseaseParamsSchema = Type.Object({
    id: Type.Number({ description: 'Disease Id meant to be deleted' }),
  });

  const deleteDiseaseResponseSchemas = createResponseSchema({
    204: DefaultResponse204Schema,
    404: DefaultResponse404Schema,
  });

  const deleteDiseaseSchema = createSchema({
    description: 'Delete disease data by Id',
    tags: ['Disease'],
    headers: defaultHeaderSchema,
    params: deleteDiseaseParamsSchema,
    response: deleteDiseaseResponseSchemas,
  });

  type DeleteDiseaseSchema = HandlerGeneric<{
    Headers: ObjectSchemaToType<typeof defaultHeaderSchema>;
    Params: ObjectSchemaToType<typeof deleteDiseaseParamsSchema>;
    Reply: ResponseSchema<typeof deleteDiseaseResponseSchemas>;
  }>;

  app.delete<DeleteDiseaseSchema>(
    '/:id',
    {
      schema: deleteDiseaseSchema,
    },
    async (req, res) => {
      try {
        // check if exists
        await db.op.disease
          .findFirst({
            where: {
              id: req.params.id,
            },
          })
          .then((d) => {
            if (!d) {
              return res.callNotFound();
            }
          })
          .catch(() => {
            return res.code(500).send();
          });

        return await db.op.disease
          .delete({
            where: {
              id: req.params.id,
            },
          })
          .then(() => {
            return res.code(204).send();
          })
          .catch(() => {
            return res.code(500).send();
          });
      } catch (e) {
        return res.code(500).send();
      }
    }
  );
};

export default diseasesRoutes;
