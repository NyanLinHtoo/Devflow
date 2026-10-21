"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TextArea } from "@/components/ui/text-area";
import {
	taskPriorityOptions,
	taskStatusOptions,
} from "@/features/tasks/taskLabels";
import { useUpdateTask } from "@/hooks/useTasks";
import type { Task } from "@/types/taskTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	type UpdateTaskFormData,
	updateTaskSchema,
} from "../schemas/updateTaskSchema";

type EditTaskFormProps = {
	task: Task;
	projectId: string;
	onSuccess?: () => void;
};

export default function EditTaskForm({
	task,
	projectId,
	onSuccess,
}: EditTaskFormProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UpdateTaskFormData>({
		resolver: zodResolver(updateTaskSchema),
		defaultValues: {
			title: task.title,
			description: task.description ?? "",
			priority: task.priority,
			dueDate: toDatetimeLocal(task.dueDate),
			status: task.status,
		},
	});

	const updateTaskMutation = useUpdateTask(projectId);

	function onSubmit(data: UpdateTaskFormData) {
		const taskData = {
			...data,
			description: data.description || null,
			dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
		};

		updateTaskMutation.mutate(
			{
				taskId: task.id,
				data: taskData,
			},
			{
				onSuccess: (updatedTask) => {
					reset({
						title: updatedTask.title,
						description: updatedTask.description ?? "",
						priority: updatedTask.priority,
						dueDate: toDatetimeLocal(updatedTask.dueDate),
						status: updatedTask.status,
					});
					onSuccess?.();
				},
			},
		);
	}

	function toDatetimeLocal(isoDate: string | null) {
		if (!isoDate) {
			return "";
		}

		const date = new Date(isoDate);
		const timezoneOffset = date.getTimezoneOffset() * 60_000;
		const localDate = new Date(date.getTime() - timezoneOffset);

		return localDate.toISOString().slice(0, 16);
	}

	return (
		<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
				<Select id="priority" {...register("priority")}>
					{taskPriorityOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</Select>
			</FormField>

			<FormField label="Status" htmlFor="status" error={errors.status?.message}>
				<Select id="status" {...register("status")}>
					{taskStatusOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</Select>
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
				disabled={updateTaskMutation.isPending}>
				{updateTaskMutation.isPending ? "Updating task..." : "Update task"}
			</Button>
		</form>
	);
}
