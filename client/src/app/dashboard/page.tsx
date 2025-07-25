import { getOverview } from "@/services/dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Calendar,
  Infinity,
  TrendingUp,
  Zap,
  Shield,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProcessChart } from "@/components/dashboard/process-chart";
import { PaymentsTable } from "@/components/dashboard/payments-table";

export default async function Page() {
  const overview = await getOverview();

  if (!overview.success) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">
            Failed to load overview
          </h2>
          <p className="text-muted-foreground">{overview.message}</p>
        </div>
      </div>
    );
  }

  const { data } = overview;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCredit = (credit: number | null) => {
    if (credit === null) {
      return <Infinity className="h-6 w-6 text-primary" />;
    }
    return credit.toLocaleString();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = () => {
    if (data.appKey.isSuspended || data.appKey.isManuallyDisabled)
      return "destructive";
    if (data.appKey.daysLeft !== null && data.appKey.daysLeft <= 7)
      return "secondary";
    return "default";
  };

  const getStatusText = () => {
    if (data.appKey.isSuspended) return "Suspended";
    if (data.appKey.isManuallyDisabled) return "Disabled";
    return "Active";
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Header with User Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">
            Monitor your usage, credits, and payment history
          </p>
        </div>
        <Card className="w-fit">
          <CardContent className="flex items-center gap-3 p-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://avatar.vercel.sh/${data.user.email}`}
                alt={data.user.name}
              />
              <AvatarFallback>{getInitials(data.user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium">{data.user.name}</span>
                {data.user.isVerified && (
                  <Shield className="h-4 w-4 text-green-500" />
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {data.user.email}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-3 md:grid-cols-5">
        {/* Total Processes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Processes
            </CardTitle>
            <div className="rounded-full bg-primary/10 p-1">
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.appKey.totalProcess.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time processes</p>
          </CardContent>
        </Card>

        {/* Today Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <div className="rounded-full bg-primary/10 p-1">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.appKey.todayUsage.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Processes today</p>
          </CardContent>
        </Card>

        {/* This Month Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <div className="rounded-full bg-primary/10 p-1">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.appKey.thisMonthUsage.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Monthly processes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">App Credits</CardTitle>
            <div className="rounded-full bg-primary/10 p-1">
              {data.appKey.creditRemaining === null ? (
                <Infinity className="h-4 w-4 text-primary" />
              ) : (
                <Zap className="h-4 w-4 text-primary" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCredit(data.appKey.creditRemaining)}
            </div>
            <div className="flex items-center pt-1">
              {data.appKey.creditRemaining === null ? (
                <p className="text-xs text-muted-foreground">
                  Subscription Plan (Unlimited)
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Credits remaining
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total Spent */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <div className="rounded-full bg-primary/10 p-1">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.payments.totalSpent)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="monthly">Monthly View</TabsTrigger>
          <TabsTrigger value="daily">Daily View</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {/* Monthly Process Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Processing Activity</CardTitle>
                <CardDescription>
                  Last 6 months processing volume
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ProcessChart
                  data={data.appKey.last6MonthProcess}
                  type="monthly"
                />
              </CardContent>
            </Card>

            {/* Recent Payments */}
            <PaymentsTable
              payments={data.payments.last5Payments}
              totalSpent={data.payments.totalSpent}
            />
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {/* Daily Process Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Processing Activity</CardTitle>
                <CardDescription>Last 7 days processing volume</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ProcessChart
                  data={data.appKey.last7DaysProcess}
                  type="daily"
                />
              </CardContent>
            </Card>

            {/* Recent Payments */}
            <PaymentsTable
              payments={data.payments.last5Payments}
              totalSpent={data.payments.totalSpent}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Plan Details */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Plan Information */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
            <CardDescription>
              Your current subscription information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Plan Type</span>
              <Badge variant="outline" className="capitalize">
                {data.appKey.planType}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Expires At</span>
              <span className="text-sm">
                {data.appKey.planType === "subscription"
                  ? data.appKey.expiresAt
                    ? formatDate(data.appKey.expiresAt)
                    : "N/A"
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Days Remaining</span>
              <div className="flex items-center gap-2">
                {data.appKey.daysLeft !== null &&
                  data.appKey.daysLeft <= 7 &&
                  data.appKey.planType === "subscription" && (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                <span className="text-sm font-medium">
                  {data.appKey.daysLeft ?? 365} days
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Status</span>
              <Badge variant={getStatusColor()}>{getStatusText()}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Account Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
            <CardDescription>Quick overview of your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Spent</span>
              <span className="text-sm font-bold">
                {formatCurrency(data.payments.totalSpent)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Login Methods</span>
              <div className="flex gap-1">
                {data.user.loginProvider.map((provider: string) => (
                  <Badge
                    key={provider}
                    variant="outline"
                    className="text-xs capitalize"
                  >
                    {provider}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Account Verified</span>
              <div className="flex items-center gap-1">
                {data.user.isVerified ? (
                  <>
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Verified</span>
                  </>
                ) : (
                  <span className="text-sm text-amber-600">Unverified</span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Last Payment</span>
              <span className="text-sm">
                {data.payments.last5Payments.length > 0
                  ? formatCurrency(data.payments.last5Payments[0].amount)
                  : "No payments yet"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
