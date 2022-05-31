import { Type } from '@sinclair/typebox';

export const DefaultResponse204Schema = Type.Object(
  {},
  {
    description: 'Success. No Content',
  }
);

export const DefaultResponse404Schema = Type.Object(
  {
    statusCode: Type.Literal(404),
    error: Type.Literal('Not Found'),
    message: Type.String(),
  },
  {
    description: 'Item Not Found',
  }
);

export const DefaultResponse400Schema = Type.Object(
  {
    statusCode: Type.Literal(400),
    error: Type.Literal('Bad Request'),
    message: Type.String(),
  },
  {
    description: 'Bad Request',
  }
);

export const DefaultResponse401Schema = Type.Object(
  {
    statusCode: Type.Literal(400),
    error: Type.Literal('Unauthorized'),
    message: Type.String(),
  },
  {
    description: 'Unauthorized. Need Authorization Code',
  }
);

export const DefaultResponse415Schema = Type.Object(
  {
    statusCode: Type.Literal(415),
    error: Type.Literal('Unsupported Media Type'),
    message: Type.String(),
  },
  {
    description: 'Bad Request',
  }
);

export const defaultHeaderSchema = Type.Object({
  Authorization: Type.String({
    description: 'Bearer jwt token',
  }),
});
