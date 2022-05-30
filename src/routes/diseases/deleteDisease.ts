import { Type } from '@sinclair/typebox';
import db from '../../common/db';
import {
  defaultHeaderSchema,
  DefaultResponse204Schema,
  DefaultResponse404Schema,
} from '../../common/schema';
import { createResponseSchemas, createSchema } from '../../common/schemaUtils';
import {
  CustomRouteHandler,
  HandlerGeneric,
  ObjectSchemaToType,
  ResponseSchema,
} from '../../common/types';

const deleteDiseaseParamsSchema = Type.Object({
  id: Type.Number({ description: 'Disease Id meant to be deleted' }),
});

const deleteDiseaseResponseSchemas = createResponseSchemas({
  204: DefaultResponse204Schema,
  404: DefaultResponse404Schema,
});

type DeleteDiseaseSchema = HandlerGeneric<{
  Headers: ObjectSchemaToType<typeof defaultHeaderSchema>;
  Params: ObjectSchemaToType<typeof deleteDiseaseParamsSchema>;
  Reply: ResponseSchema<typeof deleteDiseaseResponseSchemas>;
}>;

export const deleteDiseaseSchema = createSchema({
  description: 'Delete disease data by Id',
  tags: ['Disease'],
  headers: defaultHeaderSchema,
  params: deleteDiseaseParamsSchema,
  response: deleteDiseaseResponseSchemas,
});

export const deleteDisease: CustomRouteHandler<DeleteDiseaseSchema> = async (
  req,
  res
) => {
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
};
