import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import {
  defaultHeaderSchema,
  DefaultResponse400Schema,
  DefaultResponse404Schema,
} from '../common/schema';
import { createResponseSchema, createSchema } from '../common/schemaUtils';
import {
  HandlerGeneric,
  ObjectSchemaToType,
  ResponseSchema,
} from '../common/types';

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

  const getDetectionSchema = createSchema({
    description:
      'Get prediction from Vertex AI endpoint (Cannot be used in development environment)',
    tags: ['Prediction'],
    headers: defaultHeaderSchema,
    body: getDetectionBodySchema,
    response: getDetectionResponseSchemas,
  });

  type GetDetectionSchema = HandlerGeneric<{
    Headers: ObjectSchemaToType<typeof defaultHeaderSchema>;
    Body: ObjectSchemaToType<typeof getDetectionBodySchema>;
    Reply: ResponseSchema<typeof getDetectionResponseSchemas>;
  }>;

  app.post<GetDetectionSchema>(
    '',
    {
      schema: getDetectionSchema,
    },
    async (req, res) => {
      /**
       * Currently skip all operation
       */
      return res.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Currently cannot be used',
      });
    }
  );
};

export default predictionRoutes;
