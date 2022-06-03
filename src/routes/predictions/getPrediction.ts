import { Type } from '@sinclair/typebox';
import axios, { AxiosResponse } from 'axios';
import constants from '../../common/constants';
import db from '../../common/db';
import {
  defaultHeaderSchema,
  DefaultResponse400Schema,
  DefaultResponse401Schema,
  DefaultResponse404Schema,
} from '../../common/schema';
import { createResponseSchemas, createSchema } from '../../common/schemaUtils';
import {
  CustomRouteHandler,
  HandlerGeneric,
  ObjectSchemaToType,
  ResponseSchema,
} from '../../common/types';
import googleAuth from '../../services/googleAuth';
import secretManager from '../../services/secretManager';

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

const getPredictionBodySchema = Type.Object({
  base64: Type.RegEx(
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
    {
      description: 'Base64 image representation',
    }
  ),
});

const getPredictionResponseSchemas = createResponseSchemas({
  200: Type.Object(
    {
      disease_name: Type.String({
        description: 'Name of the detected disease',
      }),
      disease_description: Type.String({
        description: 'Description of the disease',
      }),
      first_aid_description: Type.String({
        description: 'Description of the first aid treatment',
      }),
    },
    {
      description: 'Success. Prediction retrieved',
    }
  ),

  400: DefaultResponse400Schema,
  404: DefaultResponse404Schema,
  401: DefaultResponse401Schema,
});

type GetPredictionSchema = HandlerGeneric<{
  Headers: ObjectSchemaToType<typeof defaultHeaderSchema>;
  Body: ObjectSchemaToType<typeof getPredictionBodySchema>;
  Reply: ResponseSchema<typeof getPredictionResponseSchemas>;
}>;

export const getPredictionSchema = createSchema({
  description:
    'Get prediction from Vertex AI endpoint (Cannot be used in development environment)',
  tags: ['Prediction'],
  headers: defaultHeaderSchema,
  body: getPredictionBodySchema,
  response: getPredictionResponseSchemas,
});

export const getPrediction: CustomRouteHandler<GetPredictionSchema> =
  async function (req, res) {
    if (!constants.IS_PROD) {
      /**
       * Currently skip all operation
       */
      this.log.info(
        'Currently prediction are not available on development environment'
      );

      return res.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message:
          'Currently prediction are not available on development environment',
      });
    }

    /**
     * get base64 image
     */
    const base64Image = req.body.base64;

    /**
     * get project id
     */
    const projectId = await googleAuth
      .getProjectId()
      .then((s) => {
        this.log.info(`Project ID => ${s}`);

        return s;
      })
      .catch((err) => {
        this.log.error(err);
        this.log.error(`Failed when getting projectId.`);

        return undefined;
      });

    if (!projectId) {
      return res.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to do prediction',
      });
    }

    /**
     * get endpoint id and location
     */
    const endpointId = await secretManager
      .getSecretValue(constants.AI_ENDPOINT_ID!)
      .then((s) => {
        this.log.info(`Endpoint ID => ${s}`);

        return s;
      })
      .catch((err) => {
        this.log.error(`Failed when getting AI_ENDPOINT_ID`);
        this.log.error(err);

        return undefined;
      });

    if (!endpointId) {
      return res.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: `Failed to get prediction`,
      });
    }

    /**
     * Vertex AI endpoint located in asia-southeast1 (Singapore)
     */
    const endpointURL = `https://asia-southeast1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/asia-southeast1/endpoints/${endpointId}:predict`;

    /**
     * shoot POST request to endpoint
     */
    type PredictionPayload = {
      instances: { b64: string }[];
    };

    type PredictionResponse = {
      predictions: number[][];
      deployedModelId: string;
      model: string;
      modelDisplayName: string;
    };

    const fetched = await axios
      .post<any, AxiosResponse<PredictionResponse>, PredictionPayload>(
        endpointURL,
        {
          instances: [
            {
              b64: base64Image,
            },
          ],
        }
      )
      .then((v) => v.data.predictions)
      .catch((err) => {
        this.log.error(`Failed when POST request to endpoint ${endpointURL}`);
        this.log.error(err);
      });

    if (!fetched || fetched.length === 0) {
      return res.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: `Failed to get prediction`,
      });
    }

    const data = fetched[0];

    /**
     * get data with value of 1 from the array (only 1 will occur)
     */
    const classIndex = data.indexOf(1);

    if (classIndex === -1) {
      this.log.error(`No prediction`);

      return res.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: `Failed to get prediction`,
      });
    }

    const className = diseaseClassNames.at(classIndex);
    if (!className) {
      this.log.error(`No corresponding classname is found`);

      return res.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'No corresponding classname is found',
      });
    }

    this.log.info(`disease class name => ${className}`);

    /**
     * fetch data from database
     */
    const disease = await db.op.disease
      .findFirst({
        where: {
          diseaseName: className,
        },
      })
      .catch((err) => {
        this.log.error(`Failed when findFirst disease from database.`);
        this.log.error(err);

        return undefined;
      });

    if (!disease) {
      return res.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: `Disease data are not found.`,
      });
    }

    this.log.info(`fetched disease from DB => ${disease.diseaseName}`);

    return res.code(200).send({
      disease_name: disease.diseaseName,
      disease_description: disease.diseaseDescription,
      first_aid_description: disease.firstAidDescription,
    });
  };
