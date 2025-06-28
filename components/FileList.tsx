"use client"

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import FileIcon from "./FileIcon";
import { useAuth } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Star, StarOff, Trash, Trash2, Undo2, X } from "lucide-react";
import { PATCH } from "@/app/api/files/[fileId]/trashed/route";
import FileTabs from "./FileTabs";
import { string } from "zod";
import FolderNavigation from "./FolderNavigation";


type AppFile = {
    id : string;
    name : string ;
    type : string;
    size : number;
    fileUrl : string;
    isStarred : boolean;
    isTrash : boolean;
    isFolder : boolean;
};

type FileListProps = {
    userId : string;
}





export default function FileList({userId} : FileListProps){
    const[files , setFiles] = useState<AppFile[]>([]);
    const[loading , setLoading] = useState(true);
    const[activeTab , setActiveTab] = useState("all");
    const[currentFolderId , setCurrentFolderId] = useState<string | null>(null);
    const [folderPath , setFolderPath] = useState<Array<{id : string ; name : string}>>([]);
    

    useEffect(() => {
        async function fetchFiles() {
            try {
                const url = currentFolderId ? `/api/files?userId=${userId}&parentId=${currentFolderId}`: `/api/files?userId=${userId}`;

                const res = await fetch(url);

                const data = await res.json();
                
               
                


                setFiles(data);
                
            } catch (error) {
                console.error("Failed to fetch the files",error);
                
            }
            finally{
                setLoading(false);
            }
            
        }

        fetchFiles();
    } , [userId , currentFolderId]);


    const handleDownload = async (file: AppFile) => {
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
            
        } catch (error) {
            console.error("Failed to download file " , error);
            
        }
    };

    const handleStarToggle = async (fileId: string) => {
        try {

            const res = await fetch(`/api/files/${fileId}/starred` , {
                method : "PATCH"
            })

            if(!res.ok){
                throw new Error("Failed to toggle star");
            }
            
        } catch (error) {
            console.error("Error toggling star" , error);
            
        }
    }

    const handleTrashToggle = async (fileId: string) => {
        try {
            const res = await fetch(`/api/files/${fileId}/trashed` , {
                method : "PATCH"
            })
            
            if(!res.ok){
                throw new Error("Failed to toggle Trash");
            }
            
        } catch (error) {

            console.error("Error toggling Trash")
            
        }
    }

    const handleDelete = async (fileId: String) => {
        try {
            const res = await fetch(`/api/files/${fileId}/delete` , {
                method : "DELETE"
            });

            if(!res.ok){
                throw new Error("Failed to delete file")
            }

            console.log("File deleted Successfully")
            setFiles((prev) => prev.filter((file) => fileId != file.id));

            
            
        } catch (error) {
            console.error("Failed to delete the file" , error)
            
        }
    }

    const handleFolderClick = (folder : AppFile) => {
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

    const filteredFiles = useMemo(() => {
        switch(activeTab){
            case "starred" : 
            return files.filter((file) => file.isStarred && !file.isTrash);
            case "trash" : 
            return files.filter((file) => file.isTrash);
            default : 
            return files.filter((file) => !file.isTrash)
        }
    },[files , activeTab]);



    


    



    if(loading) return <p className="text-sm p-4">Loading files...</p>

    

    return (
    <Card>
        <CardHeader>
            <CardTitle>Your Files</CardTitle>
        </CardHeader>
        <CardContent>
            {filteredFiles.length == 0 ? (
                <div>
                    {activeTab === "starred" && "No starred files"}
                    {activeTab === "trash" && "Trash is empty"}
                    {activeTab === "all" && "No files found"}
                </div>
            ) : (

                <>

                <FileTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {activeTab === "all" && (
                    <FolderNavigation 
                    folderPath={folderPath}
                    navigateUp={navigateUp}
                    navigateToPathFolder={navigateToPathFolder}
                    />
                )}

                

                



                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Download</TableHead>

                    </TableRow>

                </TableHeader>
                <TableBody>
                    {files.map((file) =>(
                        <TableRow key={file.id}
                        className={file.isFolder ? "cursor-pointer hover:bg-muted" : ""}
                        onClick={() => {
                            if(file.isFolder) {
                                navigateToFolder(file.id , file.name);
                            }
                        }}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <FileIcon type={file.type} />
                                    <span >{file.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{file.type}</TableCell>
                            <TableCell>{(file.size / 1024).toFixed(1)} KB</TableCell>
                            <TableCell>
                                <button className="text-blue-600 hover:underline" onClick={() => handleDownload(file)}>
                                    Download
                                </button>
                            </TableCell>
                            <TableCell className="text-center">
                                <Button 
                                variant="ghost"
                                size= "icon"
                                onClick={() => handleStarToggle(file.id)}
                                >
                                    {file.isStarred ? (
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    ) : (
                                        <StarOff className="w-4 h-4 text-muted-foreground" />
                                    ) }
                                    
                                </Button>
                                

                            </TableCell>
                            <TableCell className="text-center">
                                <Button 
                                variant="ghost"
                                size= "icon"
                                onClick={() => handleTrashToggle(file.id)}
                                >
                                    {file.isTrash ? (
                                        <Undo2 className="w-4 h-4 text-gray-500" />
                                    ) : (
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    ) }
                                    
                                </Button>

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
                
                </>

                

            )}
            
        </CardContent>
    </Card>
)


}



