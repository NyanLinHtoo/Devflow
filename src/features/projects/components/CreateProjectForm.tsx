"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useCreateProject } from "@/hooks/useProjects";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	CreateProjectFormData,
	createProjectSchema,
} from "../schemas/createProjectSchema";
import { TextArea } from "@/components/ui/text-area";

export default function CreateProjectForm({
	onSuccess,
}: {
	onSuccess?: () => void;
}) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateProjectFormData>({
		resolver: zodResolver(createProjectSchema),
	});

	const createProjectMutation = useCreateProject();

	function onSubmit(data: CreateProjectFormData) {
		createProjectMutation.mutate(data, {
			onSuccess: () => {
				reset();
				onSuccess?.();
			},
		});
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
				disabled={createProjectMutation.isPending}>
				{createProjectMutation.isPending
					? "Creating project..."
					: "Create project"}
			</Button>
		</form>
	);
}
