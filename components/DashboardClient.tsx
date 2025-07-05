"use client";

import { useState } from "react";
import FileList from "@/components/FileList";
import FileUploadForm from "@/components/FileUploadForm";
import FolderDialog from "@/components/FolderDialog";
import DashboardLayout from "./layouts/DashboardLayout";



export default function DashboardClient({ userId }: {userId : string} ) {
  
  

  return (
    <DashboardLayout >
      <FileList userId={userId} />
    </DashboardLayout>
  );
}
