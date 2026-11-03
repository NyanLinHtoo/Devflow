import { Card } from "@/components/ui/card";
import {
	LoadingRegion,
	Skeleton,
	SkeletonText,
} from "@/components/ui/skeleton";

function PageHeaderSkeleton({ actions = true }: { actions?: boolean }) {
	return (
		<div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
			<div className="min-w-0 lg:flex-1">
				<Skeleton className="h-8 w-48 max-w-full" />
				<Skeleton className="mt-2 h-4 w-72 max-w-full" />
			</div>

			{actions ? (
				<div className="flex flex-wrap gap-2">
					<Skeleton className="h-10 w-28" />
					<Skeleton className="h-10 w-32" />
				</div>
			) : null}
		</div>
	);
}

function StatGridSkeleton() {
	return (
		<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{Array.from({ length: 4 }).map((_, index) => (
				<Card key={index}>
					<div className="flex items-center gap-2">
						<Skeleton className="size-4 rounded-full" />
						<Skeleton className="h-3 w-20" />
					</div>
					<Skeleton className="mt-2 h-7 w-12" />
					<Skeleton className="mt-2 h-3 w-24" />
				</Card>
			))}
		</div>
	);
}

function ProjectCardSkeleton() {
	return (
		<Card className="h-full">
			<div className="flex items-start justify-between gap-2">
				<Skeleton className="h-5 w-2/3" />
				<Skeleton className="h-5 w-14 rounded-full" />
			</div>

			<SkeletonText lines={2} className="mt-3" />

			<Skeleton className="mt-4 h-1.5 w-full rounded-full" />

			<div className="mt-2 flex items-center justify-between">
				<Skeleton className="h-3 w-20" />
				<Skeleton className="h-3 w-10" />
			</div>

			<div className="mt-4 flex items-center justify-between">
				<div className="flex -space-x-1.5">
					<Skeleton className="size-6 rounded-full" />
					<Skeleton className="size-6 rounded-full" />
					<Skeleton className="size-6 rounded-full" />
				</div>
				<Skeleton className="h-5 w-20 rounded-full" />
			</div>
		</Card>
	);
}

function ProjectGridSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			{Array.from({ length: count }).map((_, index) => (
				<ProjectCardSkeleton key={index} />
			))}
		</div>
	);
}

function TaskCardSkeleton() {
	return (
		<Card>
			<div className="flex items-start justify-between gap-3">
				<Skeleton className="h-5 w-1/2" />
				<Skeleton className="h-4 w-12" />
			</div>

			<SkeletonText lines={2} className="mt-3" />

			<div className="mt-3 flex flex-wrap gap-3">
				<Skeleton className="h-3 w-16" />
				<Skeleton className="h-3 w-24" />
				<Skeleton className="h-3 w-28" />
			</div>
		</Card>
	);
}

function ListRowsSkeleton({
	rows = 4,
	avatar = false,
	dense = false,
}: {
	rows?: number;
	avatar?: boolean;
	dense?: boolean;
}) {
	return (
		<ul className="divide-y divide-border">
			{Array.from({ length: rows }).map((_, index) => (
				<li
					key={index}
					className={`flex items-center gap-3 ${dense ? "px-4 py-3" : "p-4"}`}>
					{avatar ? (
						<Skeleton className="size-9 shrink-0 rounded-full" />
					) : null}

					<div className="min-w-0 flex-1">
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="mt-2 h-3 w-2/3" />
					</div>

					<Skeleton className="h-6 w-16 shrink-0 rounded-full" />
				</li>
			))}
		</ul>
	);
}

function FormSkeleton({
	fields = 3,
	title = false,
}: {
	fields?: number;
	title?: boolean;
}) {
	return (
		<Card>
			{title ? <Skeleton className="h-5 w-32" /> : null}

			<div className={title ? "mt-4 space-y-4" : "space-y-4"}>
				{Array.from({ length: fields }).map((_, index) => (
					<div key={index}>
						<Skeleton className="h-3 w-20" />
						<Skeleton className="mt-2 h-10 w-full" />
					</div>
				))}

				<Skeleton className="h-10 w-32" />
			</div>
		</Card>
	);
}

