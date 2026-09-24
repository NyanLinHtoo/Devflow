INSERT INTO "ProjectMember" ("id", "projectId", "userId", "role")
SELECT
  gen_random_uuid(),
  p.id,
  p."ownerId",
  'MANAGER'::"ProjectRole"
FROM "Project" p
ON CONFLICT ("projectId", "userId")
DO UPDATE
SET "role" = EXCLUDED."role";