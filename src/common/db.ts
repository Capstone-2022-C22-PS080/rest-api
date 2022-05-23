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
        console.info(`Already connected`);
      }

      // in production
      else {
        const dbUser = await secretManager.getSecretValue(
          constants.DATABASE_USER!
        );

        console.info(`db user: ${dbUser}`);

        const dbPassword = await secretManager.getSecretValue(
          constants.DATABASE_PASSWORD!
        );

        console.info(`db password: ${dbPassword}`);

        const dbAddress = await secretManager.getSecretValue(
          constants.DATABASE_ADDRESS!
        );

        console.info(`db address: ${dbAddress}`);

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

      assert(
        this.client instanceof PrismaClient,
        'DB.connect: It seems database client has not instantiated'
      );

      return this.client;
    } catch (e) {
      console.error(`Error connecting to database : ${e}`);
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
    assert(
      this.client instanceof PrismaClient,
      'DB.op: It seems database client has not instantiated'
    );

    return this.client;
  }
}

const db = new DB();

export default db;
