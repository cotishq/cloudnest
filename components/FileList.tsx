"use client"

import { act, useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import FileIcon from "./FileIcon";

import { Button } from "./ui/button";
import { ClipboardCopy, Download, GripHorizontal, Link, MoreVertical, Pencil, Star, StarOff, Trash, Trash2, Undo2, X } from "lucide-react";

import FileTabs from "./FileTabs";

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
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent } from "./ui/dropdown-menu";
import PreviewDialog from "./PreviewDialog";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./ThemeToggle";
import { Skeleton } from "./ui/skeleton";




type FileListProps = {
    userId : string;
   

}





export default function FileList({userId} : FileListProps){
    const[files , setFiles] = useState<File[]>([]);
    const[loading , setLoading] = useState(true);
    
    const[currentFolderId , setCurrentFolderId] = useState<string | null>(null);
    const [folderPath , setFolderPath] = useState<Array<{id : string ; name : string}>>([]);
    const [searchQuery , setSearchQuery] = useState("");
    const [editingFile , setEditingFile] = useState<File | null>(null);
    const [newName , setNewName] = useState("");
    
    const searchParams = useSearchParams();
    const view = searchParams.get("view") || "all";


    

    const fetchFiles = useCallback(async () => {
  setLoading(true);
  try {
    const url = currentFolderId
      ? `/api/files?userId=${userId}&parentId=${currentFolderId}`
      : `/api/files?userId=${userId}`;
    const res = await fetch(url);
    const data = await res.json();
    
    
    setFiles(data);

    
  } catch (error) {
    console.error("Failed to fetch the files", error);
    toast.error("We couldnt load your files");
    
  } finally {
    setLoading(false);
  }
}, [userId, currentFolderId]);

useEffect(() => {
  fetchFiles();
}, [fetchFiles]);

const filteredFiles = useMemo(() => {
        return files.
        filter((file) => {
            if(view === "starred") return file.isStarred && !file.isTrash;
            if(view === "trash") return file.isTrash;
            return !file.isTrash;
        })
        .filter((file) => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase()));
    },[files , view , searchQuery]);

