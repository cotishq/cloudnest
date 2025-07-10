"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";



interface FolderDialogProps{
    userId : string;
    parentId : string | null;
    onFolderCreated : () => void;
}


export default function FolderDialog({
    userId ,
    parentId , 
    onFolderCreated 
} : FolderDialogProps){
    const [open , setOpen] = useState(false);
    const[folderName , setFolderName] = useState("");
    const [loading , setLoading] = useState(false);


    const handleCreateFolder = async() => {
        if(!folderName.trim()) return;

        try {
            setLoading(true);
            const res = await fetch("/api/folders/create" , {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({
                    name : folderName,
                    userId,
                    parentId,
                })
            });

            const data = await res.json();
            if(!res.ok) throw new Error(data.error || "Unknown error");

            setOpen(false);
            setFolderName("");
            onFolderCreated();
            toast.success("Folder created");
            
        } catch (error) {
            console.error("Failed to create folder:" ,error);
        }
        finally{
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="hover:bg-muted " variant="outline">+ New Folder</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <Input 
                placeholder="Enter Folder Name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                />
                <Button variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button disabled={loading} onClick={handleCreateFolder}>
                    {loading ? "Creating..." : "Create"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}