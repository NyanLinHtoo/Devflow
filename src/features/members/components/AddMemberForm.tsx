"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAddProjectMember } from "@/hooks/useProjectMembers";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { AddMemberFormData, addMemberSchema } from "../schemas";

const roleOptions = [
	{ value: "MEMBER", label: "Member" },
	{ value: "MANAGER", label: "Manager" },
];

type AddMemberFormProps = {
	projectId: string;
	onSuccess?: () => void;
	cancelTrigger?: ReactNode;
};

export default function AddMemberForm({
	projectId,
	onSuccess,
	cancelTrigger,
}: AddMemberFormProps) {
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<AddMemberFormData>({
		resolver: zodResolver(addMemberSchema),
		defaultValues: {
			email: "",
			role: "MEMBER",
		},
	});

	const addMember = useAddProjectMember(projectId);

	function onSubmit(data: AddMemberFormData) {
		addMember.mutate(data, {
			onSuccess: () => {
				reset({ email: "", role: "MEMBER" });
				onSuccess?.();
			},
		});
	}

	return (
		<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
			<FormField
				label="Email"
				htmlFor="member-email"
				error={errors.email?.message}>
				<Input
					id="member-email"
					type="email"
					placeholder="teammate@example.com"
					autoComplete="off"
					maxLength={254}
					{...register("email")}
				/>
			</FormField>

			<Controller
				control={control}
				name="role"
				render={({ field }) => (
					<FormField
						label="Role"
						htmlFor="member-role"
						error={errors.role?.message}>
						<Select
							id="member-role"
							value={field.value}
							onChange={field.onChange}
							options={roleOptions}
							placeholder="Select role"
						/>
					</FormField>
				)}
			/>

			<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
				{cancelTrigger}

				<Button
					type="submit"
					className="w-full sm:w-auto"
					disabled={addMember.isPending}>
					{addMember.isPending ? "Adding..." : "Add member"}
				</Button>
			</div>
		</form>
	);
}
