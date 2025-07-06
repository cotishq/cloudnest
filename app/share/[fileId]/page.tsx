import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns";
import { Download } from "lucide-react"

export default async function SharePage({ params }: { params: { fileId: string } }) {
  const file = await db.file.findUnique({
    where: { id: params.fileId },
  })

  if (!file || !file.isPublic || file.isFolder) return notFound()

  const fileSizeKB = (file.size / 1024).toFixed(1)
  const isPreviewable = file.type?.startsWith("image/") || file.type === "application/pdf"

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background text-foreground">
      <div className="w-full max-w-md bg-muted/30 rounded-xl shadow-lg p-6 text-center space-y-4 border">
        <h1 className="text-2xl font-bold">📄 Shared File</h1>

        <div className="space-y-1">
          <p className="font-medium text-lg">{file.name}</p>
          <p className="text-muted-foreground text-sm">
            {file.type} · {fileSizeKB} KB · Uploaded {format(new Date(file.createdAt), "PPP")}
          </p>
        </div>

        {isPreviewable ? (
          <div className="w-full border rounded-lg overflow-hidden bg-white p-2 dark:bg-muted">
            <Image
              src={file.fileUrl}
              alt={file.name}
              width={600}
              height={400}
              className="object-contain max-h-[400px] mx-auto"
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No preview available for this file type</p>
        )}

        <a
          href={file.fileUrl}
          download={file.name}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition px-4 py-2 rounded-md text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Download
        </a>

        <Link href="/dashboard" className="text-xs text-muted-foreground hover:underline block mt-4">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  )
}
