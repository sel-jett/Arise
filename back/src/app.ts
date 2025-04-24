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
import websocket, { SocketStream } from '@fastify/websocket';

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

  app.register(fastifyJwt, {
    secret: 'supersecret'
  });

  app.register(fastifyCookie);

  app.register(dbPlugin);

  app.register(userRoutes, { prefix: '/api' });

  app.register(websocket);



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

  // this part is for the game 

  app.register(async function (app) {

    const gameRoom = {
      players: [] as SocketStream['socket'][],
      state: {
        ball: { x: 0, y: 0, dx: 1, dy: 1 },
        paddles: [{ y: 0 }, { y: 0 }]
      }
    };

    app.get('/ws', { websocket: true }, (socket, req) => {

      if (gameRoom.players.length >= 2) {
        socket.close();
        return;
      }

      const playerId = gameRoom.players.length;
      gameRoom.players.push(socket);

      socket.send(JSON.stringify({ type: 'player', index: playerId }));

      socket.on('message', rawMessage => {
        const message = JSON.parse(rawMessage.toString());

        if (message.type === 'paddle') {
          gameRoom.state.paddles[playerId].y = message.y;
        }

        socket.send(JSON.stringify({ type: 'ack', data: 'paddle received' }));
      });
    })
  })

  return app;
}