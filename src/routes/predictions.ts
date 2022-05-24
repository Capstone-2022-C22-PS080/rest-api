import { Type } from '@sinclair/typebox';
import axios, { AxiosResponse } from 'axios';
import { FastifyPluginAsync } from 'fastify';
import { auth } from 'google-auth-library';
import constants from '../common/constants';
import db from '../common/db';
import {
  DefaultResponse400Schema,
  DefaultResponse404Schema,
} from '../common/schema';
import { createResponseSchema } from '../common/schemaUtils';
import secretManager from '../common/secretManager';
import { ObjectSchemaToType, ResponseSchema } from '../common/types';

const diseaseClassNames = [
  'Acne and Rosacea Photos',
  'Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions',
  'Atopic Dermatitis Photos',
  'Bullous Disease Photos',
  'Cellulitis Impetigo and other Bacterial Infections',
  'Eczema Photos',
  'Exanthems and Drug Eruptions',
  'Hair Loss Photos Alopecia and other Hair Diseases',
  'Herpes HPV and other STDs Photos',
  'Light Diseases and Disorders of Pigmentation',
  'Lupus and other Connective Tissue diseases',
  'Melanoma Skin Cancer Nevi and Moles',
  'Nail Fungus and other Nail Disease',
  'Poison Ivy Photos and other Contact Dermatitis',
  'Psoriasis pictures Lichen Planus and related diseases',
  'Scabies Lyme Disease and other Infestations and Bites',
  'Seborrheic Keratoses and other Benign Tumors',
  'Systemic Disease',
  'Tinea Ringworm Candidiasis and other Fungal Infections',
  'Urticaria Hives',
  'Vascular Tumors',
  'Vasculitis Photos',
  'Warts Molluscum and other Viral Infections',
];

const predictionRoutes: FastifyPluginAsync = async (app, _) => {
  const getDetectionBodySchema = Type.Object({
    base64: Type.RegEx(
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
      {
        description: 'Base64 image representation',
      }
    ),
  });

  type GetDetectionBodySchema = ObjectSchemaToType<
    typeof getDetectionBodySchema
  >;

  const getDetectionResponseSchemas = createResponseSchema({
    200: Type.Object({
      disease_name: Type.String({
        description: 'Name of the detected disease',
      }),
      disease_description: Type.String({
        description: 'Description of the disease',
      }),
      first_aid_description: Type.String({
        description: 'Description of the first aid treatment',
      }),
    }),

    400: DefaultResponse400Schema,
    404: DefaultResponse404Schema,
  });

  type GetDetectionResponseSchemas = ResponseSchema<
    typeof getDetectionResponseSchemas
  >;

  app.post<{
    Body: GetDetectionBodySchema;
    Reply: GetDetectionResponseSchemas;
  }>(
    '',
    {
      schema: {
        body: getDetectionBodySchema,
        response: getDetectionResponseSchemas,
        consumes: ['application/json'],
        produces: ['application/json'],
      },
    },
    async (req, res) => {
      /**
       * Skip if in development environment
       */
      if (!constants.IS_PROD) {
        console.log('Currently not implemented in dev environment');
        return res.code(500).send();
      }

      let token: string | undefined | null;
      let aiEndpointId: string | undefined;

      /**
       * get token for request to Vertex AI's prediction endpoint
       * service account should have Vertex AI Service User permission
       */
      try {
        token = await auth.getAccessToken();
        console.log(`token: ${token}`);
      } catch (e) {
        return res
          .code(500)
          .send({ message: `Error when create token: ${e}` } as any);
      }

      /**
       * get endpoint secret
       */
      try {
        aiEndpointId = await secretManager.getSecretValue(
          constants.AI_ENDPOINT_ID!
        );
        console.log(`aiEndpointId: ${aiEndpointId}`);
      } catch (e) {
        return res
          .code(500)
          .send({ message: `Error when fetching endpoint id: ${e}` } as any);
      }

      const url = `https://asia-southeast1-aiplatform.googleapis.com/v1/projects/${constants.GOOGLE_CLOUD_PROJECT}/locations/asia-southeast1/endpoints/${aiEndpointId}:predict`;
      const data = {
        instances: [
          {
            b64: req.body.base64,
          },
        ],
      };

      type AIResponse = {
        predictions: number[][];
        deployedModelId: string;
        model: string;
        modelDisplayName: string;
      };

      let axiosRes: AxiosResponse<AIResponse>;

      /**
       * make request to vertex AI
       */
      try {
        axiosRes = await axios.post(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (e) {
        return res.code(500).send();
      }

      const predictionIndex = axiosRes.data.predictions[0].indexOf(1);

      if (predictionIndex === -1) {
        console.log(`Prediction got no matches`);

        return res.code(404).send();
      }

      const diseaseName = diseaseClassNames[predictionIndex];
      console.log(`Disease name => ${diseaseName}`);

      /**
       * get disease data from database
       */
      return await db.op.disease
        .findFirst({
          where: {
            diseaseName: {
              search: diseaseName,
            },
          },
        })
        .then((disease) => {
          if (!disease) {
            console.log('Disease Not Found');

            return res.code(404).send();
          }

          return res.code(200).send({
            disease_name: disease.diseaseName,
            disease_description: disease.diseaseDescription,
            first_aid_description: disease.firstAidDescription,
          });
        })
        .catch((err) => {
          console.error(err);
          return res.code(500).send();
        });
    }
  );
};

export default predictionRoutes;
