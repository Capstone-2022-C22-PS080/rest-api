import app from './app';
import db from './common/db';

const startServer = async () => {
  /**
   * Connect db client to database
   */
  await db
    .connect()
    .then(() => {
      /**
       * if it is OK then start server
       */
      app.ready();
    })
    .catch((e) => {
      /**
       * print errors
       */
      console.error(e);
    });
};

startServer();
