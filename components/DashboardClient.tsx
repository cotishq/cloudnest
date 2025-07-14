"use client";


import FileList from "@/components/FileList";
import DashboardLayout from "./layouts/DashboardLayout";



export default function DashboardClient({ userId }: {userId : string} ) {
  
  

  return (
    <DashboardLayout >
      <FileList userId={userId} view="all" />
    </DashboardLayout>
  );
}
