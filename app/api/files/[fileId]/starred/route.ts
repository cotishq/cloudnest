import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";

import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
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

    const updatedFile = await db.file.update({
        where : {
            id : fileId,
        },
        data : {
            isStarred : !file.isStarred,
        }
    })

    return NextResponse.json(updatedFile);
        
    } catch (error) {
        console.error("Error starring the file", error);
        return NextResponse.json({
            error : "Error while updating the file"
        }, {status : 500});
    }
    


}