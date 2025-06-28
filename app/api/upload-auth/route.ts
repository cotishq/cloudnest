import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { use } from "react";

export async function POST(req : NextRequest){
    try {
        const {userId} = await auth();
                if(!userId){
                    return NextResponse.json({
                        error : "Unauthorized"
                    } , { status : 401});
                }
                const body = await req.json();

                const {imagekit , userId : bodyUserId , parenId} =  body;

                if(bodyUserId !== userId){
                    return NextResponse.json({
                        error : "User is not uploading the data"
                    } , { status : 401});
                     

                }

                if(!imagekit || !imagekit.url){
                    return NextResponse.json({
                        error : "Invalid data"
                    } , { status : 401});
                }

                const newFile = db.file.create({
                    data: {
                        name: imagekit.name || "Untitled",
                        path : imagekit.filePath || `/cloudnest/${userId}/${imagekit.name}`,
                        size : imagekit.size || 0,
                        type : imagekit.fileType || "image",
                        fileUrl : imagekit.url,
                        thumbnailUrl : imagekit.thumbnailUrl || null,
                        userId : userId,
                        parentId : parenId || null,
                        isFolder : false,
                        isStarred : false,
                        isTrash : false,
                    },


                })
                return NextResponse.json(newFile);

        
    } catch (error) {
       console.error("Error saving file:" , error);
       return NextResponse.json({
        error : "Failed to save the file information"
       }, {status : 500});
       
        
    }
}