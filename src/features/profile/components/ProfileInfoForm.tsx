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
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const timezones = [
	{ value: "UTC", label: "UTC" },
	{ value: "Asia/Yangon", label: "Asia/Yangon (GMT+6:30)" },
	{ value: "Asia/Bangkok", label: "Asia/Bangkok (GMT+7)" },
	{ value: "Asia/Singapore", label: "Asia/Singapore (GMT+8)" },
	{ value: "Asia/Tokyo", label: "Asia/Tokyo (GMT+9)" },
	{ value: "Europe/London", label: "Europe/London" },
	{ value: "America/New_York", label: "America/New_York" },
];

const profileSchema = z.object({
	fullName: z
		.string()
		.min(2, "Full name must be at least 2 characters")
		.max(100, "Full name must be at most 100 characters"),
	timezone: z.string().optional(),
	bio: z.string().max(160, "Bio must be at most 160 characters").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type ProfileInfoFormProps = {
	user: CurrentUser;
};

export default function ProfileInfoForm({ user }: ProfileInfoFormProps) {
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			fullName: user.fullName,
			timezone: user.timezone ?? "",
			bio: user.bio ?? "",
		},
	});

	const updateProfile = useUpdateProfile();

	function onSubmit(data: ProfileFormData) {
		updateProfile.mutate(
			{
				fullName: data.fullName,
				timezone: data.timezone || null,
				bio: data.bio?.trim() ? data.bio : null,
			},
			{
				onSuccess: (updatedUser) => {
					reset({
						fullName: updatedUser.fullName,
						timezone: updatedUser.timezone ?? "",
						bio: updatedUser.bio ?? "",
					});
				},
			},
		);
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
						<Input id="fullName" type="text" {...register("fullName")} />
					</FormField>

					<FormField
						label="Email"
						htmlFor="email"
						helperText="Contact an admin to change your email.">
						<Input
							id="email"
							type="email"
							value={user.email}
							readOnly
							disabled
						/>
					</FormField>

					<FormField
						label="Account role"
						htmlFor="role"
						helperText="Only admins can change your role.">
						<Input
							id="role"
							type="text"
							value={roleLabels[user.role]}
							readOnly
							disabled
						/>
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
							<TextArea id="bio" rows={3} {...register("bio")} />
						</FormField>
					</div>
				</div>

				<div className="flex justify-end gap-3">
					<Button
						type="button"
						variant="secondary"
						onClick={() => reset()}
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
