import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CreateUserIput, LoginUserInput } from "./user.schema"

export async function createUserHandler(
    request: FastifyRequest<{ Body: CreateUserIput }>,
    reply: FastifyReply
) {

    const Fastify = request.server;
    
    const {firstname, lastname, username, email, password} = request.body;
    const user = Fastify.db.findUserByEmail(email);
    
    if (user && user.mail_verified == 0) {
        try {
            const deletedUser = Fastify.db.deleteUser(user.id || 0);
        } catch(error) {
            console.log("Unverified user failed to be deleted")
            return reply.code(401).send({
                success: false,
                message: 'Unverified user failed to be deleted',
            })
        }
    } else if (user) {
        return reply.code(401).send({
            success: false,
            message: 'User already exists with this email',
        })
    }
    
    try {
        const user = Fastify.db.createUser({
                firstname: firstname,
                lastname: lastname,
                username: username,
                email: email,
                password: (await Fastify.bcrypt.hash(password)).toString(),
    });
        // const response = Fastify.db.findEmailOtp(email);
        // if (response.length === 0 || otp !== response[0].otp) {
        //     reply.code(400).send({
        //         success: false,
        //         message: 'The OTP is not valid',
        //     });
        // }
        // reply.code(201).send({
        //     id: 'will be abck for you',
        //     email,
        //     username
        // })
    } catch(error: any) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return reply.conflict('Email already exists');
          }
        throw error;
    }

}

export async function OtpSenderHandler(
    request: FastifyRequest<{ Body: CreateUserIput }>,
    reply: FastifyReply
) {

    const Fastify = request.server;
    
    const {email} = request.body;
    const user = Fastify.db.findUserByEmail(email);
    
    if (user && user.mail_verified == 0) {
        try {
            const deletedUser = Fastify.db.deleteUser(user.id || 0);
        } catch(error) {
            console.log("Unverified user failed to be deleted")
            return reply.code(401).send({
                success: false,
                message: 'Unverified user failed to be deleted',
            })
        }
    } else if (user) {
        return reply.code(401).send({
            success: false,
            message: 'User already exists with this email',
        })
    }
    
    try {
        const user = Fastify.db.createUser({
                firstname: firstname,
                lastname: lastname,
                username: username,
                email: email,
                password: (await Fastify.bcrypt.hash(password)).toString(),
    });
        // const response = Fastify.db.findEmailOtp(email);
        // if (response.length === 0 || otp !== response[0].otp) {
        //     reply.code(400).send({
        //         success: false,
        //         message: 'The OTP is not valid',
        //     });
        // }
        // reply.code(201).send({
        //     id: 'will be abck for you',
        //     email,
        //     username
        // })
    } catch(error: any) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return reply.conflict('Email already exists');
          }
        throw error;
    }

}

/**
 * Generates a 6-digit OTP with all different digits.
 * @returns A string containing 6 unique digits (0-9)
 */
function generateUniqueDigitOTP(): string {
    // Create an array of all possible digits
    const allDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    // Shuffle the array using Fisher-Yates algorithm
    for (let i = allDigits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allDigits[i], allDigits[j]] = [allDigits[j], allDigits[i]];
    }
    
    // Take the first 6 digits from the shuffled array
    const otp = allDigits.slice(0, 6).join('');
    
    return otp;
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
        username: user.username,
    }
    const token = Fastify.jwt.sign({ payload })

    reply.setCookie('access_token', token, {
        path: '/',
        httpOnly: true,
        secure: true,
    });
    return { accessToken: token}
}