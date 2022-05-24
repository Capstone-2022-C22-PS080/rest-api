import { TSchema, Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';

export type ResponseCode = 200 | 204 | 400 | 404 | 500;

const defaultResponseSchemas = {
  500: Type.Object(
    {
      statusCode: Type.Literal(500),
      error: Type.Literal('Internal Server Error'),
      message: Type.String(),
    },
    {
      description: 'Internal Server Error',
    }
  ),
};

export const createResponseSchema = <
  T extends Partial<Record<ResponseCode, TSchema>>
>(
  responseSchema: T
) => {
  return {
    ...defaultResponseSchemas,
    ...responseSchema,
  };
};

export const createSchema = (schema: FastifySchema) => schema;
