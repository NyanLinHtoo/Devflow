"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TextArea } from "@/components/ui/text-area";
import { useUpdateProfile } from "@/hooks/useProfile";
import { roleLabels } from "@/lib/roles";
import type { CurrentUser } from "@/types/authTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { type ProfileFormData, profileSchema } from "../schemas";

const timezones = [
	{ value: "UTC", label: "UTC" },
	{ value: "Asia/Yangon", label: "Asia/Yangon (GMT+6:30)" },
	{ value: "Asia/Bangkok", label: "Asia/Bangkok (GMT+7)" },
	{ value: "Asia/Singapore", label: "Asia/Singapore (GMT+8)" },
	{ value: "Asia/Tokyo", label: "Asia/Tokyo (GMT+9)" },
	{ value: "Europe/London", label: "Europe/London" },
	{ value: "America/New_York", label: "America/New_York" },
];

type ProfileInfoFormProps = {
	user: CurrentUser;
};

export default function ProfileInfoForm({ user }: ProfileInfoFormProps) {
	const formValues = useMemo(
		() => ({
			fullName: user.fullName,
			timezone: user.timezone ?? "",
			bio: user.bio ?? "",
		}),
		[user.fullName, user.timezone, user.bio],
	);

	const {
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: formValues,
	});

	useEffect(() => {
		reset(formValues);
	}, [formValues, reset]);

	const updateProfile = useUpdateProfile();

	function onSubmit(data: ProfileFormData) {
		updateProfile.mutate({
			fullName: data.fullName,
			timezone: data.timezone || null,
			bio: data.bio?.trim() ? data.bio : null,
		});
	}

	return (
		<section
			id="profile-info"
			className="scroll-mt-6 rounded-lg border border-border bg-surface p-4">
			<div className="mb-4">
				<h2 className="text-lg font-medium">Profile information</h2>
				<p className="text-sm text-muted-foreground">
					How you appear to your team.
				</p>
			</div>

			<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
				<div className="grid gap-4 sm:grid-cols-2">
					<FormField
						label="Full name"
						htmlFor="fullName"
						error={errors.fullName?.message}>
						<Controller
							control={control}
							name="fullName"
							render={({ field }) => (
								<Input
									id="fullName"
									type="text"
									name={field.name}
									maxLength={30}
									value={field.value}
									onChange={field.onChange}
									onBlur={field.onBlur}
								/>
							)}
						/>
					</FormField>

					<FormField label="Email" htmlFor="email">
						<div className="flex h-10 items-center justify-between gap-2 rounded-md border border-dashed border-border bg-surface-muted px-3 text-sm">
							<span className="truncate text-muted-foreground">
								{user.email}
							</span>
							<span className="shrink-0 rounded-full bg-success-surface px-2 py-0.5 text-xs font-medium text-success">
								Verified
							</span>
						</div>
					</FormField>

					<FormField label="Account role" htmlFor="role">
						<div className="flex h-10 items-center justify-between gap-2 rounded-md border border-dashed border-border bg-surface-muted px-3 text-sm">
							<span className="truncate text-muted-foreground">
								{roleLabels[user.role]}
							</span>
							<span className="shrink-0 rounded-full border border-border bg-surface px-2 py-0.5 text-xs font-medium text-muted-foreground">
								Managed by admin
							</span>
						</div>
					</FormField>

					<Controller
						control={control}
						name="timezone"
						render={({ field }) => (
							<FormField
								label="Timezone"
								htmlFor="timezone"
								error={errors.timezone?.message}>
								<Select
									id="timezone"
									value={field.value || null}
									onChange={field.onChange}
									options={timezones}
									placeholder="Select timezone"
								/>
							</FormField>
						)}
					/>

					<div className="sm:col-span-2">
						<FormField
							label="Bio"
							htmlFor="bio"
							error={errors.bio?.message}
							helperText="Shown on your profile. Max 160 characters.">
							<Controller
								control={control}
								name="bio"
								render={({ field }) => (
									<TextArea
										id="bio"
										rows={3}
										maxLength={160}
										name={field.name}
										value={field.value ?? ""}
										onChange={field.onChange}
										onBlur={field.onBlur}
									/>
								)}
							/>
						</FormField>
					</div>
				</div>

				<div className="flex justify-end gap-3">
					<Button
						type="button"
						variant="secondary"
						onClick={() => reset(formValues)}
						disabled={updateProfile.isPending}>
						Cancel
					</Button>

					<Button type="submit" disabled={updateProfile.isPending}>
						{updateProfile.isPending ? "Saving..." : "Save changes"}
					</Button>
				</div>
			</form>
		</section>
	);
}
