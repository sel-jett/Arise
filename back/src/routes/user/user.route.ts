import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

const userRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get('/', (req: FastifyRequest, reply: FastifyReply) => {
        reply.send({message: 'Arise'})
    })
    fastify.post('/register', () => {})
    fastify.post('/login', () => {})
    fastify.delete('/logout', () => {})
    fastify.get('/users', async () => {
        return fastify.db.findAllUsers();
    })
    fastify.log.info('user routes registred')
}