import "dotenv/config";
import prisma from "../src/lib/prisma.js";

async function main() {
  const email = process.argv[2] ?? process.env.ADMIN_EMAIL;

  if (!email) {
    throw new Error("Usage: npm run make-admin -- user@example.com");
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    throw new Error(`No user found with email ${email}`);
  }

  if (user.role === "ADMIN") {
    console.log(`${user.email} is already an admin.`);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN" },
  });

  console.log(`${user.email} is now an admin.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
