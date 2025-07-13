import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

const imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT || ""

});

export async function DELETE(
    req : NextRequest
    
){
    try {
        const {userId} = await auth();
                if(!userId){
                    return NextResponse.json({
                                error : "Unauthorized"
                            }, {status : 401});
                }

                const trashedFiles = await db.file.findMany({
                    where : {
                        userId,
                        isTrash : true
                    }
                })

                if(trashedFiles.length == 0){
                    return NextResponse.json({
                        error : "No file present in trash "
                    },{status : 200});
                }

                const deletePromises = trashedFiles.filter((file) => !file.isFolder).map(async (file) => {
                    try {
                        let imagekitFileId : string | null = null;

                        if(file.fileUrl){
                            const urlWithoutQuery = file.fileUrl.split("?")[0];
                            imagekitFileId = urlWithoutQuery.split("/").pop() ?? null;
                        }

                        if(imagekitFileId && file.path){
                            imagekitFileId = file.path.split("/").pop() ?? null;
                        }


                        if(imagekitFileId){
                            try {
                                const searchResults = await imagekit.listFiles({
                                    name : imagekitFileId,
                                    limit : 1
                                })

                                const match = searchResults.find((item) => "fileId" in item );

                                if(match){
                                    await imagekit.deleteFile(match.fileId);

                                }
                                else{
                                    await imagekit.deleteFile(imagekitFileId);
                                }
                                
                            } catch (error) {
                                return NextResponse.json({
                                    error : "ImageKit search error"
                                },{status : 401});
                            }
                            
                        }
                    } catch (error) {
                        return NextResponse.json({
                            error : "Error while Deleting the file"
                        },{status : 401});
                        
                    }

                    await Promise.allSettled(deletePromises);

                    const deleted = db.file.deleteMany({
                        where : {
                            userId,
                            isTrash : true
                        }
                    })

                    return NextResponse.json({
                        success : true,
                        message : `Successfully deleted ${deleted} files from trash `
                    })


                })
        
    } catch (error) {
        console.error("Error while emptying the trash" , error)
        return NextResponse.json({
            error : "Failed to empty the trash"
        },{status : 500});
        
    }
}