import type { FastifyInstance } from "fastify";
import { getDashboardSummary } from "./dashboardService.js";

export function dashboardRoutes(app: FastifyInstance) {
  app.get("/summary", async (request, reply) => {
    const summary = await getDashboardSummary(request.user.userId);

    return reply.code(200).send(summary);
  });
}
