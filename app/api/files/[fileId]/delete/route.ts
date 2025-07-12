import { db } from "@/lib/db";
import { deleteFileFromImageKit, deleteFolderRecursively } from "@/lib/file-utils";
import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";


const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

export async function DELETE(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fileId = params.fileId;
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
