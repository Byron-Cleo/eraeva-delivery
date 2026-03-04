import DeleteDialog from "@/components/shared/delete-dialog/delete-dialog";
import Pagination from "@/components/shared/pagination/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteUser, getAllUsers } from "@/lib/actions/user.actions";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Users",
  description: "Admin users page",
};

const AdminUsersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page = "1" } = await props.searchParams;
  const users = await getAllUsers({ page: Number(page) });
  
  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Users</h2>
      <div className="autoflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {formatId(user.id)}
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role === "user" ? (<Badge variant="secondary">User</Badge>) : (<Badge variant="default">Admin</Badge>)}</TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`/user/${user.id}`}
                      className="text-sm text-primary font-medium"
                    >
                      Details
                    </Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.totalPages > 1 && (
          <Pagination
            totalPages={users?.totalPages}
            page={Number(page) || 1}
            urlParamName="page"
          />
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
