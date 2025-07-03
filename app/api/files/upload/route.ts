import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import {v4 as uuid} from "uuid";
import { createUserIfNotExists } from "@/lib/createUserIfNotExists";
import { create } from "axios";

const imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT || ""

});

const Allowed_types = ["image/jpeg" , "image/png" , "image/webp" , "application/pdf"];
const Max_size = 10;

export async function POST(req : NextRequest){
    try {
        const {userId} = await auth();
    if(!userId){
        return NextResponse.json({
            error : "Unauthorized"
        } , {status : 401});
    }

    await createUserIfNotExists(userId);

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const formUserId = formData.get("userId") as string;
    const parentId = (formData.get("parentId") as string) || null;

    if(formUserId !== userId){
        return NextResponse.json({
            error : "Unauthorized"
        }, {status : 401});
    }

    if(!file){
        return NextResponse.json({
            error: "File is not Provided"
        }, {status : 400});
    }

    if(!Allowed_types.includes(file.type)){
        return NextResponse.json({
            error : "Unsupported file type"
        } , {status : 400});
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if(fileSizeMB > Max_size){
        return NextResponse.json({
            error : "File is too large"
        }, {status : 400});
    }

    if(parentId){
        const parentFolder = await db.file.findFirst({
            where : {
                id : parentId,
                userId,
                isFolder : true
            }
        });
        if (!parentFolder){
            return NextResponse.json({
                error : "Parent folder not found"
            }, {status : 404});
        }
    }

    const originalFileName = file.name;
    const fileExtension = originalFileName.split(".").pop() || "";
    const uniqueFilename = `${uuid()}.${fileExtension}`;

    const folderPath = parentId 
    ? `/cloudnest/${userId}/folders/${parentId}` : `/cloudnest/${userId}`;

    const buffer = await file.arrayBuffer();
    const uploadResponse = await imagekit.upload({
        file: Buffer.from(buffer),
        fileName : uniqueFilename,
        folder : folderPath,
        useUniqueFileName : false,
    });

    const newFile = await db.file.create({
        data : {
            name : originalFileName,
            path : uploadResponse.filePath,
            size : file.size,
            type : file.type,
            fileUrl : uploadResponse.url,
            thumbnailUrl : uploadResponse.thumbnailUrl || null,
            userId,
            parentId,
            isFolder :false,
            isStarred : false, 
            isTrash : false
        },
    });

    console.log("file uploaded" , newFile );

    return NextResponse.json(newFile);


        
    } catch (error) {
        console.error("Error while uploading the file", error);
        return NextResponse.json({
            error : "Failed to upload the file"
        }, {status : 500});
    }
    




}