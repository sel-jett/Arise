import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema
} from './user.schema'

import { createUserHandler, loginHandler } from './user.controller'

const userRoutes = async (fastify: FastifyInstance) => {
    
    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: 'POST',
        url: '/login',
        schema: {
            body: loginSchema,
            response: {
                200: loginResponseSchema
            }
        },
        handler: loginHandler
    });
    
    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: 'POST',
        url: '/register',
        schema: {
            body: createUserSchema,
            response: {
                200: createUserResponseSchema
            }
        },
        handler: createUserHandler
    });


    fastify.route({
        method: 'GET',
        url: '/users',
        handler: fastify.db.findAllUsers
    })
    // fastify.get('/', (req: FastifyRequest, reply: FastifyReply) => {
    //     return { message: 'Welcome to the Fastify TypeScript API with SQLite' };
    // })
    // fastify.post('/register', () => {})
    // fastify.post('/login', () => {})
    // fastify.delete('/logout', () => {})
    // fastify.get('/users', async () => {
    //     return fastify.db.findAllUsers();
    // })
    // // fastify.get('/users/:id', (Params: {id: string}) => {})
    fastify.log.info('user routes registred')
}
export default userRoutes;
