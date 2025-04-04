import fastify, { FastifyInstance } from 'fastify';
import sensible from '@fastify/sensible';
import cors from '@fastify/cors';
import dbPlugin from './plugins/database';
import userRoutes from './routes/users';
import { request } from 'http';

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty'
      }
    }
  });

  app.register(sensible);
  app.register(cors, {
    origin: true
  });

  app.register(dbPlugin);

  app.register(userRoutes, { prefix: '/api' });

  app.get('/', async (request, reply) => {
    return { message: 'Welcome to the Fastify TypeScript API with SQLite' };
  });

  app.setNotFoundHandler((request, reply) => {
    reply.notFound(`Route ${request.method}:${request.url} not found`);
  })

  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    
    if (error.validation) {
      return reply.badRequest(`Validation Error: ${error.message}`);
    }
    
    reply.internalServerError('Something went wrong');
  });

  return app;
}