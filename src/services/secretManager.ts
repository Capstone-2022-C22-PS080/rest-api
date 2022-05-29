import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

class SecretManager {
  private client: SecretManagerServiceClient;

  constructor() {
    this.client = new SecretManagerServiceClient();
  }

  async getSecretValue(secretName: string, version: string = 'latest') {
    const projectId = await this.client.auth.getProjectId();

    const [vs] = await this.client.accessSecretVersion({
      name: `projects/${projectId}/secrets/${secretName}/versions/${version}`,
    });

    if (!vs.payload || !vs.payload.data) {
      throw new Error(`Secret ${secretName} is not exist.`);
    }

    if (vs.payload && vs.payload.data) {
      return vs.payload.data.toString();
    }
  }
}

const secretManager = new SecretManager();

export default secretManager;
