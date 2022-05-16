import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import {
  DefaultResponse204Schema,
  DefaultResponse415Schema,
} from '../common/schema';
import { createResponseSchema } from '../common/schemaUtils';
import { ObjectSchemaToType, ResponseSchema } from '../common/types';

const uploadSkinPhotoRoutes: FastifyPluginAsync = async (app, _) => {
  const uploadSkinPhotoBodySchema = Type.Object({
    file: Type.String({ description: 'Photo file' }),
  });

  type UploadSKinPhotoBodySchema = ObjectSchemaToType<
    typeof uploadSkinPhotoBodySchema
  >;

  const uploadSkinPhotoResponsesSchema = createResponseSchema({
    204: DefaultResponse204Schema,
    415: DefaultResponse415Schema,
  });

  type UploadSkinPhotoResponsesSchema = ResponseSchema<
    typeof uploadSkinPhotoResponsesSchema
  >;

  app.post<{
    Body: UploadSKinPhotoBodySchema;
    Reply: UploadSkinPhotoResponsesSchema;
  }>(
    '',
    {
      schema: {
        description: 'Upload skin photo',
        consumes: ['image/jpg'],
        body: uploadSkinPhotoBodySchema,
        // response: uploadSkinPhotoResponsesSchema,
      },
    },
    async (req, res) => {
      try {
        res.code(200).send({
          file: req.body.file,
        });
      } catch (e) {}
    }
  );
};

export default uploadSkinPhotoRoutes;
