"use client"

import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FileUploadForm({
  userId,
  parentId,
  onUploadComplete,
}: {
  userId: string;
  parentId: string | null;
  onUploadComplete: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    if (parentId) formData.append("parentId", parentId);

    const res = await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      toast.success("File uploaded!");
      onUploadComplete();
      setFile(null);
    } else {
      toast.error("Upload failed.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <div
        onClick={openPicker}
        className={cn(
          "flex items-center gap-2 cursor-pointer border border-dashed px-4 py-2 rounded-md text-sm text-muted-foreground hover:border-primary transition"
        )}
      >
        <UploadCloud className="w-4 h-4" />
        {file ? file.name : "Select a file"}
      </div>

      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <Button onClick={handleUpload} className="h-8" disabled={!file}>
        Upload
      </Button>
    </div>
  );
}
