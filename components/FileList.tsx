"use client"

import { act, useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import FileIcon from "./FileIcon";
import { useAuth } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ClipboardCopy, Link, Pencil, Star, StarOff, Trash, Trash2, Undo2, X } from "lucide-react";
import { PATCH } from "@/app/api/files/[fileId]/trashed/route";
import FileTabs from "./FileTabs";
import { string } from "zod";
import FolderNavigation from "./FolderNavigation";
import FolderDialog from "./FolderDialog";
import FileUploadForm from "./FileUploadForm";
import axios from "axios";
import { Input } from "./ui/input";
import { FileType } from "imagekit/dist/libs/interfaces";
import { RenameDialog } from "./RenameDialog";
import { toast } from "sonner";

import { StorageBar } from "./StorageBarProps";
import { File } from "@prisma/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";




type FileListProps = {
    userId : string;
}





export default function FileList({userId} : FileListProps){
    const[files , setFiles] = useState<File[]>([]);
    const[loading , setLoading] = useState(true);
    const[activeTab , setActiveTab] = useState("all");
    const[currentFolderId , setCurrentFolderId] = useState<string | null>(null);
    const [folderPath , setFolderPath] = useState<Array<{id : string ; name : string}>>([]);
    const [searchQuery , setSearchQuery] = useState("");
    const [editingFile , setEditingFile] = useState<File | null>(null);
    const [newName , setNewName] = useState("");
    

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
            if(activeTab === "starred") return file.isStarred && !file.isTrash;
            if(activeTab === "trash") return file.isTrash;
            return !file.isTrash;
        })
        .filter((file) => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase()));
    },[files , activeTab , searchQuery]);

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

    



    


    



    if(loading) return <p className="text-sm p-4">Loading files...</p>

    const totalSizeBytes = files
    .filter(file => !file.isTrash && !file.isFolder)
    .reduce((acc , file) => acc + file.size,0);

    const totalSizeMB = totalSizeBytes / (1024 * 1024);

    const MAX_STORAGE_MB = 100;

    

    return (
    <Card>
        <CardHeader>
            <CardTitle>Your Files</CardTitle>
        </CardHeader>
        <CardContent>

            <div className="flex items-center gap-4 mb-4">
        <FolderDialog
          userId={userId}
          parentId={currentFolderId}
          onFolderCreated={fetchFiles}
        />
        <FileUploadForm userId={userId} parentId={currentFolderId} onUploadComplete={fetchFiles} />
      </div>

     

            <FileTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {activeTab === "all" && (
                    <FolderNavigation 
                    folderPath={folderPath}
                    navigateUp={navigateUp}
                    navigateToPathFolder={navigateToPathFolder}
                    />
                )}

                <Input
                type="text"
                placeholder="Search files or folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm my-4"
                />
             
            {filteredFiles.length == 0 ? (
                <div>
                    {activeTab === "starred" && "No starred files"}
                    {activeTab === "trash" && "Trash is empty"}
                    {activeTab === "all" && "No files found"}
                </div>
            ) : (

                <>

                <StorageBar usedMB={totalSizeMB} maxMB={MAX_STORAGE_MB} />

                
                



                

                

                

               <Card className="mt-4 rounded-2xl shadow-sm border">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                <TableHeader>
                    <TableRow className="hover:bg-accent trasition duration-150">
                        <TableHead className="bg-muted text-xs uppercase text-muted-foreground">Thumbnail</TableHead>
                        <TableHead className="bg-muted text-xs uppercase text-muted-foreground">Preview</TableHead>
                        <TableHead className="bg-muted text-xs uppercase text-muted-foreground">Name</TableHead>
                        <TableHead className="bg-muted text-xs uppercase text-muted-foreground">Type</TableHead>
                        <TableHead className="bg-muted text-xs uppercase text-muted-foreground">Size</TableHead>
                        <TableHead className="bg-muted text-xs uppercase text-muted-foreground">Download</TableHead>
                        

                    </TableRow>

                </TableHeader>
                <TableBody>
                    {filteredFiles.map((file) =>(
                        <TableRow key={file.id}
                        className={file.isFolder ? "cursor-pointer hover:bg-muted" : ""}
                        onClick={() => file.isFolder && handleFolderClick(file)}>
                            <TableCell className="px-4 py-3 text-sm align-middle">
                                {file.thumbnailUrl &&(
                                    <img src={file.thumbnailUrl} alt={file.name} 
                                    className="w-12 h-12 object-cover rounded"/>
                                )}

                            </TableCell>
                        <TableCell className="px-4 py-3 text-sm align-middle">
                            {file.type.startsWith("image/") || file.type === "application/pdf" ? (
                                <a href={file.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline">
                                    Preview
                                </a>
                            ) : (
                                "-"
                            )}
                        </TableCell>
                            <TableCell className="px-4 py-3 text-sm align-middle">
                                <div className="flex items-center gap-2">
                                    <FileIcon type={file.type} />
                                    <span >{file.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm align-middle">{file.type}</TableCell>
                            <TableCell className="px-4 py-3 text-sm align-middle">{(file.size / 1024).toFixed(1)} KB</TableCell>
                            <TableCell className="px-4 py-3 text-sm align-middle" >
                            
                                <button className="text-blue-600 hover:underline" onClick={() => handleDownload(file)}>
                                    Download
                                </button>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm align-middle">
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
                                

                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm align-middle">
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


                                

                                {activeTab == "trash" && (
                                    <Button 
                                    variant= "ghost"
                                    size="icon"
                                    onClick={() => handleDelete(file.id)}
                                    >
                                      < X className="w-4 h-4 text-destructive" />
                                    </Button>

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



