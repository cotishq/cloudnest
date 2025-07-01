import DashboardClient from "@/components/DashboardClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/signIn");
  }

  return <DashboardClient userId={userId} />;
}
