import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";




export  async function PATCH(req: NextRequest , props : {params : Promise<{fileId : string}>}){

    const {fileId} = await props.params;
    const body = await req.json();
    const {name} = body;
    


   

    if(!name || typeof name !== "string"){
        return NextResponse.json({
            error : "Invalid name"
        }, {status : 400});
    }

    try {
        const updated = await db.file.update({
            where : {id : fileId},
            data : {name},
        });
        return NextResponse.json(updated , {status : 200});
        
    } catch (error) {
        console.error("rename error:" ,error);

       return NextResponse.json({
        error : "Failed to rename"
       }, {status : 500});
        
    }
}