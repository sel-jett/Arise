import fastify, { FastifyInstance } from 'fastify';
import sensible from '@fastify/sensible';
import cors from '@fastify/cors';
import dbPlugin from './plugins/database';
import userRoutes from './modules/user/user.route';
import { request } from 'http';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
// import fastifyBcrypt from 'fastify-bcrypt-plugin';
import fastifyBcrypt from 'fastify-bcrypt';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import websocket, { SocketStream } from '@fastify/websocket'; // olamrabt
import { WebSocket } from 'ws';


export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty'
      }
    }
  });

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.register(sensible);

  app.register(cors, {
    origin: "*"
  });


  app.register(fastifyBcrypt, {
    saltWorkFactor: 12
  });
  // added this 
  app.register(websocket);

  app.register(fastifyJwt, {
    secret: 'supersecret'
  });

  app.register(fastifyCookie);

  app.register(dbPlugin);

  app.register(userRoutes, { prefix: '/api' });


  let clients: WebSocket[] = [];


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


  app.get('/ws', { websocket: true }, (connection: SocketStream, _req) => {
    const socket = connection.socket;
    clients.push(socket);

    socket.on('message', (message: Buffer) => {
      clients.forEach(client => {
        if (client !== socket) {
          client.send(message);
        }
      });
    });

    socket.on('close', () => {
      clients = clients.filter(c => c !== socket);
    });


    return {
      message: "signaling is working",
      connectedClients: clients.length
    };
  });

  return app;
}