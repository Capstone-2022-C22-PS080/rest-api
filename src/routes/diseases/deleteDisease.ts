import { Type } from '@sinclair/typebox';
import db from '../../common/db';
import {
  defaultHeaderSchema,
  DefaultResponse401Schema,
} from '../../common/schema';
import {
  create204ResponseSchema,
  createErrorResponseSchema,
  createResponseSchemas,
  createSchema,
} from '../../common/schemaUtils';
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
  204: create204ResponseSchema('No Content. Disease successfully deleted'),
  404: createErrorResponseSchema(404, 'Disease are not found.'),
  401: DefaultResponse401Schema,
});

export type DeleteDiseaseSchema = HandlerGeneric<{
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

export const deleteDisease: CustomRouteHandler<DeleteDiseaseSchema> =
  async function (req, res) {
    const deletedId = await db.op.disease
      .delete({
        where: {
          id: req.params.id,
        },
      })
      .then(({ id }) => {
        this.log.info(`Deleted disease id => ${id}`);

        return id;
      })
      .catch((err) => {
        this.log.error(`Failed when deleting disease`);
        this.log.error(err);

        return undefined;
      });

    /**
     * check if disease exists
     */
    if (!deletedId) {
      return res.callNotFound();
    }

    return res.code(204).send();
  };
