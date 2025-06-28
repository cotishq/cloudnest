"use client"


import { useState } from "react";



export default function FileUploadForm({userId} : {userId : string}){
    const [file , setFile] = useState<File | null>(null);

    const handleUpload = async () => {
        if(!file) return;

        const formData = new FormData();
        formData.append("file" , file);
        formData.append("userId" ,userId);

        const res = await fetch("/api/files/upload", {
            method : "POST", 
            body : formData,
        });

        const result = await res.json();
        alert(result.message || "upload done !");
};

return (
    <div>
    <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
    <button 
    onClick={handleUpload}
    className="bg-blue-600 text-white px-4 py-2 rounded">
        Upload
    </button>
    
    </div>
)
}