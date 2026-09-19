import { apiFetch } from "@/lib/api";
import type { ProjectMember } from "@/types/projectMemberTypes";
import { useQuery } from "@tanstack/react-query";

export function useProjectMembers(projectId: string) {
	return useQuery({
		queryKey: ["projects", projectId, "members"],
		queryFn: () => apiFetch<ProjectMember[]>(`/projects/${projectId}/members`),
		enabled: Boolean(projectId),
	});
}
