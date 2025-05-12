import { Options } from 'swagger-jsdoc';
import path from 'path';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BabyZilla Billing API',
      version: '1.0.0',
      description: 'API docs for the BabyZilla Billing microservice',
    },
    servers: [{ url: 'http://localhost:4000', description: 'Local server' }],
  },
  apis: [path.resolve(__dirname, '../routes/*.ts'), path.resolve(__dirname, '../controllers/*.ts')],
};
