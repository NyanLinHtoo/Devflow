import "fastify";
import type { FastifyJwtSignOptions } from "@fastify/jwt";
import type { FastifyRequest as BaseFastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      userId: string;
      email: string;
    };
  }
}

declare module "fastify" {
  interface FastifyReply {
    refreshJwtSign: (
      payload: {
        userId: string;
        sessionId: string;
      },
      options?: FastifyJwtSignOptions,
    ) => Promise<string>;
  }

  interface FastifyRequest {
    refreshJwtVerify: BaseFastifyRequest["jwtVerify"];
    refreshJwtDecode: BaseFastifyRequest["jwtDecode"];
  }
}
