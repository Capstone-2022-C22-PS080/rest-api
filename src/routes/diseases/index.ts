import { FastifyPluginAsync } from 'fastify';
import { createDisease, createDiseaseSchema } from './createDisease';
import { deleteDisease, deleteDiseaseSchema } from './deleteDisease';
import { getDisease, getDiseaseSchema } from './getDisease';
import { getDiseases, getDiseasesSchema } from './getDiseases';
import { updateDisease, updateDiseaseSchema } from './updateDisease';

const diseasesRoutes: FastifyPluginAsync = async (app, _) => {
  app.post('', { schema: createDiseaseSchema }, createDisease);
  app.get('', { schema: getDiseasesSchema }, getDiseases);
  app.get(':id', { schema: getDiseaseSchema }, getDisease);
  app.put(':id', { schema: updateDiseaseSchema }, updateDisease);
  app.delete(':id', { schema: deleteDiseaseSchema }, deleteDisease);
};

export default diseasesRoutes;
