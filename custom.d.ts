declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';

    /**
     * these should be corresponding to app.yaml's env_variables object
     */
    DATABASE_USER?: string;
    DATABASE_PASSWORD?: string;
    DATABASE_ADDRESS?: string;
    AI_ENDPOINT_LOCATION?: string;
    AI_ENDPOINT_ID?: string;
    JWT_SECRET?: string;

    /**
     * set after deployed to app engine
     */
    GOOGLE_CLOUD_PROJECT?: string;
  }
}
