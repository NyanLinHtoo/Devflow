"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TextArea } from "@/components/ui/text-area";
import { projectStatusOptions } from "@/features/projects/projectLabels";
import { useUpdateProject } from "@/hooks/useProjects";
import { dateToInputValue, inputValueToDate } from "@/lib/date";
import type { Project } from "@/types/projectTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { UpdateProjectFormData, updateProjectSchema } from "../schemas";

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
		control,
		formState: { errors },
	} = useForm<UpdateProjectFormData>({
		resolver: zodResolver(updateProjectSchema),
		defaultValues: {
			name: project.name,
			description: project.description ?? "",
			status: project.status,
			dueDate: project.dueDate
				? dateToInputValue(new Date(project.dueDate))
				: "",
		},
	});

	const updateProjectMutation = useUpdateProject();

	function onSubmit(data: UpdateProjectFormData) {
		updateProjectMutation.mutate(
			{
				projectId: project.id,
				name: data.name,
				description: data.description?.trim() ? data.description : null,
				status: data.status,
				dueDate: data.dueDate
					? new Date(`${data.dueDate}T00:00:00`).toISOString()
					: null,
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

			<Controller
				control={control}
				name="status"
				render={({ field }) => (
					<FormField
						label="Status"
						htmlFor="status"
						error={errors.status?.message}>
						<Select
							id="status"
							value={field.value}
							onChange={field.onChange}
							options={projectStatusOptions}
							placeholder="Select status"
						/>
					</FormField>
				)}
			/>

			<Controller
				control={control}
				name="dueDate"
				render={({ field }) => (
					<FormField
						label="Due date"
						htmlFor="dueDate"
						error={errors.dueDate?.message}>
						<DatePicker
							id="dueDate"
							value={inputValueToDate(field.value)}
							onChange={(date) =>
								field.onChange(date ? dateToInputValue(date) : "")
							}
						/>
					</FormField>
				)}
			/>

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
