"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textArea";
import { useUpdateProject } from "@/hooks/useProjects";
import type { Project } from "@/types/projectTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	UpdateProjectFormData,
	updateProjectSchema,
} from "../schemas/updateProjectSchema";

type EditProjectFormProps = {
	project: Project;
	onSuccess?: () => void;
};

export default function EditProjectForm({
	project,
	onSuccess,
}: EditProjectFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdateProjectFormData>({
		resolver: zodResolver(updateProjectSchema),
		defaultValues: {
			name: project.name,
			description: project.description ?? "",
		},
	});

	const updateProjectMutation = useUpdateProject();

	function onSubmit(data: UpdateProjectFormData) {
		updateProjectMutation.mutate(
			{
				projectId: project.id,
				name: data.name,
				description: data.description?.trim() ? data.description : null,
			},
			{
				onSuccess: () => {
					onSuccess?.();
				},
			},
		);
	}

	return (
		<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
			<FormField
				label="Project name"
				htmlFor="name"
				error={errors.name?.message}>
				<Input
					id="name"
					type="text"
					placeholder="Enter your project name"
					{...register("name")}
				/>
			</FormField>

			<FormField
				label="Description"
				htmlFor="description"
				error={errors.description?.message}>
				<TextArea
					id="description"
					placeholder="Project description"
					{...register("description")}
				/>
			</FormField>

			<Button
				type="submit"
				className="w-full"
				disabled={updateProjectMutation.isPending}>
				{updateProjectMutation.isPending
					? "Updating project..."
					: "Update project"}
			</Button>
		</form>
	);
}
