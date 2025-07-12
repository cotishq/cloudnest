import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { db } from "@/lib/db";
import ImageKit from "imagekit";


function getImageKit() {
  return new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
  });
}

export async function deleteFileFromImageKit(fileUrl?: string) {
  if (!fileUrl) return;

  try {
    const cleanUrl = fileUrl.split("?")[0];
    const imagekitFileId = cleanUrl.split("/").pop();

    if (imagekitFileId) {
      const imagekit = getImageKit();
      await imagekit.deleteFile(imagekitFileId);
    }
  } catch (err) {
    console.error("ImageKit deletion failed:", err);
  }
}

export async function deleteFolderRecursively(folderId: string, userId: string) {
  const children = await db.file.findMany({
    where: { parentId: folderId, userId },
  });

  for (const child of children) {
    if (child.isFolder) {
      await deleteFolderRecursively(child.id, userId);
    } else {
      await deleteFileFromImageKit(child.fileUrl);
      await db.file.delete({ where: { id: child.id } });
    }
  }

  await db.file.delete({ where: { id: folderId } });
}
