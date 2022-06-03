# SSkin REST API

[![Deploy to App Engine](https://github.com/Capstone-2022-C22-PS080/rest-api/actions/workflows/deploy_app_engine.yml/badge.svg)](https://github.com/Capstone-2022-C22-PS080/rest-api/actions/workflows/deploy_app_engine.yml)

## API Documentation

[Click Here](https://testing-purpose-349114.et.r.appspot.com/docs)

## Tech Stack Used

- [NodeJS 16](https://nodejs.org/)
- [Fastify REST framework](https://www.fastify.io/)
- [Swagger API doc generator](https://swagger.io/)
- [Prisma ORM](https://www.prisma.io/) used alongside [PostgreSQL](https://www.postgresql.org/)
- [Firebase Admin](https://github.com/firebase/firebase-admin-node)

## Steps To Replicate

- Prerequisites

  1. A GCP project.
  2. Enabled App Engine API
  3. A PostgreSQL database instance. Can be Cloud SQL or just ordinary dockerized PostgresSQL running on VM.
  4. Deployed model to Vertex AI
  5. Secret Manager that holds environment variables contained in app.yaml
  6. Firebase Project
  7. Default App Engine Service Account keys (.json) with permission to use Vertex AI and Secret Accessor, and Firebase admin.

 <br />

- Development Environment

  1. Install NodeJS 16 in your system
  2. Fork this repository
  3. Clone the forked repository
  4. In the root project directory, run the following command in your terminal

  ```sh
  npm i
  ```

- Production Environment

  1. Open Cloud Shell in your GCP Console
  2. Clone the forked repository
  3. Run the following command

  ```sh
  gcloud app deploy
  ```
