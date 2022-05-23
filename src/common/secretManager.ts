import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import constants from './constants';

class SecretManager {
  private client: SecretManagerServiceClient;

  constructor() {
    this.client = new SecretManagerServiceClient();
  }

  async getSecretValue(secretName: string, version: string = 'latest') {
    const [vs] = await this.client.accessSecretVersion({
      name: `projects/${constants.GOOGLE_CLOUD_PROJECT}/secrets/${secretName}/versions/${version}`,
    });

    if (!vs.payload || !vs.payload.data) {
      throw new Error(`Secret ${secretName} is not exist.`);
    }

    if (vs.payload && vs.payload.data) {
      return vs.payload.data as string;
    }
  }
}

const secretManager = new SecretManager();

export default secretManager;
