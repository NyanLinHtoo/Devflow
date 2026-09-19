"use client";

import { Button } from "@/components/ui/button";
import { useUpdateTaskAssignee } from "@/hooks/useTasks";
import type { ProjectMember } from "@/types/projectMemberTypes";
import type { AssignedMember } from "@/types/taskTypes";
import { useState } from "react";

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
				<p className="text-sm">{assignedMember?.fullName ?? "Unassigned"}</p>
			</div>
		);
	}

	const handleSave = () => {
		updateTaskAssignee.mutate({
			taskId,
			data: {
				assignedMemberId: selectedMemberId,
			},
		});
	};

	return (
		<div>
			<label htmlFor="task-assignee" className="text-sm font-medium">
				Assignee
			</label>

			<div className="flex items-center gap-2">
				<select
					id="task-assignee"
					value={selectedMemberId ?? ""}
					onChange={(event) => {
						setSelectedMemberId(event.target.value || null);
					}}
					disabled={updateTaskAssignee.isPending}>
					<option value="">Unassigned</option>

					{members.map((member) => (
						<option key={member.id} value={member.id}>
							{member.fullName}
						</option>
					))}
				</select>

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

			{updateTaskAssignee.isError && (
				<p className="text-sm text-red-500">
					{updateTaskAssignee.error.message}
				</p>
			)}
		</div>
	);
}
