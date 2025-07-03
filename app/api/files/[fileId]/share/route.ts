import { db } from "@/lib/db";
import { error } from "console";

import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
    req : NextRequest,
    {params} : {params : {fileId : string}}
) {

    const fileId = params.fileId;

    try {

        const file = await db.file.findUnique({
            where : {id : fileId},
        });

        if(!file){
            return NextResponse.json({
                error : "File not Found" 
            } , {status : 404});
        }

        const updated = await db.file.update({
            where : {id : fileId},
            data : {isPublic : !file.isPublic},
        });

        return NextResponse.json(updated);
        
    } catch (error) {

        console.error("share toggle error" , error);
        return NextResponse.json({error : "Server error"},{status : 500});
        
    }
    
}