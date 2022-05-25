import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
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
    async (req, res) => {
      res.code(200).send({ jwtToken: 'klkanfmkemrelka' });
    }
  );
};

export default tokenRoutes;