export function DashboardSkeleton() {
	return (
		<LoadingRegion label="Loading dashboard">
			<PageHeaderSkeleton />
			<StatGridSkeleton />

			<div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
				<Card className="min-w-0 p-4">
					<div className="mb-4 flex items-center justify-between gap-4">
						<Skeleton className="h-5 w-36" />
						<Skeleton className="h-4 w-16" />
					</div>

					<ProjectGridSkeleton count={4} />
				</Card>

				<Card className="min-w-0 p-4">
					<div className="mb-3 flex items-center justify-between gap-4">
						<Skeleton className="h-5 w-24" />
					</div>

					<ListRowsSkeleton rows={4} dense />
				</Card>
			</div>
		</LoadingRegion>
	);
}

export function ProjectsSkeleton() {
	return (
		<LoadingRegion label="Loading projects">
			<PageHeaderSkeleton />

			<div className="mb-4 flex flex-wrap items-center gap-2">
				<Skeleton className="h-10 w-full max-w-xs" />

				<div className="flex gap-2">
					<Skeleton className="h-8 w-14" />
					<Skeleton className="h-8 w-20" />
					<Skeleton className="h-8 w-18" />
				</div>
			</div>

			<ProjectGridSkeleton />
		</LoadingRegion>
	);
}

export function TasksSkeleton() {
	return (
		<LoadingRegion label="Loading tasks">
			<PageHeaderSkeleton />

			<div className="mb-4 flex flex-wrap gap-2">
				<Skeleton className="h-8 w-14" />
				<Skeleton className="h-8 w-16" />
				<Skeleton className="h-8 w-12" />
			</div>

			<Card className="p-0">
				<ListRowsSkeleton rows={6} dense />
			</Card>
		</LoadingRegion>
	);
}

export function ProjectDetailSkeleton() {
	return (
		<LoadingRegion label="Loading project">
			<Skeleton className="h-4 w-28" />

			<div className="mt-4">
				<PageHeaderSkeleton />
			</div>

			<div className="mb-8">
				<div className="mb-4 flex flex-wrap items-center justify-between gap-4">
					<Skeleton className="h-5 w-24" />
					<Skeleton className="h-8 w-28" />
				</div>

				<Card className="p-0">
					<ListRowsSkeleton rows={3} avatar dense />
				</Card>
			</div>

			<div className="mb-4 flex flex-wrap items-center justify-between gap-4">
				<Skeleton className="h-5 w-16" />
				<Skeleton className="h-8 w-28" />
			</div>

			<TaskGridSkeleton rows={3} />
		</LoadingRegion>
	);
}

export function TaskGridSkeleton({ rows = 3 }: { rows?: number }) {
	return (
		<LoadingRegion label="Loading tasks" className="grid gap-4">
			{Array.from({ length: rows }).map((_, index) => (
				<TaskCardSkeleton key={index} />
			))}
		</LoadingRegion>
	);
}

export function TaskDetailSkeleton() {
	return (
		<LoadingRegion label="Loading task">
			<Skeleton className="h-4 w-24" />

			<div className="mt-4">
				<PageHeaderSkeleton />
			</div>

			<Card className="mb-6">
				<div className="grid gap-4 sm:grid-cols-2">
					{Array.from({ length: 4 }).map((_, index) => (
						<div key={index}>
							<Skeleton className="h-3 w-16" />
							<Skeleton className="mt-2 h-4 w-32" />
						</div>
					))}

					<div className="sm:col-span-2">
						<Skeleton className="h-3 w-20" />
						<SkeletonText lines={3} className="mt-2" />
					</div>
				</div>
			</Card>

			<Card>
				<Skeleton className="h-4 w-40" />
				<Skeleton className="mt-3 h-10 w-full max-w-xs" />
			</Card>
		</LoadingRegion>
	);
}

