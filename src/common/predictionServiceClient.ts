import { PredictionServiceClient } from '@google-cloud/aiplatform';
import constants from './constants';
import secretManager from './secretManager';

class PredictionService {
  private client: PredictionServiceClient;

  constructor() {
    this.client = new PredictionServiceClient();
    this.client.initialize();
  }

  async predictImageClassification(base64ImageString: string) {
    let endpointLocation: string | undefined = '';
    let endpointId: string | undefined = '';

    if (constants.IS_PROD) {
      endpointLocation = await secretManager.getSecretValue(
        constants.AI_ENDPOINT_LOCATION!
      );

      endpointId = await secretManager.getSecretValue(
        constants.AI_ENDPOINT_ID!
      );
    } else {
      endpointLocation = constants.AI_ENDPOINT_LOCATION!;
      endpointId = constants.AI_ENDPOINT_ID!;
    }

    const endpoint = `projects/${constants.GOOGLE_CLOUD_PROJECT}/locations/${endpointLocation}/endpoints/${endpointId}`;

    const [a, b, c] = await this.client.predict({
      instances: [
        {
          stringValue: base64ImageString,
        },
      ],
      endpoint,
    });

    console.log(JSON.stringify(a));

    return a.predictions?.indexOf({ numberValue: 1 });
  }
}

const predictionServiceClient = new PredictionService();

export default predictionServiceClient;
