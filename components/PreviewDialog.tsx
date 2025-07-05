"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

type Props = {
  fileName: string;
  fileUrl: string;
  type: string;
};

export default function PreviewDialog({ fileName, fileUrl, type }: Props) {
  const [open, setOpen] = useState(false);

  const isImage = type.startsWith("image");
  const isPDF = type === "application/pdf";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="link"
        className="text-blue-600 underline"
        onClick={() => setOpen(true)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Preview: {fileName}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 max-h-[70vh] overflow-auto rounded border p-2 bg-muted/30">
          {isImage ? (
            <img
              src={fileUrl}
              alt={fileName}
              className="max-w-full max-h-[60vh] mx-auto rounded shadow"
            />
          ) : isPDF ? (
            <iframe
              src={fileUrl}
              className="w-full h-[60vh] rounded"
              title={fileName}
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Preview not supported for this file type.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
