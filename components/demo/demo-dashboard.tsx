"use client";

import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { File } from "@prisma/client";
import Link from "next/link";
import FileListWithView from "../FileListWithView";

export const DemoDashboard = () => {
  useEffect(() => {
    toast.info("You're viewing a live demo. Sign up to use CloudNest.");
  }, []);

  
  const demoFiles: File[] = useMemo(() => [
    {
      id: "file_1",
      name: "Resume.pdf",
      isFolder: false,
      fileUrl: "#",
      isTrash: false,
      isStarred: true,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "demo",
      parentId: null,
      path: "/",
      size: 1024,
      thumbnailUrl: null,
      type: "file",
    },
    {
      id: "folder_1",
      name: "Project Files",
      isFolder: true,
      fileUrl: "",
      isTrash: false,
      isStarred: false,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "demo",
      parentId: null,
      path: "/",
      size: 0,
      thumbnailUrl: null,
      type: "folder",
    },
  ], []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Demo Dashboard</h1>
        <Link href="/sign-up">
          <Button variant="outline">Sign Up</Button>
        </Link>
      </div>

      <FileListWithView userId="demo" isDemo filestate={demoFiles} />
    </div>
  );
};