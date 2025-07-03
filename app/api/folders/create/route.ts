import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { createUserIfNotExists } from "@/lib/createUserIfNotExists";

import {v4 as uuidv4} from "uuid";

export async function POST(req : NextRequest){
    try {
        const {userId} = await auth();
        if(!userId){
            return NextResponse.json({
                error: "Unauthorized" ,
                
            } , {status : 401});
        }

        await createUserIfNotExists(userId);
        const body = await req.json();
        const {name , userId : bodyUserId , parentId = null} = body;

        if(bodyUserId !== userId){
            return NextResponse.json({
                error: "Unauthorized"
            } , {status : 401});
        }

        if(!name || typeof name !== "string" || name.trim() == ""){
            return NextResponse.json({
                error: "Folder name is Required"
            } , {status : 400});
        }

        if(parentId){
            const parentFolder = await db.file.findFirst({
                where: {
                    id: parentId,
                    userId,
                    isFolder: true,
                },
            })

            if(!parentFolder){
                return NextResponse.json({
                    error: "Parent folder not found"
                } , {status : 404});
            }
        }

        const folder = await db.file.create({
            data: {
                id: uuidv4(),
                name: name.trim(),
                path: `/folders/${userId}/${uuidv4()}`,
                size : 0,
                type : "folder",
                fileUrl : "",
                thumbnailUrl : null,
                userId,
                parentId,
                isFolder : true,
                isStarred : false,
                isTrash: false,
                

            },
        });
        return NextResponse.json({
            success : true,
            message : "Folder created Successfully",
            folder
        });

        
        
    } catch (error) {
        console.error("Error creating folder :",error);
        return NextResponse.json(
            {error : "Failed to create folder"},
            {status : 500}
        );
        
    }
}