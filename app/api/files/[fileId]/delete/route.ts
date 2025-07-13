import { db } from "@/lib/db";
import { deleteFileFromImageKit, deleteFolderRecursively } from "@/lib/file-utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";




export async function DELETE(
  context: { params: { fileId: string },
  req: NextRequest
   }
) {
  try {
    const {fileId} = context.params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
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

    return NextResponse.json({
      success: true,
      message: "Item permanently deleted",
    });
  } catch (error) {
    console.error("Error while deleting:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
