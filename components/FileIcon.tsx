import { 
  Archive, 
  FileText, 
  Image, 
  Music, 
  Video, 
  File as GenericFile,
  FileSpreadsheet,
  BookOpen
} from "lucide-react";

interface FileIconProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function FileIcon({ type, size = 'md', className = '' }: FileIconProps) {
  
  const normalizedType = type.toLowerCase().trim();
  
  
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  
  const baseClasses = `${sizeClasses[size]} ${className}`;
  
 
  if (normalizedType.startsWith('image/')) {
    return <Image className={`${baseClasses} text-blue-500`} />;
  }
  
  
  if (normalizedType.startsWith('video/')) {
    return <Video className={`${baseClasses} text-purple-500`} />;
  }
  
  
  if (normalizedType.startsWith('audio/')) {
    return <Music className={`${baseClasses} text-pink-500`} />;
  }
  
  
  if (normalizedType === 'application/pdf') {
    return <FileText className={`${baseClasses} text-red-500`} />;
  }
  
  
  
  
  
  if (normalizedType.includes('spreadsheetml') || 
      normalizedType.includes('excel') ||
      normalizedType === 'text/csv') {
    return <FileSpreadsheet className={`${baseClasses} text-green-600`} />;
  }
  
  
  
  
  
  
  
  
  if (normalizedType.startsWith('text/')) {
    return <BookOpen className={`${baseClasses} text-gray-600`} />;
  }
  
  
  if (normalizedType === 'application/zip' || 
      normalizedType === 'application/x-zip-compressed' ||
      normalizedType === 'application/x-rar-compressed' ||
      normalizedType === 'application/x-7z-compressed' ||
      normalizedType === 'application/gzip' ||
      normalizedType === 'application/x-tar') {
    return <Archive className={`${baseClasses} text-yellow-500`} />;
  }
  
  
  return <GenericFile className={`${baseClasses} text-gray-500`} />;
}