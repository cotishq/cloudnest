import { useSignIn } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "./ui/button";

 export default function SocialButtons ()  {
    const {signIn , isLoaded} = useSignIn();

    const handleOAuth = async(provider : "oauth_google" | "oauth_apple") => {
        if(!isLoaded) return;
        try {
            await signIn.authenticateWithRedirect({
                strategy : provider,
                redirectUrl : "/sso-callback",
                redirectUrlComplete : "/dashboard",
            });
            
        } catch (error) {
            console.error("OAuth error",error);
            
        }
    };

    return (
        <div className="space-y-3">
            <Button 
            variant="outline"
            className="w-full h-11 font-medium border-2 hover:bg-accent/50 transition-colors"
            onClick={() => handleOAuth("oauth_google")}>
                <Image 
                src="\Google__G__logo.svg"
                alt="Google"
                width={18}
                height={18}
                className="mr-1"  />
                Continue with Google
            </Button>
            <Button 
            variant="outline"
            className="w-full h-11 font-medium border-2 hover:bg-accent/50 transition-colors"
            onClick={() => handleOAuth("oauth_apple")}>
                <Image 
                src="/Apple_logo_black.svg"
                alt="Apple"
                width={18}
                height={18}
                className="mr-1"  />
                Continue with Apple
            </Button>

        </div>
    );
}