"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import CreateProjectDialog from "@/features/projects/components/CreateProjectDialog";
import ProjectCard from "@/features/projects/components/ProjectCard";
import { useProjects } from "@/hooks/useProjects";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useState } from "react";

type ProjectFilter = "ALL" | "MANAGED" | "MEMBER";

const filters: { value: ProjectFilter; label: string }[] = [
	{ value: "ALL", label: "All" },
	{ value: "MANAGED", label: "Managed" },
	{ value: "MEMBER", label: "Member" },
];

export default function ProjectsPage() {
	const {
		data: user,
		isLoading: isAuthLoading,
		isError: isAuthError,
	} = useRequireAuth();
	const { data: projects, isLoading, isError } = useProjects();
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState<ProjectFilter>("ALL");

	if (isAuthLoading) {
		return (
			<Container>
				<LoadingState />
			</Container>
		);
	}

	if (isAuthError || !user) {
		return null;
	}

	const canCreate = user.role === "MANAGER";

	if (isLoading) {
		return (
			<Container>
				<LoadingState label="Loading projects..." />
			</Container>
		);
	}

	if (isError) {
		return (
			<Container>
				<ErrorState message="Failed to load projects." />
			</Container>
		);
	}

	const normalizedQuery = query.trim().toLowerCase();

	const filteredProjects = (projects ?? []).filter((project) => {
		const matchesQuery = project.name.toLowerCase().includes(normalizedQuery);
		const matchesFilter =
			filter === "ALL" ||
			(filter === "MANAGED" && project.currentUserRole === "MANAGER") ||
			(filter === "MEMBER" && project.currentUserRole === "MEMBER");

		return matchesQuery && matchesFilter;
	});

	return (
		<Container>
			<PageHeader
				title="Projects"
				description={
					canCreate
						? `${projects?.length ?? 0} projects`
						: "Only managers can create projects. Ask a manager to add you."
				}
				actions={canCreate ? <CreateProjectDialog /> : undefined}
			/>

			{projects && projects.length > 0 ? (
				<>
					<div className="mb-4 flex flex-wrap items-center gap-2">
						<Input
							type="search"
							placeholder="Search projects..."
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							className="max-w-xs"
						/>

						<div className="flex gap-2">
							{filters.map((item) => (
								<Button
									key={item.value}
									type="button"
									size="sm"
									variant={filter === item.value ? "primary" : "secondary"}
									onClick={() => setFilter(item.value)}>
									{item.label}
								</Button>
							))}
						</div>
					</div>

					{filteredProjects.length > 0 ? (
						<div className="grid gap-4 sm:grid-cols-2">
							{filteredProjects.map((project) => (
								<ProjectCard key={project.id} project={project} />
							))}
						</div>
					) : (
						<EmptyState>No projects match your search.</EmptyState>
					)}
				</>
			) : (
				<EmptyState>
					{canCreate
						? "No projects yet. Create your first project to get started."
						: "You are not a member of any project yet."}
				</EmptyState>
			)}
		</Container>
	);
}
