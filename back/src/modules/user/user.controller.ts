import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CreateUserIput, LoginUserInput } from "./user.schema"

export async function createUserHandler(
    request: FastifyRequest<{ Body: CreateUserIput }>,
    reply: FastifyReply
) {

    const Fastify = request.server;
    
    const {email, name, password} = request.body;
    const user = Fastify.db.findUserByEmail(email);
    if (user) {
        return reply.code(401).send({
            message: 'User already exists with this email',
        })
    }
    
    try {
        Fastify.bcrypt.hash('')
        const user = Fastify.db.createUser({
                name: name,
                email: email,
                password: (await Fastify.bcrypt.hash(password)).toString(),
    });
        reply.code(201).send({
            id: 'will be abck for you',
            email,
            name
        })
    } catch(error: any) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return reply.conflict('Email already exists');
          }
        throw error;
    }

}

export  function loginHandler(
    request: FastifyRequest<{Body: LoginUserInput }>,
    reply: FastifyReply
) {
    const Fastify = request.server;
    const { email, password } = request.body
    const user = Fastify.db.findUserByEmail(email);
    const isMatch = user && ( Fastify.bcrypt.compare(password, user.password))
    
    if (!isMatch) {
        return reply.code(401).send({
            message: 'invalid email or password',
        })
    }

    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
    }
    const token = Fastify.jwt.sign({ payload })

    reply.setCookie('access_token', token, {
        path: '/',
        httpOnly: true,
        secure: true,
    });
    return { accessToken: token}
}