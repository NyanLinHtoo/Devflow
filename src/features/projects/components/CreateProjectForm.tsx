"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/text-area";
import { useCreateProject } from "@/hooks/useProjects";
import { dateToInputValue, inputValueToDate } from "@/lib/date";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CreateProjectFormData, createProjectSchema } from "../schemas";

export default function CreateProjectForm({
	onSuccess,
}: {
	onSuccess?: () => void;
}) {
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<CreateProjectFormData>({
		resolver: zodResolver(createProjectSchema),
		defaultValues: {
			dueDate: "",
		},
	});

	const createProjectMutation = useCreateProject();

	function onSubmit(data: CreateProjectFormData) {
		createProjectMutation.mutate(
			{
				name: data.name,
				description: data.description || undefined,
				dueDate: data.dueDate
					? new Date(`${data.dueDate}T00:00:00`).toISOString()
					: undefined,
			},
			{
				onSuccess: () => {
					reset();
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

			<p className="text-sm text-muted-foreground">
				New projects start in Planning. You can change the status after creating
				it.
			</p>

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
