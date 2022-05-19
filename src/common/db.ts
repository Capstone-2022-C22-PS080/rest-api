import { PrismaClient } from '../generated/client';
import { dbURL } from './constants';

const db = new PrismaClient({
  datasources:
    process.env.NODE_ENV === 'development'
      ? undefined
      : {
          db: {
            url: dbURL,
          },
        },
});

export default db;
