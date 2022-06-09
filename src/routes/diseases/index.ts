import { FastifyPluginAsync } from 'fastify';
import { onRequestAuthorize } from '../routeUtils';
import {
  createDisease,
  CreateDiseaseSchema,
  createDiseaseSchema,
} from './createDisease';
import {
  deleteDisease,
  DeleteDiseaseSchema,
  deleteDiseaseSchema,
} from './deleteDisease';
import { getDisease, GetDiseaseSchema, getDiseaseSchema } from './getDisease';
import {
  getDiseases,
  GetDiseasesSchema,
  getDiseasesSchema,
} from './getDiseases';
import {
  updateDisease,
  UpdateDiseaseSchema,
  updateDiseaseSchema,
} from './updateDisease';

const diseasesRoutes: FastifyPluginAsync = async (app, _) => {
  app.post<CreateDiseaseSchema>(
    '',
    {
      schema: createDiseaseSchema,
      onRequest: [onRequestAuthorize],
    },
    createDisease
  );

  app.get<GetDiseasesSchema>(
    '',
    {
      schema: getDiseasesSchema,
      onRequest: [onRequestAuthorize],
    },
    getDiseases
  );

  app.get<GetDiseaseSchema>(
    '/:id',
    {
      schema: getDiseaseSchema,
      onRequest: [onRequestAuthorize],
    },
    getDisease
  );

  app.put<UpdateDiseaseSchema>(
    '/:id',
    {
      schema: updateDiseaseSchema,
      onRequest: [onRequestAuthorize],
    },
    updateDisease
  );

  app.delete<DeleteDiseaseSchema>(
    '/:id',
    {
      schema: deleteDiseaseSchema,
      onRequest: [onRequestAuthorize],
    },
    deleteDisease
  );
};

export default diseasesRoutes;
