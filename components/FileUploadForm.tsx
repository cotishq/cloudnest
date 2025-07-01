"use client"



import { useState } from "react";
import { Button } from "./ui/button";



export default function FileUploadForm({
    userId,
    parentId,
    onUploadComplete,
} : {
    userId : string;
    parentId : string | null;
    onUploadComplete : () => void;
}){
    
    const [file , setFile] = useState<File | null>(null);

    const handleUpload = async () => {
        if(!file) return;

        const formData = new FormData();
        formData.append("file" , file);
        formData.append("userId" ,userId);
        if(parentId){
            formData.append("parentId", parentId);
        }

        const res = await fetch("/api/files/upload", {
            method : "POST", 
            body : formData,
        });

        const result = await res.json();
        alert(result.message || "upload done !");
        onUploadComplete();
};

return (
    <div>
    <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
    <Button 
    variant="ghost"
    size="icon"
    onClick={handleUpload}>upload</Button>
    
    </div>
)
}