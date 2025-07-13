"use client"

import { useRef, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { UploadCloud, X, FileText, Image, Video, Music, Archive } from "lucide-react";
import { cn } from "@/lib/file-utils";

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  
  const MAX_FILE_SIZE = 20 * 1024 * 1024; 
  const ALLOWED_TYPES = [
    'image/', 'video/', 'audio/', 'text/', 'application/pdf', 
    'application/msword', 'application/vnd.openxmlformats-officedocument',
    'application/zip', 'application/x-rar-compressed'
  ];

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 50MB";
    }
    
    const isAllowed = ALLOWED_TYPES.some(type => file.type.startsWith(type));
    if (!isAllowed) {
      return "File type not supported";
    }
    
    return null;
  };

  
  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return <Image className="w-4 h-4 text-blue-500" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4 text-purple-500" />;
    if (type.startsWith('audio/')) return <Music className="w-4 h-4 text-green-500" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-4 h-4 text-orange-500" />;
    return <FileText className="w-4 h-4 text-gray-500" />;
  };

  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);
      if (parentId) formData.append("parentId", parentId);

      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (res.ok) {
        toast.success("File uploaded successfully!");
        onUploadComplete();
        setFile(null);
        setUploadProgress(0);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Upload failed");
      }
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      const validationError = validateFile(selected);
      if (validationError) {
        toast.error(validationError);
        return;
      }
      setFile(selected);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validationError = validateFile(droppedFile);
      if (validationError) {
        toast.error(validationError);
        return;
      }
      setFile(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      
      <div
        onClick={openPicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200",
          isDragOver 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <div className={cn(
            "w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-200",
            isDragOver ? "border-primary bg-primary/10" : "border-muted-foreground/25"
          )}>
            <UploadCloud className={cn(
              "w-6 h-6 transition-colors duration-200",
              isDragOver ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          
          <div className="text-sm">
            <span className="font-medium">Click to upload</span> or drag and drop
          </div>
          <div className="text-xs text-muted-foreground">
            Supports images, videos, documents up to 20MB
          </div>
        </div>
        
        
        {isUploading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-sm font-medium">Uploading...</div>
              <div className="text-xs text-muted-foreground">{uploadProgress}%</div>
            </div>
          </div>
        )}
      </div>

      
      {file && !isUploading && (
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
          <div className="flex-shrink-0">
            {getFileIcon(file)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{file.name}</div>
            <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Uploading {file?.name}</span>
            <span className="font-medium">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
      />

      
      <div className="flex items-center gap-2">
        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading}
          className="flex-1"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4 mr-2" />
              Upload File
            </>
          )}
        </Button>
        
        {file && !isUploading && (
          <Button variant="outline" onClick={removeFile} size="sm">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}