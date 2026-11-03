import { Card } from "@/components/ui/card";
import ChangeRoleDialog from "@/features/admin/components/ChangeRoleDialog";
import RoleBadge from "@/features/admin/components/RoleBadge";
import type { AdminUser } from "@/types/adminTypes";

export default function AdminUserTable({ users }: { users: AdminUser[] }) {
	return (
		<Card className="overflow-x-auto p-0">
			<table className="w-full min-w-180 text-left text-sm">
				<thead className="border-b border-border text-xs uppercase text-muted-foreground">
					<tr>
						<th scope="col" className="px-4 py-3 font-medium">
							User
						</th>
						<th scope="col" className="px-4 py-3 font-medium">
							Verified
						</th>
						<th scope="col" className="px-4 py-3 font-medium">
							Role
						</th>
						<th scope="col" className="px-4 py-3 font-medium">
							Projects
						</th>
						<th scope="col" className="px-4 py-3 font-medium">
							Joined
						</th>
						<th scope="col" className="px-4 py-3 text-right font-medium">
							Actions
						</th>
					</tr>
				</thead>

				<tbody className="divide-y divide-border">
					{users.map((user) => (
						<tr key={user.id}>
							<td className="px-4 py-3">
								<p className="font-medium">{user.fullName}</p>
								<p className="text-muted-foreground">{user.email}</p>
							</td>

							<td className="px-4 py-3 text-muted-foreground">
								{user.emailVerifiedAt ? "Verified" : "Unverified"}
							</td>

							<td className="px-4 py-3">
								<RoleBadge role={user.role} />
							</td>

							<td className="px-4 py-3 text-muted-foreground">
								{user.projectCount}
							</td>

							<td className="px-4 py-3 text-muted-foreground">
								{new Date(user.createdAt).toLocaleDateString()}
							</td>

							<td className="px-4 py-3 text-right">
								<ChangeRoleDialog user={user} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</Card>
	);
}
