import type {
  FastifyReply as BaseFastifyReply,
  FastifyRequest as BaseFastifyRequest,
} from "fastify";

declare module "fastify" {
  interface FastifyReply {
    refreshJwtSign: BaseFastifyReply["jwtSign"];
  }

  interface FastifyRequest {
    refreshJwtVerify: BaseFastifyRequest["jwtVerify"];
    refreshJwtDecode: BaseFastifyRequest["jwtDecode"];
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    namespaces: "refresh";
  }
}
