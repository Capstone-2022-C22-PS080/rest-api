import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import db from '../common/db';
import {
  DefaultResponse204Schema,
  DefaultResponse400Schema,
  DefaultResponse404Schema,
} from '../common/schema';
import { createResponseSchema } from '../common/schemaUtils';
import { ObjectSchemaToType, ResponseSchema } from '../common/types';

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

  type CreateDiseaseBodySchema = ObjectSchemaToType<
    typeof createDiseaseBodySchema
  >;

  const createDiseaseResponseSchemas = createResponseSchema({
    200: Type.Object({
      id: Type.Number({ description: 'Id of added disease data' }),
    }),
  });

  type CreateDiseaseResponseSchemas = ResponseSchema<
    typeof createDiseaseResponseSchemas
  >;

  app.post<{
    Body: CreateDiseaseBodySchema;
    Reply: CreateDiseaseResponseSchemas;
  }>(
    '',
    {
      schema: {
        tags: ['Disease'],
        description: 'Create a disease data',
        body: createDiseaseBodySchema,
        response: createDiseaseResponseSchemas,
      },
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

  const getDiseasesQuerySchema = Type.Object({
    nameLike: Type.Optional(
      Type.String({
        description: 'Find disease with name contain the string',
      })
    ),
  });

  type GetDiseaseQuerySchema = ObjectSchemaToType<
    typeof getDiseasesQuerySchema
  >;

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

  type GetDiseasesResponseSchemas = ResponseSchema<
    typeof getDiseasesResponseSchemas
  >;

  app.get<{
    Querystring: GetDiseaseQuerySchema;
    Reply: GetDiseasesResponseSchemas;
  }>(
    '',
    {
      schema: {
        tags: ['Disease'],
        description: 'Get diseases data',
        querystring: getDiseasesQuerySchema,
        response: getDiseasesResponseSchemas,
      },
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

  type GetDiseaseParamsSchema = ObjectSchemaToType<
    typeof getDiseaseParamsSchema
  >;

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

  type GetDiseaseResponseSchemas = ResponseSchema<
    typeof getDiseaseResponseSchemas
  >;

  app.get<{
    Params: GetDiseaseParamsSchema;
    Reply: GetDiseaseResponseSchemas;
  }>(
    '/:id',
    {
      schema: {
        description: 'Get disease by id',
        tags: ['Disease'],
        params: getDiseaseParamsSchema,
        response: getDiseaseResponseSchemas,
      },
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
              return res.code(404).send();
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

  type UpdateDiseaseParamsSchema = ObjectSchemaToType<
    typeof updateDiseaseParamsSchema
  >;

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

  type UpdateDiseaseBodySchema = ObjectSchemaToType<
    typeof updateDiseaseBodySchema
  >;

  const updateDiseaseResponseSchemas = createResponseSchema({
    204: DefaultResponse204Schema,
    404: DefaultResponse404Schema,
    400: DefaultResponse400Schema,
  });

  type UpdateDiseaseResponseSchemas = ResponseSchema<
    typeof updateDiseaseResponseSchemas
  >;

  app.put<{
    Params: UpdateDiseaseParamsSchema;
    Body: UpdateDiseaseBodySchema;
    Reply: UpdateDiseaseResponseSchemas;
  }>(
    '/:id',
    {
      schema: {
        description: 'Update disease data',
        tags: ['Disease'],
        params: updateDiseaseParamsSchema,
        body: updateDiseaseBodySchema,
        response: updateDiseaseResponseSchemas,
      },
    },
    async (req, res) => {
      try {
        // check if exists
        await db.op.disease
          .findFirst({ where: { id: req.params.id } })
          .then((d) => {
            if (!d) {
              return res.code(404).send();
            }
          })
          .catch(() => {
            return res.code(500).send();
          });

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

  type DeleteDiseaseParamsSchema = ObjectSchemaToType<
    typeof deleteDiseaseParamsSchema
  >;

  const deleteDiseaseResponseSchemas = createResponseSchema({
    204: DefaultResponse204Schema,
    404: DefaultResponse404Schema,
  });

  type DeleteDiseaseResponseSchemas = ResponseSchema<
    typeof deleteDiseaseResponseSchemas
  >;

  app.delete<{
    Params: DeleteDiseaseParamsSchema;
    Reply: DeleteDiseaseResponseSchemas;
  }>(
    '/:id',
    {
      schema: {
        description: 'Delete disease data by Id',
        tags: ['Disease'],
        params: deleteDiseaseParamsSchema,
        response: deleteDiseaseResponseSchemas,
      },
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
              return res.code(404).send();
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
