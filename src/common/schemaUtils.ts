import { TSchema, Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';

export type ResponseCode = 200 | 204 | 400 | 401 | 403 | 404 | 500;

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

export const createSchema = (schema: FastifySchema) => schema;

type ErrorResponseCodeMap = {
  400: 'Bad Request';
  401: 'Unauthorized';
  403: 'Forbidden';
  404: 'Not Found';
  500: 'Internal Server Error';
};

export const createResponseSchemas = <
  T extends Partial<Record<ResponseCode, TSchema>>
>(
  responseSchema: T
) => {
  return {
    ...defaultResponseSchemas,
    ...responseSchema,
  };
};

const errorResponseCodeMap: ErrorResponseCodeMap = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
};

export const createErrorResponseSchema = <
  RC extends keyof ErrorResponseCodeMap
>(
  statusCode: RC,
  description: string
) =>
  Type.Object(
    {
      statusCode: Type.Literal(statusCode),
      error: Type.Literal(errorResponseCodeMap[statusCode]),
      message: Type.String({ description: 'Error Message' }),
    },
    {
      description: `${errorResponseCodeMap[statusCode]}. ${description}`,
    }
  );

type OkResponseCodeMap = {
  200: 'Success';
  204: 'Success. No Content';
};

const okResponseCodeMap: OkResponseCodeMap = {
  200: 'Success',
  204: 'Success. No Content',
};

export const create204ResponseSchema = (description: string) =>
  Type.Object(
    {},
    {
      description,
    }
  );
