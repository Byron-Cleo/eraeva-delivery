import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/actions/user.actions";
import UserUpdateForm from "./update-user-form";

export const metadata: Metadata = {
  title: "Update User",
  description: "Admin update user page",
};

const AdminUserUpdatePage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;
  const user = await getUserById(id);
  if (!user) notFound();
  return <div className="space-y-8 max-w-lg mx-auto">
    <h1 className="h2-bold">Update User</h1>
    <UserUpdateForm user={user}/>
    {/* <UserUpdateForm user={user} type="Update"/> */}
  </div>;
};

export default AdminUserUpdatePage;
