import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
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
        description: 'Create a disease data',
        body: createDiseaseBodySchema,
        response: createDiseaseResponseSchemas,
      },
    },
    async (req, res) => {
      try {
        // TODO: implement

        const { disease_name, disease_description, first_aid_description } =
          req.body;

        return res.code(200).send();
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
        description: 'Get diseases data',
        querystring: getDiseasesQuerySchema,
        response: getDiseasesResponseSchemas,
      },
    },
    async (req, res) => {
      try {
        // TODO: implement

        return res.code(200).send();
      } catch (e) {
        return res.code(500).send();
      }
    }
  );

  /**
   * Get disease by id
   */

  const getDiseaseParamsSchema = Type.Object({
    id: Type.String({ description: 'Disease Id' }),
  });

  type GetDiseaseParamsSchema = ObjectSchemaToType<
    typeof getDiseaseParamsSchema
  >;

  const getDiseaseResponseSchemas = createResponseSchema({
    200: Type.Object(
      {
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
        params: getDiseaseParamsSchema,
        response: getDiseaseResponseSchemas,
      },
    },
    async (req, res) => {
      try {
        return res.code(200).send();
      } catch (e) {
        return res.code(500).send();
      }
    }
  );

  /**
   * For updating disease data
   */
  const updateDiseaseParamsSchema = Type.Object({
    id: Type.String({ description: 'Disease Id' }),
  });

  type UpdateDiseaseParamsSchema = ObjectSchemaToType<
    typeof updateDiseaseParamsSchema
  >;

  const updateDiseaseBodySchema = Type.Object({});

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
        params: updateDiseaseParamsSchema,
        body: updateDiseaseBodySchema,
        response: updateDiseaseResponseSchemas,
      },
    },
    async (req, res) => {
      try {
        // TODO: implement

        return res.code(200).send();
      } catch (e) {
        return res.code(500).send();
      }
    }
  );

  /**
   * For deleting disease
   */
  const deleteDiseaseParamsSchema = Type.Object({
    id: Type.String({ description: 'Disease Id meant to be deleted' }),
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
        params: deleteDiseaseParamsSchema,
        response: deleteDiseaseResponseSchemas,
      },
    },
    async (req, res) => {
      try {
        // TODO: implement

        return res.code(200).send();
      } catch (e) {
        return res.code(500).send();
      }
    }
  );
};

export default diseasesRoutes;
