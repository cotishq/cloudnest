"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import FileIcon from "./FileIcon";
import { Button } from "./ui/button";
import { ClipboardCopy, Download, Link, MoreVertical, Pencil, Star, StarOff, Trash, Trash2, Undo2, X, ChevronRight } from "lucide-react";
import FolderNavigation from "./FolderNavigation";
import FolderDialog from "./FolderDialog";
import FileUploadForm from "./FileUploadForm";
import axios from "axios";
import { Input } from "./ui/input";
import { RenameDialog } from "./RenameDialog";
import { toast } from "sonner";
import { StorageBar } from "./StorageBarProps";
import { File } from "@prisma/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu";
import PreviewDialog from "./PreviewDialog";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/file-utils";
import { ModeToggle } from "./ThemeToggle";
import { Skeleton } from "./ui/skeleton";
import { formatDistanceToNow } from "date-fns";

type FileListProps = {
    userId: string;
    isDemo?: boolean;
    filestate?: File[];
}

export default function FileList({ userId, isDemo = false, filestate }: FileListProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [folderPath, setFolderPath] = useState<Array<{ id: string; name: string }>>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingFile, setEditingFile] = useState<File | null>(null);
    const [newName, setNewName] = useState("");
    
    const searchParams = useSearchParams();
    const view = searchParams.get('view') || 'all';

    const fetchFiles = useCallback(async () => {
        setLoading(true);
        try {
            if (isDemo && filestate) {
                setFiles(filestate);
                return;
            }
            const url = currentFolderId
                ? `/api/files?userId=${userId}&parentId=${currentFolderId}`
                : `/api/files?userId=${userId}`;
            const res = await fetch(url);
            const data = await res.json();
            setFiles(data);
        } catch (error) {
            console.error("Failed to fetch the files", error);
            toast.error("We couldn't load your files");
        } finally {
            setLoading(false);
        }
    }, [userId, currentFolderId, isDemo, filestate, view]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const filteredFiles = useMemo(() => {
        return files
            .filter((file) => {
                if (view === "starred") return file.isStarred && !file.isTrash;
                if (view === "trash") return file.isTrash;
                return !file.isTrash;
            })
            .filter((file) => 
                file.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [files, view, searchQuery]);

    const trashCount = useMemo(() => {
        return files.filter((file) => file.isTrash).length;
    }, [files]);

    const starredCount = useMemo(() => {
        return files.filter((file) => file.isStarred && !file.isTrash).length;
    }, [files]);

    const handleDownload = async (file: File) => {
        try {
            const loadingToast = toast.loading(`Preparing "${file.name}" for download...`);
            
            const response = await fetch(file.fileUrl);
            if (!response.ok) {
                throw new Error(`Failed to download: ${response.statusText}`);
            }
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);

            toast.success(`"${file.name}" downloaded successfully`, {
                id: loadingToast
            });
        } catch (error) {
            console.error("Failed to download file", error);
            toast.error(`Failed to download "${file.name}"`);
        }
    };

    const handleStarToggle = async (fileId: string) => {
        try {
            await axios.patch(`/api/files/${fileId}/starred`);
            
            setFiles(prev => prev.map(file => 
                file.id === fileId ? { ...file, isStarred: !file.isStarred } : file
            ));

            const file = files.find((f) => f.id === fileId);
            toast.success(
                `"${file?.name}" ${file?.isStarred ? "removed from" : "added to"} starred files`
            );
        } catch (error) {
            console.error("Error toggling star", error);
            toast.error("Failed to update star status");
        }
    }

    const handleTrashToggle = async (fileId: string) => {
        try {
            await axios.patch(`/api/files/${fileId}/trashed`);
            
            setFiles(prev => prev.map(file => 
                file.id === fileId ? { ...file, isTrash: !file.isTrash } : file
            ));

            const file = files.find((f) => f.id === fileId);
            if (file) {
                if (!file.isTrash) {
                    toast.warning(`"${file.name}" moved to Trash`);
                } else {
                    toast.success(`"${file.name}" restored from Trash`);
                }
            }
        } catch (error) {
            toast.error("Failed to update trash status");
            console.error("Error toggling Trash", error);
        }
    }

    const handleDelete = async (fileId: string) => {
        try {
            const fileToDelete = files.find(f => f.id === fileId);
            
            await axios.delete(`/api/files/${fileId}/delete`);
            setFiles((prev) => prev.filter((file) => file.id !== fileId));
            
            toast.success(`"${fileToDelete?.name}" permanently deleted`);
        } catch (error) {
            toast.error("Failed to delete file");
            console.error("Failed to delete the file", error);
        }
    }

    const handleRename = async (fileId: string, newName: string) => {
        try {
            const res = await fetch(`/api/files/${fileId}/rename`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
            });
            
            if (!res.ok) throw new Error("Failed to rename");

            const updatedFile = await res.json();
            setFiles((prevFiles) => prevFiles.map((file) => 
                file.id === updatedFile.id ? { ...file, name: updatedFile.name } : file
            ));

            toast.success(`File renamed to "${updatedFile.name}"`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to rename file");
        }
    }

    const handleFolderClick = (folder: File) => {
        setCurrentFolderId(folder.id);
        setFolderPath([...folderPath, { id: folder.id, name: folder.name }]);
    }

    const navigateUp = () => {
        if (folderPath.length === 0) return;
        const newPath = [...folderPath];
        newPath.pop();
        const newFolderId = newPath.length > 0 ? newPath[newPath.length - 1].id : null;
        setCurrentFolderId(newFolderId);
        setFolderPath(newPath);
    }

    const navigateToPathFolder = (index: number) => {
        if (index < 0) {
            setCurrentFolderId(null);
            setFolderPath([]);
        } else {
            const newPath = folderPath.slice(0, index + 1);
            setFolderPath(newPath);
            setCurrentFolderId(newPath[newPath.length - 1].id);
        }
    }

    const handleShareToggle = async (fileId: string) => {
        try {
            const res = await fetch(`/api/files/${fileId}/share`, { method: "PATCH" });
            const updated = await res.json();
            
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === fileId ? { ...f, isPublic: updated.isPublic } : f
                )
            );
            
            toast.success(`File is now ${updated.isPublic ? "public" : "private"}`);
        } catch (error) {
            console.error("Failed to update share", error);
            toast.error("Failed to update sharing status");
        }
    };

    const handleCopyShareLink = (fileId: string) => {
        const shareUrl = `${window.location.origin}/share/${fileId}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard!");
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const formatDate = (dateInput: Date | string): string => {
        const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
        return formatDistanceToNow(date, { addSuffix: true });
    };

    // Enhanced Actions Component
    const FileActions = ({ file }: { file: File }) => (
        <div className="flex items-center gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-blue-500/20 hover:text-blue-400 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(file);
                        }}
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Download</TooltipContent>
            </Tooltip>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-muted/50 transition-colors"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            handleStarToggle(file.id);
                        }}
                    >
                        {file.isStarred ? (
                            <StarOff className="h-4 w-4 mr-2" />
                        ) : (
                            <Star className="h-4 w-4 mr-2" />
                        )}
                        {file.isStarred ? "Remove from starred" : "Add to starred"}
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditingFile(file);
                            setNewName(file.name);
                        }}
                    >
                        <Pencil className="h-4 w-4 mr-2" />
                        Rename
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            handleShareToggle(file.id);
                        }}
                    >
                        <Link className="h-4 w-4 mr-2" />
                        {file.isPublic ? "Make private" : "Make public"}
                    </DropdownMenuItem>

                    {file.isPublic && (
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopyShareLink(file.id);
                            }}
                        >
                            <ClipboardCopy className="h-4 w-4 mr-2" />
                            Copy share link
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            handleTrashToggle(file.id);
                        }}
                    >
                        {file.isTrash ? (
                            <Undo2 className="h-4 w-4 mr-2" />
                        ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        {file.isTrash ? "Restore" : "Move to trash"}
                    </DropdownMenuItem>

                    {view === "trash" && (
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(file.id);
                            }}
                            className="text-red-600 focus:text-red-600"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Delete permanently
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );

    // Mobile Card Component
    const MobileFileCard = ({ file }: { file: File }) => (
        <Card
            className={cn(
                "group cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-500 bg-card",
                file.isFolder && "hover:bg-muted/30"
            )}
            onClick={() => file.isFolder && handleFolderClick(file)}
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        {file.thumbnailUrl ? (
                            <img
                                src={file.thumbnailUrl}
                                alt={file.name}
                                className="w-12 h-12 object-cover rounded-lg border shadow-sm"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-lg bg-muted border flex items-center justify-center">
                                <FileIcon type={file.type} />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="font-semibold text-sm truncate text-foreground">
                                    {file.name}
                                </span>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    {file.isStarred && (
                                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    )}
                                    {file.isPublic && (
                                        <Link className="h-3 w-3 text-blue-500" />
                                    )}
                                    {file.isFolder && (
                                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                            <FileActions file={file} />
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="bg-muted/50 px-2 py-1 rounded-full">
                                {file.isFolder ? "Folder" : file.type}
                            </span>
                            <span>{file.isFolder ? "-" : formatFileSize(file.size)}</span>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                            {formatDate(file.updatedAt)}
                        </div>
                        
                        {file.type.startsWith("image/") || file.type === "application/pdf" ? (
                            <div className="pt-1">
                                <PreviewDialog
                                    fileName={file.name}
                                    fileUrl={file.fileUrl}
                                    type={file.type}
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <Card key={idx} className="animate-pulse bg-card">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/5" />
                                    <Skeleton className="h-3 w-2/5" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-9 w-9 rounded" />
                                    <Skeleton className="h-9 w-9 rounded" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const totalSizeBytes = files
        .filter(file => !file.isTrash && !file.isFolder)
        .reduce((acc, file) => acc + file.size, 0);

    const totalSizeMB = totalSizeBytes / (1024 * 1024);
    const MAX_STORAGE_MB = 100;

    return (
        <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-card">
                <CardHeader className="space-y-6 pb-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                            <CardTitle className="text-2xl font-bold capitalize text-foreground">
                                {view} Files
                            </CardTitle>
                            {view === "starred" && starredCount > 0 && (
                                <div className="px-3 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/20">
                                    {starredCount}
                                </div>
                            )}
                            {view === "trash" && trashCount > 0 && (
                                <div className="px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium rounded-full border border-red-500/20">
                                    {trashCount}
                                </div>
                            )}
                        </div>

                        <div className="absolute top-4 right-4 lg:static">
                            <ModeToggle />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <Input
                            type="text"
                            placeholder="Search files and folders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full lg:max-w-sm border-2 focus:border-blue-500 transition-colors h-11 bg-background"
                        />

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <FolderDialog
                                userId={userId}
                                parentId={currentFolderId}
                                onFolderCreated={fetchFiles}
                            />
                            <FileUploadForm
                                userId={userId}
                                parentId={currentFolderId}
                                onUploadComplete={fetchFiles}
                            />
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {view === "all" && (
                <Card className="border-0 shadow-sm bg-card">
                    <CardContent className="p-4">
                        <FolderNavigation
                            folderPath={folderPath}
                            navigateUp={navigateUp}
                            navigateToPathFolder={navigateToPathFolder}
                        />
                    </CardContent>
                </Card>
            )}

            {view === "all" && (
                <Card className="border-0 shadow-sm bg-card">
                    <CardContent className="p-4">
                        <StorageBar usedMB={totalSizeMB} maxMB={MAX_STORAGE_MB} />
                    </CardContent>
                </Card>
            )}

            {filteredFiles.length === 0 ? (
                <div className="text-center py-16">
                    {view === "starred" && (
                        <Card className="border-dashed border-2 border-border bg-card">
                            <CardContent className="py-12">
                                <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Star className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <p className="text-xl font-semibold text-foreground mb-2">No starred files yet</p>
                                <p className="text-muted-foreground">
                                    Star files that matter most to you, and they'll show up here.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                    {view === "trash" && (
                        <Card className="border-dashed border-2 border-border bg-card">
                            <CardContent className="py-12">
                                <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Trash className="h-10 w-10 text-red-600 dark:text-red-400" />
                                </div>
                                <p className="text-xl font-semibold text-foreground mb-2">Trash is empty</p>
                                <p className="text-muted-foreground">
                                    Deleted files will appear here before being permanently removed.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                    {view === "all" && (
                        <Card className="border-dashed border-2 border-border bg-card">
                            <CardContent className="py-12">
                                <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Download className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                                </div>
                                <p className="text-xl font-semibold text-foreground mb-2">No files found</p>
                                <p className="text-muted-foreground">
                                    Upload your first file to get started.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="block lg:hidden space-y-3">
                        {filteredFiles.map((file) => (
                            <MobileFileCard key={file.id} file={file} />
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <Card className="hidden lg:block border-0 shadow-sm bg-card">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-muted/50 transition-colors">
                                            <TableHead className="w-[80px] font-semibold">Preview</TableHead>
                                            <TableHead className="font-semibold">Name</TableHead>
                                            <TableHead className="font-semibold">Type</TableHead>
                                            <TableHead className="font-semibold">Size</TableHead>
                                            <TableHead className="font-semibold">Modified</TableHead>
                                            <TableHead className="text-center font-semibold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredFiles.map((file) => (
                                            <TableRow
                                                key={file.id}
                                                className={cn(
                                                    "group transition-all hover:bg-muted/30",
                                                    file.isFolder ? "cursor-pointer" : ""
                                                )}
                                                onClick={() => file.isFolder && handleFolderClick(file)}
                                            >
                                                <TableCell className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        {file.thumbnailUrl ? (
                                                            <img
                                                                src={file.thumbnailUrl}
                                                                alt={file.name}
                                                                className="w-12 h-12 object-cover rounded-lg border shadow-sm"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-lg bg-muted border flex items-center justify-center">
                                                                <FileIcon type={file.type} />
                                                            </div>
                                                        )}
                                                        {file.type.startsWith("image/") || file.type === "application/pdf" ? (
                                                            <PreviewDialog
                                                                fileName={file.name}
                                                                fileUrl={file.fileUrl}
                                                                type={file.type}
                                                            />
                                                        ) : null}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-sm truncate max-w-[200px] text-foreground">
                                                                {file.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {file.isStarred && (
                                                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                            )}
                                                            {file.isPublic && (
                                                                <Link className="h-3 w-3 text-blue-500" />
                                                            )}
                                                            {file.isFolder && (
                                                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-4 text-sm text-muted-foreground">
                                                    <span className="bg-muted/50 px-2 py-1 rounded-full text-xs">
                                                        {file.isFolder ? "Folder" : file.type}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="p-4 text-sm text-foreground">
                                                    {file.isFolder ? "-" : formatFileSize(file.size)}
                                                </TableCell>
                                                <TableCell className="p-4 text-sm text-muted-foreground">
                                                    {formatDate(file.updatedAt)}
                                                </TableCell>
                                                <TableCell className="p-4">
                                                    <div className="flex items-center justify-center">
                                                        <FileActions file={file} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            <RenameDialog
                file={editingFile}
                newName={newName}
                setNewName={setNewName}
                onRename={handleRename}
                onClose={() => setEditingFile(null)}
            />
        </div>
    );
}
