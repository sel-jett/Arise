import { FastifyPluginAsync } from 'fastify';
import { User } from '../types';

const userSchema = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' }
  }
};

const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/users/', async () => {
    return fastify.db.findAllUsers();
  });

  fastify.get<{ Params: { id: string } }>('/users/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', pattern: '^\\d+$' }
        }
      }
    }
  }, async (request, reply) => {
    try {
        const id = parseInt(request.params.id);
        console.log(`id : ${id}`);
        const user = fastify.db.findUserById(id);
        if (!user)
            return reply.code(404).send("User not found");
        return user;
    } catch (error: any) {
        request.log.error(`Error fetching User: ${error instanceof Error ? error.message : String(error)}`);
        return reply.code(500).send({
            error: "Internal server error occurred",
            statusCode: 500
        });
    }
  });

  fastify.post<{ Body: Omit<User, 'id' | 'createdAt'> }>('/users', {
    schema: {
      body: userSchema
    }
  }, async (request, reply) => {
    try {
      const user = fastify.db.createUser(request.body);
      return reply.code(201).send(user);
    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return reply.conflict('Email already exists');
      }
      throw error;
    }
  });

  fastify.put<{ Params: { id: string }, Body: Partial<User> }>('/users/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', pattern: '^\\d+$' }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' }
        },
        additionalProperties: false
      }
    }
  }, async (request, reply) => {
    const id = parseInt(request.params.id);
    const success = fastify.db.updateUser(id, request.body);
    
    if (!success) {
      return reply.notFound('User not found');
    }
    
    return { success: true, id };
  });

  fastify.delete<{ Params: { id: string } }>('/users/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', pattern: '^\\d+$' }
        }
      }
    }
  }, async (request, reply) => {
    const id = parseInt(request.params.id);
    const success = fastify.db.deleteUser(id);
    
    if (!success) {
      return reply.notFound('User not found');
    }
    
    return { success: true };
  });
};

export default userRoutes;