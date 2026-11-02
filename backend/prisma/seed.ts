import "dotenv/config";
import * as argon2 from "argon2";
import prisma from "../src/lib/prisma.js";

type ProjectStatus = "PLANNING" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED";
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
type ProjectRole = "MANAGER" | "MEMBER";

type SeedTask = {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueInDays: number | null;
  assigneeEmail?: string;
};

type SeedProject = {
  name: string;
  description: string;
  status: ProjectStatus;
  dueInDays: number | null;
  members: { email: string; role: ProjectRole }[];
  tasks: SeedTask[];
};

const DUMMY_PASSWORD = "Password123!";

const dummyUsers = [
  {
    fullName: "Aung Aung",
    email: "aung@example.com",
    timezone: "Asia/Yangon",
    bio: "Backend engineer. Keeps auth and data flows tidy.",
  },
  {
    fullName: "Su Su",
    email: "su@example.com",
    timezone: "Asia/Yangon",
    bio: "Frontend engineer focused on accessible interfaces.",
  },
  {
    fullName: "Thiri Thiri",
    email: "thiri@example.com",
    timezone: "Asia/Bangkok",
    bio: "Product designer. Turns rough ideas into clear screens.",
  },
  {
    fullName: "Min Min",
    email: "min@example.com",
    timezone: "Asia/Singapore",
    bio: "Mobile engineer working on the shared task experience.",
  },
  {
    fullName: "Khin Khin",
    email: "khin@example.com",
    timezone: "Asia/Yangon",
    bio: "QA and release support. Finds the edge cases early.",
  },
];

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function main() {
  const shouldReset =
    process.argv.includes("--reset") || process.env.SEED_RESET === "true";
  const ownerEmail = process.env.SEED_OWNER_EMAIL;

  let owner = ownerEmail
    ? await prisma.user.findUnique({ where: { email: ownerEmail } })
    : null;

  if (!owner && !ownerEmail) {
    const userCount = await prisma.user.count();

    if (userCount === 1) {
      owner = await prisma.user.findFirst();
    } else {
      throw new Error(
        "Multiple users exist. Set SEED_OWNER_EMAIL to the account that should own the seeded projects.",
      );
    }
  }

  if (!owner) {
    throw new Error(
      "No user found. Register an account first, then run the seed again.",
    );
  }

  await prisma.user.update({
    where: { id: owner.id },
    data: { role: "ADMIN" },
  });

  const ownerProjects = await prisma.project.findMany({
    where: { projectMembers: { some: { userId: owner.id } } },
    select: { id: true },
  });

  if (!shouldReset && ownerProjects.length > 0) {
    console.error(
      `Found ${ownerProjects.length} project(s) for ${owner.email}. Re-run with --reset to remove them and reseed.`,
    );
    process.exitCode = 1;
    return;
  }

  if (shouldReset && ownerProjects.length > 0) {
    const projectIds = ownerProjects.map((project) => project.id);

    await prisma.task.deleteMany({
      where: { projectId: { in: projectIds } },
    });

    await prisma.project.deleteMany({
      where: { id: { in: projectIds } },
    });

    console.log(
      `Removed ${ownerProjects.length} project(s) and their tasks for ${owner.email}.`,
    );
  }

  const passwordHash = await argon2.hash(DUMMY_PASSWORD);
  const usersByEmail = new Map<string, { id: string }>();

  usersByEmail.set(owner.email, { id: owner.id });

  for (const user of dummyUsers) {
    const seededUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        fullName: user.fullName,
        role: "MEMBER",
        emailVerifiedAt: new Date(),
        passwordHash,
        acceptedTerms: true,
        timezone: user.timezone,
        bio: user.bio,
      },
      create: {
        fullName: user.fullName,
        email: user.email,
        role: "MEMBER",
        emailVerifiedAt: new Date(),
        passwordHash,
        acceptedTerms: true,
        timezone: user.timezone,
        bio: user.bio,
      },
    });

    usersByEmail.set(seededUser.email, { id: seededUser.id });
  }

  const projects: SeedProject[] = [
    {
      name: "Project 01",
      description: "Q4 platform cleanup — auth, members, and task flow.",
      status: "IN_PROGRESS",
      dueInDays: 6,
      members: [
        { email: owner.email, role: "MANAGER" },
        { email: "aung@example.com", role: "MEMBER" },
        { email: "su@example.com", role: "MEMBER" },
        { email: "thiri@example.com", role: "MEMBER" },
      ],
      tasks: [
        {
          title: "Fix project deletion redirect",
          description: "Navigate away before the detail query refetches.",
          status: "IN_PROGRESS",
          priority: "HIGH",
          dueInDays: 1,
          assigneeEmail: "aung@example.com",
        },
        {
          title: "Server-side auth review",
          description: "Check cookie settings, rotation, and error handling.",
          status: "TODO",
          priority: "HIGH",
          dueInDays: 4,
          assigneeEmail: owner.email,
        },
        {
          title: "Member role selector",
          description: "Let managers change a member role safely.",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          dueInDays: 2,
          assigneeEmail: "thiri@example.com",
        },
        {
          title: "Dashboard layout",
          description: "Stats, recent projects, and upcoming tasks.",
          status: "DONE",
          priority: "MEDIUM",
          dueInDays: -3,
          assigneeEmail: "su@example.com",
        },
        {
          title: "Dark mode tokens",
          description: "Class-based tokens and a manual toggle.",
          status: "DONE",
          priority: "LOW",
          dueInDays: -5,
          assigneeEmail: owner.email,
        },
        {
          title: "Task card assignee",
          description: "Show the assignee or an unassigned label.",
          status: "DONE",
          priority: "LOW",
          dueInDays: -1,
          assigneeEmail: "aung@example.com",
        },
      ],
    },
    {
      name: "Website Revamp",
      description: "Marketing site refresh — landing, pricing, and docs.",
      status: "IN_REVIEW",
      dueInDays: 9,
      members: [
        { email: owner.email, role: "MANAGER" },
        { email: "thiri@example.com", role: "MEMBER" },
        { email: "su@example.com", role: "MEMBER" },
      ],
      tasks: [
        {
          title: "Landing hero refresh",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          dueInDays: 3,
          assigneeEmail: "thiri@example.com",
        },
        {
          title: "Pricing page copy",
          status: "TODO",
          priority: "LOW",
          dueInDays: 7,
          assigneeEmail: "su@example.com",
        },
        {
          title: "Docs navigation",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          dueInDays: 5,
          assigneeEmail: owner.email,
        },
        {
          title: "SEO metadata",
          status: "DONE",
          priority: "LOW",
          dueInDays: -2,
          assigneeEmail: "su@example.com",
        },
        {
          title: "Accessibility audit",
          status: "TODO",
          priority: "HIGH",
          dueInDays: 5,
          assigneeEmail: "thiri@example.com",
        },
      ],
    },
    {
      name: "Mobile App",
      description: "iOS + Android shell with shared task views.",
      status: "PLANNING",
      dueInDays: 25,
      members: [
        { email: owner.email, role: "MANAGER" },
        { email: "min@example.com", role: "MEMBER" },
        { email: "khin@example.com", role: "MEMBER" },
      ],
      tasks: [
        {
          title: "Mobile nav shell",
          status: "TODO",
          priority: "MEDIUM",
          dueInDays: 12,
          assigneeEmail: "min@example.com",
        },
        {
          title: "Shared task views",
          status: "TODO",
          priority: "HIGH",
          dueInDays: 18,
          assigneeEmail: "khin@example.com",
        },
        {
          title: "Push notifications spike",
          status: "TODO",
          priority: "LOW",
          dueInDays: 20,
          assigneeEmail: "min@example.com",
        },
        {
          title: "Project setup",
          status: "DONE",
          priority: "MEDIUM",
          dueInDays: -4,
          assigneeEmail: owner.email,
        },
      ],
    },
    {
      name: "Design System",
      description: "Tokens, primitives, and usage docs.",
      status: "IN_PROGRESS",
      dueInDays: 2,
      members: [
        { email: owner.email, role: "MANAGER" },
        { email: "thiri@example.com", role: "MEMBER" },
      ],
      tasks: [
        {
          title: "Design tokens audit",
          status: "IN_PROGRESS",
          priority: "LOW",
          dueInDays: 1,
          assigneeEmail: owner.email,
        },
        {
          title: "Button primitives",
          status: "DONE",
          priority: "MEDIUM",
          dueInDays: -6,
          assigneeEmail: "thiri@example.com",
        },
        {
          title: "Form field a11y",
          status: "IN_PROGRESS",
          priority: "HIGH",
          dueInDays: 2,
          assigneeEmail: "thiri@example.com",
        },
        {
          title: "Toast redesign",
          status: "DONE",
          priority: "MEDIUM",
          dueInDays: -1,
          assigneeEmail: owner.email,
        },
      ],
    },
    {
      name: "Billing",
      description: "Subscription plans, invoices, and receipts.",
      status: "IN_PROGRESS",
      dueInDays: -2,
      members: [
        { email: owner.email, role: "MANAGER" },
        { email: "aung@example.com", role: "MEMBER" },
        { email: "min@example.com", role: "MEMBER" },
      ],
      tasks: [
        {
          title: "Webhook retries",
          status: "TODO",
          priority: "HIGH",
          dueInDays: -1,
          assigneeEmail: "aung@example.com",
        },
        {
          title: "Invoice PDF",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          dueInDays: 2,
          assigneeEmail: "min@example.com",
        },
        {
          title: "Plan upgrade flow",
          status: "TODO",
          priority: "HIGH",
          dueInDays: -3,
          assigneeEmail: owner.email,
        },
        {
          title: "Receipts email",
          status: "DONE",
          priority: "LOW",
          dueInDays: -7,
          assigneeEmail: "aung@example.com",
        },
      ],
    },
    {
      name: "API v2",
      description: "Public endpoints, rate limits, and docs.",
      status: "PLANNING",
      dueInDays: null,
      members: [
        { email: owner.email, role: "MANAGER" },
        { email: "khin@example.com", role: "MEMBER" },
      ],
      tasks: [
        {
          title: "Pagination",
          status: "TODO",
          priority: "LOW",
          dueInDays: 14,
          assigneeEmail: "khin@example.com",
        },
        {
          title: "Rate limiting",
          status: "TODO",
          priority: "MEDIUM",
          dueInDays: 21,
          assigneeEmail: owner.email,
        },
        {
          title: "OpenAPI docs",
          status: "TODO",
          priority: "LOW",
          dueInDays: 28,
          assigneeEmail: "khin@example.com",
        },
        {
          title: "Auth scopes",
          status: "DONE",
          priority: "HIGH",
          dueInDays: -10,
          assigneeEmail: owner.email,
        },
      ],
    },
  ];

  for (const seedProject of projects) {
    const project = await prisma.project.create({
      data: {
        name: seedProject.name,
        description: seedProject.description,
        status: seedProject.status,
        dueDate:
          seedProject.dueInDays === null
            ? null
            : daysFromNow(seedProject.dueInDays),
      },
    });

    const memberIdsByEmail = new Map<string, string>();

    for (const member of seedProject.members) {
      const user = usersByEmail.get(member.email);

      if (!user) {
        throw new Error(`Seed member not found: ${member.email}`);
      }

      const projectMember = await prisma.projectMember.create({
        data: {
          projectId: project.id,
          userId: user.id,
          role: member.role,
        },
      });

      memberIdsByEmail.set(member.email, projectMember.id);
    }

    for (const seedTask of seedProject.tasks) {
      await prisma.task.create({
        data: {
          projectId: project.id,
          title: seedTask.title,
          description: seedTask.description ?? null,
          status: seedTask.status,
          priority: seedTask.priority,
          dueDate:
            seedTask.dueInDays === null
              ? null
              : daysFromNow(seedTask.dueInDays),
          assignedMemberId: seedTask.assigneeEmail
            ? (memberIdsByEmail.get(seedTask.assigneeEmail) ?? null)
            : null,
        },
      });
    }
  }

  const [projectCount, taskCount] = await Promise.all([
    prisma.project.count(),
    prisma.task.count(),
  ]);

  console.log(`Seeded ${projects.length} projects and ${taskCount} tasks.`);
  console.log(`Owner: ${owner.email} (ADMIN)`);
  console.log(`Dummy users password: ${DUMMY_PASSWORD}`);
  console.log(
    `Database now has ${projectCount} projects and ${taskCount} tasks.`,
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
