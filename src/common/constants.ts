const constants = {
  IS_PROD: process.env.NODE_ENV === 'production',
  GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_ADDRESS: process.env.DATABASE_ADDRESS,
  AI_ENDPOINT_LOCATION: process.env.AI_ENDPOINT_LOCATION,
  AI_ENDPOINT_ID: process.env.AI_ENDPOINT_ID,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 8080,
};

export default constants;
