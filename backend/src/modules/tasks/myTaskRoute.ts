import type { FastifyInstance } from "fastify";
import { getMyTasks } from "./taskService.js";

export function myTaskRoutes(app: FastifyInstance) {
  app.get("/mine", async (request, reply) => {
    const tasks = await getMyTasks(request.user.userId);

    return reply.code(200).send(tasks);
  });
}
