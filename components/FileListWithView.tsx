
'use client';

import { useSearchParams } from 'next/navigation';
import FileList from './FileList';
import type { File } from '@prisma/client';

interface FileListWithViewProps {
  userId: string;
  isDemo?: boolean;
  filestate?: File[];
}

export default function FileListWithView({
  userId,
  isDemo = false,
  filestate
}: FileListWithViewProps) {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'all';

  return (
    <FileList userId={userId} isDemo={isDemo} filestate={filestate} view={view} />
  );
}
