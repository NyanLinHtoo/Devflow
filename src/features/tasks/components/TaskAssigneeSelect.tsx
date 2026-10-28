"use client";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useUpdateTaskAssignee } from "@/hooks/useTasks";
import type { ProjectMember } from "@/types/projectMemberTypes";
import type { AssignedMember } from "@/types/taskTypes";
import { useState } from "react";

const UNASSIGNED = "unassigned";

type TaskAssigneeSelectProps = {
	projectId: string;
	taskId: string;
	assignedMember: AssignedMember | null;
	members: ProjectMember[];
	canAssign: boolean;
};

export default function TaskAssigneeSelect({
	projectId,
	taskId,
	assignedMember,
	members,
	canAssign,
}: TaskAssigneeSelectProps) {
	const [selectedMemberId, setSelectedMemberId] = useState<string | null>(
		assignedMember?.id ?? null,
	);

	const updateTaskAssignee = useUpdateTaskAssignee(projectId);

	if (!canAssign) {
		return (
			<div>
				<p className="text-sm font-medium">Assignee</p>
				<p className="text-sm text-muted-foreground">
					{assignedMember?.fullName ?? "Unassigned"}
				</p>
			</div>
		);
	}

	const options = [
		{ value: UNASSIGNED, label: "Unassigned" },
		...members.map((member) => ({
			value: member.id,
			label: member.fullName,
		})),
	];

	const handleSave = () => {
		updateTaskAssignee.mutate({
			taskId,
			data: { assignedMemberId: selectedMemberId },
		});
	};

	return (
		<div className="space-y-2">
			<label htmlFor="task-assignee" className="text-sm font-medium">
				Assignee
			</label>

			<div className="flex flex-wrap items-center gap-2">
				<Select
					id="task-assignee"
					className="w-full sm:w-64"
					value={selectedMemberId ?? UNASSIGNED}
					onChange={(value) =>
						setSelectedMemberId(value === UNASSIGNED ? null : value)
					}
					options={options}
					disabled={updateTaskAssignee.isPending}
				/>

				<Button
					type="button"
					onClick={handleSave}
					disabled={
						updateTaskAssignee.isPending ||
						selectedMemberId === (assignedMember?.id ?? null)
					}>
					{updateTaskAssignee.isPending ? "Saving..." : "Save"}
				</Button>
			</div>
		</div>
	);
}
