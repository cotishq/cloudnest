"use client"

import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { FolderPlus, Loader2 } from "lucide-react";

interface FolderDialogProps {
  userId: string;
  parentId: string | null;
  onFolderCreated: () => void;
  trigger?: React.ReactNode;
  disabled?: boolean;
}

export default function FolderDialog({
  userId,
  parentId,
  onFolderCreated,
  trigger,
  disabled = false
}: FolderDialogProps) {
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = useCallback(() => {
    setFolderName("");
    setLoading(false);
  }, []);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  }, [resetForm]);

  const validateFolderName = (name: string): string | null => {
    const trimmed = name.trim();
    
    if (!trimmed) {
      return "Folder name is required";
    }
    
    if (trimmed.length < 1) {
      return "Folder name must be at least 1 character";
    }
    
    if (trimmed.length > 255) {
      return "Folder name must be less than 255 characters";
    }
    
    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(trimmed)) {
      return "Folder name contains invalid characters";
    }
    
    return null;
  };

  const handleCreateFolder = async () => {
    const validationError = validateFolderName(folderName);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);
      
      const res = await fetch("/api/folders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: folderName.trim(),
          userId,
          parentId,
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `Failed to create folder (${res.status})`);
      }

      setOpen(false);
      resetForm();
      onFolderCreated();
      toast.success(`Folder "${folderName.trim()}" created successfully`);

    } catch (error) {
      console.error("Failed to create folder:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create folder";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleCreateFolder();
    }
  };

  const defaultTrigger = (
    <Button 
      variant="outline" 
      size="sm"
      disabled={disabled}
      className="hover:bg-muted transition-colors"
    >
      <FolderPlus className="w-4 h-4 mr-2" />
      New Folder
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5" />
            Create New Folder
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="focus-visible:ring-2 focus-visible:ring-primary"
              autoFocus
            />
          </div>
          
          {parentId && (
            <p className="text-sm text-muted-foreground">
              This folder will be created inside the current directory
            </p>
          )}
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateFolder}
            disabled={loading || !folderName.trim()}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <FolderPlus className="w-4 h-4 mr-2" />
                Create
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}