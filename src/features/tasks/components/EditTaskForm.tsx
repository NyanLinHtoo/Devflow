"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TextArea } from "@/components/ui/text-area";
import {
	taskPriorityOptions,
	taskStatusOptions,
} from "@/features/tasks/taskLabels";
import { useUpdateTask } from "@/hooks/useTasks";
import { dateToInputValue, inputValueToDate } from "@/lib/date";
import type { Task } from "@/types/taskTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
		control,
		reset,
		formState: { errors },
	} = useForm<UpdateTaskFormData>({
		resolver: zodResolver(updateTaskSchema),
		defaultValues: {
			title: task.title,
			description: task.description ?? "",
			priority: task.priority,
			dueDate: task.dueDate ? dateToInputValue(new Date(task.dueDate)) : "",
			status: task.status,
		},
	});

	const updateTaskMutation = useUpdateTask(projectId);

	function onSubmit(data: UpdateTaskFormData) {
		const taskData = {
			...data,
			description: data.description || null,
			dueDate: data.dueDate
				? new Date(`${data.dueDate}T00:00:00`).toISOString()
				: null,
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
						dueDate: updatedTask.dueDate
							? dateToInputValue(new Date(updatedTask.dueDate))
							: "",
						status: updatedTask.status,
					});
					onSuccess?.();
				},
			},
		);
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

			<Controller
				control={control}
				name="priority"
				render={({ field }) => (
					<FormField
						label="Priority"
						htmlFor="priority"
						error={errors.priority?.message}>
						<Select
							id="priority"
							value={field.value ?? null}
							onChange={field.onChange}
							options={taskPriorityOptions}
							placeholder="Select priority"
						/>
					</FormField>
				)}
			/>

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
							value={field.value ?? null}
							onChange={field.onChange}
							options={taskStatusOptions}
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
						label="Due Date"
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
				disabled={updateTaskMutation.isPending}>
				{updateTaskMutation.isPending ? "Updating task..." : "Update task"}
			</Button>
		</form>
	);
}