export function ProfileSkeleton() {
	return (
		<LoadingRegion label="Loading profile">
			<div>
				<Skeleton className="h-28 w-full rounded-lg" />

				<div className="relative z-10 -mt-9 flex flex-wrap items-end gap-4 px-5">
					<Skeleton className="size-19.5 shrink-0 rounded-full ring-4 ring-surface" />

					<div className="min-w-0 flex-1 pb-1">
						<Skeleton className="h-7 w-48 max-w-full" />

						<div className="mt-2 flex flex-wrap items-center gap-2">
							<Skeleton className="h-4 w-36" />
							<Skeleton className="h-5 w-16 rounded-full" />
							<Skeleton className="h-4 w-24" />
						</div>
					</div>

					<div className="flex flex-wrap gap-2 pb-1">
						<Skeleton className="h-10 w-24" />
						<Skeleton className="h-10 w-28" />
					</div>
				</div>
			</div>

			<div className="mt-6 grid gap-6 lg:grid-cols-[196px_minmax(0,1fr)]">
				<div className="hidden lg:block">
					<div className="space-y-1">
						<Skeleton className="h-9 w-full" />
						<Skeleton className="h-9 w-full" />
						<Skeleton className="h-9 w-full" />
					</div>
				</div>

				<div className="space-y-6">
					<FormSkeleton fields={2} title />
					<FormSkeleton fields={2} title />

					<Card className="border-danger/30 bg-danger-surface">
						<Skeleton className="h-5 w-32" />
						<SkeletonText lines={2} className="mt-2" />
						<Skeleton className="mt-4 h-10 w-32" />
					</Card>
				</div>
			</div>
		</LoadingRegion>
	);
}

export function AdminUsersSkeleton() {
	return (
		<LoadingRegion label="Loading users">
			<PageHeaderSkeleton />

			<div className="mb-4 flex flex-wrap items-end gap-3">
				<div className="w-full max-w-xs">
					<Skeleton className="h-3 w-14" />
					<Skeleton className="mt-2 h-10 w-full" />
				</div>

				<div className="w-full max-w-48">
					<Skeleton className="h-3 w-10" />
					<Skeleton className="mt-2 h-10 w-full" />
				</div>
			</div>

			<Card className="overflow-x-auto p-0">
				<table className="w-full min-w-180">
					<thead className="border-b border-border">
						<tr>
							{Array.from({ length: 6 }).map((_, index) => (
								<th key={index} className="px-4 py-3">
									<Skeleton className="h-3 w-16" />
								</th>
							))}
						</tr>
					</thead>

					<tbody className="divide-y divide-border">
						{Array.from({ length: 8 }).map((_, row) => (
							<tr key={row}>
								<td className="px-4 py-3">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="mt-2 h-3 w-44" />
								</td>

								{Array.from({ length: 5 }).map((_, cell) => (
									<td key={cell} className="px-4 py-3">
										<Skeleton className="h-4 w-16" />
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</Card>
		</LoadingRegion>
	);
}

export function MemberListSkeleton() {
	return (
		<LoadingRegion label="Loading members">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-4">
				<Skeleton className="h-5 w-24" />
				<Skeleton className="h-8 w-28" />
			</div>

			<Card className="p-0">
				<ListRowsSkeleton rows={3} avatar dense />
			</Card>
		</LoadingRegion>
	);
}

export function ResetPasswordSkeleton() {
	return (
		<LoadingRegion label="Loading reset form">
			<div className="space-y-5">
				<div>
					<Skeleton className="h-4 w-24" />
					<Skeleton className="mt-2 h-10 w-full" />
				</div>

				<div>
					<Skeleton className="h-4 w-32" />
					<Skeleton className="mt-2 h-10 w-full" />
				</div>

				<Skeleton className="h-10 w-full" />
			</div>
		</LoadingRegion>
	);
}
