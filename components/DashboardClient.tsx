"use client";

import { useState } from "react";
import FileList from "@/components/FileList";
import FileUploadForm from "@/components/FileUploadForm";
import FolderDialog from "@/components/FolderDialog";

interface DashboardClientProps {
  userId: string;
}

export default function DashboardClient({ userId }: DashboardClientProps) {
  

  return (
    <div className="p-6">
      <h1>Welcome to your dashboard, user {userId}</h1>

      

      <FileList  userId={userId} />
    </div>
  );
}
