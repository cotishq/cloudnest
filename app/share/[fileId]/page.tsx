
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";

export default async function SharePage({ params }: { params: { fileId: string } }) {
  const file = await db.file.findUnique({
    where: { id: params.fileId },
  });

  if (!file || !file.isPublic) return notFound();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-xl font-semibold mb-4">Shared File</h1>
      <p className="text-muted-foreground mb-2">{file.name}</p>
      <a
        href={file.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        Download
      </a>
      <Link href="/dashboard" className="text-xs mt-8 text-muted-foreground hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
