import { DialogClose, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { File } from "@prisma/client";
import { Dialog, DialogFooter, DialogHeader } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState, useRef } from "react";

interface RenameDialogProps {
    file: File | null;
    newName: string;
    setNewName: (val: string) => void;
    onRename: (id: string, newName: string) => void;
    onClose: () => void;
}

export const RenameDialog = ({ file, newName, setNewName, onRename, onClose }: RenameDialogProps) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [error, setError] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    
    const getFileNameParts = (fileName: string) => {
        const lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex === -1) return { name: fileName, extension: '' };
        return {
            name: fileName.substring(0, lastDotIndex),
            extension: fileName.substring(lastDotIndex)
        };
    };

    const { name: fileNameWithoutExt, extension } = file ? getFileNameParts(file.name) : { name: '', extension: '' };

    
    const validateFileName = (name: string): string => {
        if (!name.trim()) return "File name cannot be empty";
        if (name.length > 255) return "File name is too long";
        if (/[<>:"/\\|?*]/.test(name)) return "File name contains invalid characters";
        if (name.trim() === file?.name) return "New name must be different from current name";
        return "";
    };

    const currentError = validateFileName(newName);
    const isValid = !currentError && newName.trim() !== "";

    
    useEffect(() => {
        if (file && inputRef.current) {
            
            setTimeout(() => {
                inputRef.current?.focus();
                
                if (extension) {
                    inputRef.current?.setSelectionRange(0, fileNameWithoutExt.length);
                } else {
                    inputRef.current?.select();
                }
            }, 100);
        }
    }, [file, fileNameWithoutExt.length, extension]);

    
    const handleRename = async () => {
        if (!file || !isValid) return;
        
        setIsRenaming(true);
        setError("");
        
        try {
            await onRename(file.id, newName.trim());
            onClose();
        } catch (err) {
            setError("Failed to rename file. Please try again.");
        } finally {
            setIsRenaming(false);
        }
    };

    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && isValid) {
            handleRename();
        }
    };

    
    useEffect(() => {
        if (error) setError("");
    }, [newName]);

    if (!file) return null;

    return (
        <Dialog open={!!file} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            {file.name.includes('.') ? (
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium">Rename File</div>
                            <div className="text-xs text-muted-foreground truncate">{file.name}</div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            New name
                        </label>
                        <div className="relative">
                            <Input
                                ref={inputRef}
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter new name"
                                className={`pr-12 ${currentError ? 'border-red-500 focus:border-red-500' : ''}`}
                                disabled={isRenaming}
                            />
                            {extension && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                                    {extension}
                                </div>
                            )}
                        </div>
                        
                        
                        {currentError && (
                            <div className="flex items-center gap-1 text-sm text-red-500">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {currentError}
                            </div>
                        )}
                        
                        {error && (
                            <div className="flex items-center gap-1 text-sm text-red-500">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}
                    </div>

                    
                    <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Size:</span>
                            <span>{(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="capitalize">{file.type || 'Unknown'}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost" disabled={isRenaming}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={handleRename}
                        disabled={!isValid || isRenaming}
                        className="min-w-[80px]"
                    >
                        {isRenaming ? (
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Renaming...
                            </div>
                        ) : (
                            'Rename'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};