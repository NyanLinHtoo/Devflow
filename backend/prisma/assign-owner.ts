import "dotenv/config";
import prisma from "../src/lib/prisma.js";

async function main() {
  const email = process.env.SEED_OWNER_EMAIL;

  if (!email) {
    throw new Error(
      "Set SEED_OWNER_EMAIL to the account that should manage the seeded projects.",
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  if (!user) {
    throw new Error(`No user found with email ${email}`);
  }

  const projects = await prisma.project.findMany({
    select: { id: true, name: true },
  });

  for (const project of projects) {
    await prisma.projectMember.upsert({
      where: {
        projectId_userId: {
          projectId: project.id,
          userId: user.id,
        },
      },
      update: { role: "MANAGER" },
      create: {
        projectId: project.id,
        userId: user.id,
        role: "MANAGER",
      },
    });
  }

  console.log(
    `Added ${user.email} as MANAGER to ${projects.length} project(s).`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
