import { PrismaClient } from '@prisma/client';
import assert from 'assert';
import constants from './constants';
import secretManager from './secretManager';

class DB {
  private client?: PrismaClient;

  constructor() {
    this.client = constants.IS_PROD ? undefined : new PrismaClient();
  }

  async connect() {
    try {
      // in development
      if (!constants.IS_PROD || this.client) {
        console.log(`Already connected`);
      }

      // in production
      else {
        const dbUser = await secretManager.getSecretValue(
          constants.DATABASE_USER!
        );

        const dbPassword = await secretManager.getSecretValue(
          constants.DATABASE_PASSWORD!
        );

        const dbAddress = await secretManager.getSecretValue(
          constants.DATABASE_ADDRESS!
        );

        const url = this.buildConnectionString(
          dbUser!,
          dbPassword!,
          dbAddress!
        );

        this.client = new PrismaClient({
          datasources: {
            db: {
              url,
            },
          },
        });

        console.log(`Connected !`);
      }

      assert(this.client instanceof PrismaClient);

      return this.client;
    } catch (e) {
      throw new Error('Error on connecting to database');
    }
  }

  private buildConnectionString(
    dbUser: string,
    dbPassword: string,
    dbAddress: string,
    port: string = '5432'
  ) {
    return `postgres://${dbUser}:${dbPassword}@${dbAddress}:${port}`;
  }

  get op() {
    assert(this.client instanceof PrismaClient);

    return this.client;
  }
}

const db = new DB();

export default db;
