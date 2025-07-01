import { auth } from "@clerk/nextjs/server";


import ImageKit from "imagekit";

import { NextResponse } from "next/server";

const imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT || ""

});

export async function  GET() {

    try {
        const {userId} = await auth();
        if(!userId){
            return NextResponse.json({
                error : "Unauthorized"
            } , { status : 401});
        }

        const authParams = imagekit.getAuthenticationParameters();
        return NextResponse.json(authParams);
        
    } catch (error) {
        console.error("Cannot get authentication parameters" , error);
        return NextResponse.json({
                error : "Failed to generate authentication parameters"
            } , { status : 500});

        
    }
    
}