const trashCount = useMemo(() => {
    return files.filter((file) => file.isTrash).length;
  }, [files]);

  const starredCount = useMemo(() => {
    return files.filter((file) => file.isStarred && !file.isTrash).length;
  }, [files]);



    const handleDownload = async (file: File) => {
        try {
            const response = await fetch(file.fileUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);

            toast.success("Download succeed");


           
            
        } catch (error) {
            console.error("Failed to download file " , error);
            
        }
    };

    const handleStarToggle = async (fileId: string) => {
        try {

            const res = await axios.patch(`/api/files/${fileId}/starred`);
            



            setFiles(prev => prev.map(file => file.id === fileId ? {...file , isStarred : !file.isStarred} : file));

            const file = files.find((f) => f.id === fileId);

            toast(
            `"${file?.name}" has been ${
                file?.isStarred ? "removed from" : "added to"
            } your starred files`
            );

            
            
        } catch (error) {
            console.error("Error toggling star" , error);
            
        }
    }

    const handleTrashToggle = async (fileId: string) => {
        try {
            const res = await axios.patch(`/api/files/${fileId}/trashed`);
            
            
            setFiles(prev => prev.map(file => file.id === fileId?{...file , isTrash : !file.isTrash} : file));

            const file = files.find((f) => f.id === fileId);

                if (file) {
                if (!file.isTrash) {
                    toast.warning(`"${file.name}" moved to Trash`);
                } else {
                    toast.success(`"${file.name}" restored`);
                }
                }


            
        } catch (error) {
            toast.error("cannot toggle the trash")

            console.error("Error toggling Trash")
            
        }
    }

    const handleDelete = async (fileId: String) => {
        try {
            const res = await axios.delete(`/api/files/${fileId}/delete`);

            setFiles((prev) => prev.filter((file) => file.id !== fileId));

            toast.success("File permanently deleted");

            
            }

            catch (error) {
            toast.error("Error while deleting the file")
            console.error("Failed to delete the file" , error)
            
            
        }

            

            
            
        }

        const handleRename = async(fileId : string , newName : string)=>{
            try {
                const res = await fetch(`api/files/${fileId}/rename`,{
                    method : "PATCH",
                    headers : {"Content-Type" : "application/json"},
                    body : JSON.stringify({name : newName}),
                });
                if(!res.ok) throw new Error("Failed to rename");

                const updatedFile = await res.json();

                setFiles((prevFiles) => prevFiles.map((file) => 
                file.id === updatedFile.id?{...file , name: updatedFile.name}: file))

                toast.success("File renamed")
                
            } catch (error) {
                console.error(error);
                toast.error("Rename failed")
                
            }
        }
        
       
    

    const handleFolderClick = (folder : File) => {
        setCurrentFolderId(folder.id);
        setFolderPath([...folderPath , {id: folder.id , name : folder.name}]);
    }

    const navigateToFolder = (folderId : string , folderName : string) => {
        setCurrentFolderId(folderId);
        setFolderPath([...folderPath , {id: folderId , name : folderName}]);
    }
    
    const navigateUp = () => {
        if(folderPath.length === 0) return;
        const newPath = [...folderPath];
        newPath.pop();
        const newFolderId = newPath.length > 0 ? newPath[newPath.length - 1].id : null;
        setCurrentFolderId(newFolderId);
        setFolderPath(newPath);
    }

    const navigateToPathFolder = (index : number) => {
        if(index < 0){
            setCurrentFolderId(null);
            setFolderPath([]);
        } else{
            const newPath = folderPath.slice(0, index + 1);
            setFolderPath(newPath);
            setCurrentFolderId(newPath[newPath.length - 1].id);
        }
        
    }

    



    


    



    if (loading) {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-center gap-4 p-4 border rounded-xl bg-muted"
        >
          <Skeleton className="h-12 w-12 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-2/5" />
          </div>
          <Skeleton className="h-6 w-10" />
        </div>
      ))}
    </div>
  )
}


    const totalSizeBytes = files
    .filter(file => !file.isTrash && !file.isFolder)
    .reduce((acc , file) => acc + file.size,0);

    const totalSizeMB = totalSizeBytes / (1024 * 1024);

    const MAX_STORAGE_MB = 100;

    

    return (
        
    <Card>
        <CardHeader className="space-y-4">

            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
                <CardTitle className="text-xl font-semibold mb-4 capitalize">{view} Files</CardTitle>

                
                    <Input
                type="text"
                placeholder="Search files or folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:max-w-md mb-4"
                />


               

            </div>
            
            

            <div className="flex items-center gap-2 justify-between flex-wrap">
                <div className="flex items-center gap-2">
                    <FolderDialog
          userId={userId}
          parentId={currentFolderId}
          onFolderCreated={fetchFiles}
        />
        <FileUploadForm  userId={userId} parentId={currentFolderId} onUploadComplete={fetchFiles} />



                </div>
                

        
        
        <div className="absolute top-4 right-4">
            <ModeToggle />
            </div> 


            </div>
        </CardHeader>

        <CardContent>
        

        

     

            

                {view === "all" && (
                    <FolderNavigation 
                    folderPath={folderPath}
                    navigateUp={navigateUp}
                    navigateToPathFolder={navigateToPathFolder}
                    />
                )}

                
             
            {filteredFiles.length == 0 ? (
                <div>
                    {view === "starred" && <Card className="mt-8 text-center text-muted-foreground">
                    <CardContent>
                        <p className="text-sm">Star files that matter most to you, and they’ll show up here.</p>
                    </CardContent>
                    </Card>}
                    {view === "trash" && <Card className="mt-8 text-center text-muted-foreground">
                    <CardContent>
                        <p className="text-sm">No trash files found.</p>
                    </CardContent>
                    </Card> }
                    {view === "all" && <Card className="mt-8 text-center text-muted-foreground">
                    <CardContent>
                        <p className="text-sm">No files found in this view.</p>
                    </CardContent>
                    </Card>}
                </div>
            ) : (

                <>

                {view === "all" && (
                    <div className="mt-4">
                        <StorageBar usedMB={totalSizeMB} maxMB={MAX_STORAGE_MB} />

                    </div>
                )} 


                
                



                

                

                

               <Card className="mt-4 rounded-2xl shadow-sm">
                <CardContent className="p-0">
                    <div className="rounded-xl border bg-background text-foreground shadow-sm overflow-x-auto">
                        <Table >
                <TableHeader>
                    <TableRow className="hover:bg-accent trasition duration-150">
                        <TableHead className="w-[50px]">Thumbnail</TableHead>
                        <TableHead className="w-[100px]">Preview</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className="text-center">Download</TableHead>
                        <TableHead className="text-right pr-8">Actions</TableHead>
                        

                    </TableRow>

                </TableHeader>
                <TableBody>
                    {filteredFiles.map((file) =>(
                        <TableRow key={file.id}
                        className={cn("group transition hover:bg-muted",
                            file.isFolder ? "cursor-pointer" : "")}
                        onClick={() => file.isFolder && handleFolderClick(file)}>
                            <TableCell className="px-4 py-3 text-sm align-middle">
                                {file.thumbnailUrl &&(
                                    <img src={file.thumbnailUrl} alt={file.name} 
                                    className="w-12 h-12 object-cover rounded"/>
                                )}

                            </TableCell>
                        <TableCell className="px-4 py-3 text-sm align-middle">
                            {file.type.startsWith("image/") || file.type === "application/pdf" ? (
                        <PreviewDialog
                            fileName={file.name}
                            fileUrl={file.fileUrl}
                            type={file.type}
                        />
                        ) : (
                        "-"
                        )}
                        </TableCell>
                            <TableCell className="px-4 py-3 text-sm align-middle">
                                <div className="flex items-center gap-2">
                                    <FileIcon type={file.type} />
                                    <span className="truncate">{file.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm align-middle">{file.type}</TableCell>
                            <TableCell className="px-4 py-3 text-sm align-middle">{(file.size / 1024).toFixed(1)} KB</TableCell>
                            <TableCell className="text-center" >
                            
                                <button className="text-blue-600 hover:underline" onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(file);
                                }}>
                                    <Download className="w-4 h-4 " />
                                </button>
                            </TableCell>
                            <TableCell className="text-right pr-8">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <GripHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>
                                            <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button 
                                variant="ghost"
                                size= "icon"

                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleStarToggle(file.id)
                                    

                                }}
                                >
                                    {file.isStarred ? (
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    ) : (
                                        <StarOff className="w-4 h-4 text-muted-foreground" />
                                    ) }
                                    
                                </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {file.isStarred ? "Remove from Starred" : "Add to Starred"}
                                    </TooltipContent>
                                </Tooltip>

                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button 
                                variant="ghost"
                                size= "icon"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleTrashToggle(file.id)

                                }}
                                >
                                    {file.isTrash ? (
                                        <Undo2 className="w-4 h-4 text-gray-500" />
                                    ) : (
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    ) }
                                    
                                </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {file.isTrash ? "Remove from trash" : "Add to trash"}
                                    </TooltipContent>
                                </Tooltip>

                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button 
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    
                                    setEditingFile(file);
                                    setNewName(file.name)
                                }}
                                >
                                    <Pencil className="w-4 h-4 text-gray-5500" />
                                </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Rename</p>
                                    </TooltipContent>
                                </Tooltip>


                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>

                                            {file.isPublic ? (
                                <>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={async (e) => {
                                        e.stopPropagation();

                                        const res = await fetch(`/api/files/${file.id}/share`, { method: "PATCH" });
                                        const updated = await res.json();
                                        setFiles((prev) =>
                                        prev.map((f) =>
                                            f.id === file.id ? { ...f, isPublic: updated.isPublic } : f
                                        )
                                        );
                                        toast.success("File is now private");
                                    }}
                                    >
                                    <Link className="w-4 h-4 text-blue-600" />
                                    </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Make private</p>
                                        </TooltipContent>
                                    </Tooltip>

                                   <Tooltip>
                                    <TooltipTrigger asChild>
                                         <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        const shareUrl = `${window.location.origin}/share/${file.id}`;
                                        navigator.clipboard.writeText(shareUrl);
                                        toast.success("Link copied to clipboard!");
                                    }}
                                    >
                                    <ClipboardCopy className="w-4 h-4 text-muted-foreground" />
                                    </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Copy Link</p>
                                    </TooltipContent>
                                   </Tooltip>
                                </>
                                ) : (
                               <Tooltip>
                                <TooltipTrigger asChild>
                                     <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                    const res = await fetch(`/api/files/${file.id}/share`, { method: "PATCH" });
                                    const updated = await res.json();
                                    setFiles((prev) =>
                                        prev.map((f) =>
                                        f.id === file.id ? { ...f, isPublic: updated.isPublic } : f
                                        )
                                    );
                                    toast.success("File is now public");
                                    }}
                                >
                                    <Link className="w-4 h-4 text-muted-foreground" />
                                </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Make public</p>
                                </TooltipContent>
                               </Tooltip>
                                )}

                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                
                                

                                
                                
                                


                                

                                {view == "trash" && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button 
                                    variant= "ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(file.id)
                                    }}
                                    >
                                      < X className="w-4 h-4 text-destructive" />
                                    </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Delete permanently
                                        </TooltipContent>
                                    </Tooltip>

                                )}
                                

                            </TableCell>
                            
                        </TableRow>


                ))}


                </TableBody>
                
                
            </Table>


                    </div>
                </CardContent>
               </Card>

                

             <RenameDialog 
             file={editingFile}
             newName={newName}
             setNewName={setNewName}
             onRename={handleRename}
             onClose={()=>setEditingFile(null)}
               />
                
                </>

                

            )}

            </CardContent>
            
        
    </Card>
)


}



