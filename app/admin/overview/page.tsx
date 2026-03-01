import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin overview page",
};

const AdminOverviewPage = async () => {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    throw new Error("User not authorized");
  }

  const summary = await getOrderSummary();

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalSales._sum.totalPrice?.toString() || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.ordersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.usersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.productsCount)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
