

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import FileList from "@/components/FileList";
import FileUploadForm from "@/components/FileUploadForm";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser;

  if (!userId) {
    redirect("/signin");
  }

  return <div className="p-6">
    <h1>Welcome to your dashboard, user {userId}</h1>
    <FileList userId = {userId} />
    <FileUploadForm userId={userId} />
  </div>;


}
