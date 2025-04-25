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

    function getAvailablePlayerId(players: { id: number, socket: WebSocket }[]): number {
      const taken = players.map(p => p.id);
      return taken.includes(0) ? 1 : 0;
    }

    const gameRoom = {
      players: [] as { id: number, socket: SocketStream['socket'] }[],

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

      const playerId = getAvailablePlayerId(gameRoom.players);
      gameRoom.players.push({ id: playerId, socket });

      socket.send(JSON.stringify({ type: 'player', index: playerId }));


      socket.on('message', (msg) => {
        console.log('Received message from client:', msg.toString());

        try {
          const message = JSON.parse(msg.toString());
          if (message.type === 'paddle') {
            console.log(`Updating paddle for player ${playerId} to y=${message.y}`);
            gameRoom.state.paddles[playerId].y = message.y;
          }
        } catch (err) {
          console.error('Invalid message:', msg.toString());
        }
      });


      if (gameRoom.players.length === 2) {

        gameRoom.players.forEach((player) => {
          player.socket.send(JSON.stringify({
            type: 'start',
          }));
        });
      }

      if (gameRoom.players.length === 2) {
        let score = [0, 0];
        const canvasWidth = 1000;
        const canvasHeight = 600;
        const paddleHeight = 100;
        const paddleWidth = 10;
        const leftPaddleX = 20;
        const rightPaddleX = 970;
        const ballRadius = 10;

        gameRoom.state.ball = {
          x: canvasWidth / 2,
          y: canvasHeight / 2,
          dx: Math.random() > 0.5 ? 4 : -4,
          dy: Math.random() > 0.5 ? 3 : -3
        };

        const interval = setInterval(() => {
          const ball = gameRoom.state.ball;
          const paddles = gameRoom.state.paddles;

          ball.x += ball.dx;
          ball.y += ball.dy;

          if (ball.y <= 0 || ball.y >= canvasHeight) {
            ball.dy *= -1;
          }

          if (
            ball.x - ballRadius <= leftPaddleX + paddleWidth &&
            ball.y >= paddles[0].y &&
            ball.y <= paddles[0].y + paddleHeight
          ) {
            ball.dx *= -1;
          }

          if (
            ball.x + ballRadius >= rightPaddleX &&
            ball.y >= paddles[1].y &&
            ball.y <= paddles[1].y + paddleHeight
          ) {
            ball.dx *= -1;
          }

          if (ball.x < 0) {
            score[1]++;
            resetBall(ball);
          } else if (ball.x > canvasWidth) {
            score[0]++;
            resetBall(ball);
          }

          const gameState = {
            type: 'state',
            ball: { x: ball.x, y: ball.y },
            paddles: [
              { y: paddles[0].y },
              { y: paddles[1].y }
            ],
            score
          };

          for (const player of gameRoom.players) {
            player.socket.send(JSON.stringify(gameState));
          }

        }, 1000 / 60); // 60 FPS

        const resetBall = (ball: typeof gameRoom.state.ball) => {
          ball.x = canvasWidth / 2;
          ball.y = canvasHeight / 2;
          ball.dx = Math.random() > 0.5 ? 4 : -4;
          ball.dy = Math.random() > 0.5 ? 3 : -3;
        };

        for (const player of gameRoom.players) {
          player.socket.on('close', () => {
            clearInterval(interval);
          });
        }
      }

      socket.on('close', () => {
        gameRoom.players = gameRoom.players.filter(p => p.socket !== socket);
      });

    })
  })

  return app;
}