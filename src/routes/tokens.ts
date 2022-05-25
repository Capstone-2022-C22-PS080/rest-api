import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import authAdmin from '../common/authAdmin';
import { createResponseSchema, createSchema } from '../common/schemaUtils';
import {
  HandlerGeneric,
  ObjectSchemaToType,
  ResponseSchema,
} from '../common/types';

const tokenRoutes: FastifyPluginAsync = async (app, _opt) => {
  const createTokenBodySchema = Type.Object(
    {
      uid: Type.String({
        description: 'Firebase user id',
      }),
    },
    {
      description: 'Create token body schema',
    }
  );

  const createTokenResponseSchemas = createResponseSchema({
    200: Type.Object(
      {
        jwtToken: Type.String({
          description: 'jwt token to use in the header as Bearer token',
        }),
      },
      {
        description: 'Success. JWT token is obtained',
      }
    ),
  });

  const createTokenSchema = createSchema({
    description: 'Get token for a firebase user',
    tags: ['Token'],
    body: createTokenBodySchema,
    response: createTokenResponseSchemas,
  });

  type CreateTokenSchema = HandlerGeneric<{
    Body: ObjectSchemaToType<typeof createTokenBodySchema>;
    Reply: ResponseSchema<typeof createTokenResponseSchemas>;
  }>;

  app.post<CreateTokenSchema>(
    '',
    {
      schema: createTokenSchema,
    },
    async function (req, res) {
      const { uid } = req.body;

      try {
        const user = await authAdmin.getUser(uid);
      } catch (err) {
        this;
        return res.code(500).send({
          error: 'Internal Server Error',
          message: 'Error when creating token',
          statusCode: 500,
        });
      }

      const jwtToken = await res.jwtSign({
        uid,
        iat: Date.now(),
      });

      return res.code(200).send({
        jwtToken,
      });
    }
  );
};

export default tokenRoutes;
