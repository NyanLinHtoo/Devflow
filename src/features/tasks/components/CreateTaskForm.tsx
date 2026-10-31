"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TextArea } from "@/components/ui/text-area";
import { taskPriorityOptions } from "@/features/tasks/taskLabels";
import { useCreateTask } from "@/hooks/useTasks";
import { dateToInputValue, inputValueToDate } from "@/lib/date";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { type CreateTaskFormData, createTaskSchema } from "../schemas";

type CreateTaskFormProps = {
	projectId: string;
	onSuccess?: () => void;
};

export default function CreateTaskForm({
	projectId,
	onSuccess,
}: CreateTaskFormProps) {
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<CreateTaskFormData>({
		resolver: zodResolver(createTaskSchema),
		defaultValues: {
			priority: "MEDIUM",
			dueDate: "",
		},
	});

	const createTaskMutation = useCreateTask(projectId);

	function onSubmit(data: CreateTaskFormData) {
		const taskData = {
			...data,
			description: data.description || undefined,
			dueDate: data.dueDate
				? new Date(`${data.dueDate}T00:00:00`).toISOString()
				: undefined,
		};

		createTaskMutation.mutate(taskData, {
			onSuccess: () => {
				reset();
				onSuccess?.();
			},
		});
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
							value={field.value}
							onChange={field.onChange}
							options={taskPriorityOptions}
							placeholder="Select priority"
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
				disabled={createTaskMutation.isPending}>
				{createTaskMutation.isPending ? "Creating task..." : "Create task"}
			</Button>
		</form>
	);
}
