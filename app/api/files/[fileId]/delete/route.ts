import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { deleteFileFromImageKit, deleteFolderRecursively } from "@/lib/file-utils";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ fileId: string }> }
) {
  try {
    
    
    
    
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const  {fileId}  = await props.params;

    
    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }

    
    const file = await db.file.findFirst({
      where: { id: fileId, userId },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    
    if (file.isFolder) {
      await deleteFolderRecursively(fileId, userId);
    } else {
      await deleteFileFromImageKit(file.fileUrl);
      await db.file.delete({ where: { id: fileId } });
    }

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}