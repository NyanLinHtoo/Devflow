"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TextArea } from "@/components/ui/textArea";
import { useCreateTask } from "@/hooks/useTasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	type CreateTaskFormData,
	createTaskSchema,
} from "../schemas/createTaskSchema";

export default function CreateTaskForm({ projectId }: { projectId: string }) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateTaskFormData>({
		resolver: zodResolver(createTaskSchema),
		defaultValues: {
			priority: "MEDIUM",
		},
	});

	const createTaskMutation = useCreateTask(projectId);

	function onSubmit(data: CreateTaskFormData) {
		const taskData = {
			...data,
			description: data.description || undefined,
			dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
		};

		createTaskMutation.mutate(taskData, {
			onSuccess: () => {
				reset();
			},
		});
	}

	return (
		<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
			{createTaskMutation.error instanceof Error && (
				<p className="text-sm text-red-600">
					{createTaskMutation.error.message}
				</p>
			)}
			<FormField
				label="Task title"
				htmlFor="title"
				error={errors.title?.message}>
				<Input
					id="title"
					type="text"
					placeholder="Enter your task title"
					{...register("title")}
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

			<FormField
				label="Priority"
				htmlFor="priority"
				error={errors.priority?.message}>
				<Select id="priority" {...register("priority")} />
			</FormField>

			<FormField
				label="Due Date"
				htmlFor="dueDate"
				error={errors.dueDate?.message}>
				<Input id="dueDate" type="datetime-local" {...register("dueDate")} />
			</FormField>

			<Button
				type="submit"
				className="w-full"
				disabled={createTaskMutation.isPending}>
				{createTaskMutation.isPending ? "Creating task..." : "Create task"}
			</Button>
		</form>
	);
}
