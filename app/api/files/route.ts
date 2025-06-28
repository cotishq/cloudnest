import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest){

    try {
        const {userId} = await auth();
    if(!userId){
        return NextResponse.json({
            error: "Unauthorized"
        } , {status : 401});
    }

    


    const searchParams = req.nextUrl.searchParams;
    const queryUserId = searchParams.get("userId");
    const parentId = searchParams.get("parentId");

    

    if(!queryUserId || queryUserId !== userId){
        return NextResponse.json({
            error: "Unauthorized User"
        } , {status : 401});
        
    }
    let userFiles : any = [];

    if(parentId){
        userFiles = await db.file.findMany({
            where: {
                userId : userId,
                parentId : parentId
            }
        })
        

    }
    else {
        userFiles = await db.file.findMany({
            where: {
                userId : userId,
                parentId : null
            }
        })
        
    }

    

    
    return NextResponse.json(userFiles);
    

        
    } catch (error) {
        return NextResponse.json({
            error: "Failed to fetch the files"
        } , {status : 500});
        
    }
    
}