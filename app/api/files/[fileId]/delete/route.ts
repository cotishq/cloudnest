import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";

import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

const imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT || ""

});

export async function DELETE(
    req : NextRequest,
    props : {params : Promise<{fileId : string}>}
){
    try {

        const {userId} = await auth();
            if(!userId){
                return NextResponse.json({
                    error : "Unauthorized"
                }, {status : 401});
            }
        
            const {fileId} = await props.params;
        
            if(!fileId){
                return NextResponse.json({
                    error : "File id is required"
                }, {status : 401});
                
            }
        
            const file = await db.file.findFirst({
                where: {
        
                    id : fileId,
                    userId : userId
        
                }
        
            })
        
            if(!file){
                return NextResponse.json({
                    error : "File not found"
                }, {status : 401});
            }

            if(!file.isFolder){
                try {
                    let imagekitFileId = null;

                    if(file.fileUrl){
                        const urlWithoutQuery = file.fileUrl.split("?")[0];
                        imagekitFileId = urlWithoutQuery.split("/").pop();
                    }

                    if(!imagekitFileId){
                        try {
                            const searchResults = await imagekit.listFiles({
                               name : imagekitFileId ?? "",
                               limit : 1
                            });

                            const result = searchResults[0];

                           if (result && "fileId" in result) {
                              await imagekit.deleteFile(result.fileId);
                            }

                            else{
                                await imagekit.deleteFile(imagekitFileId ?? "");
                            }
                            
                        } catch (searcherror) {
                            console.error("Error while searching the file" , error)
                            return NextResponse.json({
                                error : "Error while Searching the file"
                            }, {status : 500});
                        }
                        
                    }
                    
                } catch (error) {
                    return NextResponse.json({
                        error : "Error while deleting the file"
                    },{status : 500})
                    
                }

                const deletedFile = await db.file.delete({
                    where : {
                        id : fileId
                    },
                })

                return NextResponse.json({
                    success : true,
                    message : "File Deleted Successfully",
                    deletedFile
                })
            }
        
    } catch (error) {
        console.error("Error while deleting the file" , error)
        return NextResponse.json({
            error : "File deletion failed"

        }, {status : 500});
        
    }
}