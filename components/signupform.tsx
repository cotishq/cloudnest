"use client"

import {useForm} from "react-hook-form";

import {useSignUp} from "@clerk/nextjs";

import { z } from "zod";

import { signUpSchema } from "@/schemas/signupschema";
import React, { useState } from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";

import { Separator } from "./ui/separator";
import SocialButtons from "@/components/social-buttons";
import {
    Mail,
    Lock , 
    AlertCircle ,
    CheckCircle,
    Eye , 
    EyeOff,
    User,
} from "lucide-react";

export default function SignUpForm(){
    const router = useRouter();
    const[verifying , setVerifying] = useState(false);
    const[isSubmitting , setIsSubmitting] = useState(false);
    const [authError , setAuthError] = useState<string | null>(null);
    const [verificationCode , setVerificationCode] = useState("");
    const [verificationError,setVerificationError] = useState<string | null>(null);
    const [showPassword , setShowPassword] = useState(false);
    const[showConfirmPassword , setShowConfirmPassword] = useState(false);

    





    const{signUp , isLoaded , setActive} = useSignUp();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver : zodResolver(signUpSchema),
        defaultValues: {
            identifier : "",
            password: "",
            passwordConfirmation : ""
        }
    });
    const onSubmit = async(data : z.infer<typeof signUpSchema>) => {
        if(!isLoaded) return;
        setIsSubmitting(true)
        setAuthError(null)

       

        try {
             
            await signUp.create({
                emailAddress : data.identifier,
                password : data.password,
                
            })

            await signUp.prepareEmailAddressVerification({
                strategy : "email_code"
            })

            setVerifying(true)
            
        } catch (error : any) {
            console.error("Signup error : " , error)
            setAuthError(
                error.errors?.[0]?.message || "An error occured during the signup . Please try again"
            )
            
        } finally{
            setIsSubmitting(false)
        }

    }

    const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!isLoaded || !signUp) return;

        if (!verificationCode || verificationCode.trim().length !== 6) {
        setVerificationError("Please enter a valid 6-digit verification code.");
        return;
    }
        setIsSubmitting(true);
        setVerificationError(null);

        try {

            const result = await signUp.attemptEmailAddressVerification({
                code : verificationCode.trim(),
            });

            console.log("Full verification result:", JSON.stringify(result, null, 2));
        console.log("Result status:", result.status);
        console.log("Result verification:", result.verifications);

            if(result.status === "complete"){
                await setActive({session : result.createdSessionId});
                router.push("/dashboard")

            } 

            
            
        } catch (error:any) {
            console.error("Verification incomplete" , error);

            if (error.errors && error.errors.length > 0) {
            setVerificationError(error.errors[0].message);
        } else if (error.message) {
            setVerificationError(error.message);
        } else {
            setVerificationError("An error occurred during verification. Please try again.");
        }
            
        }
        finally{
            setIsSubmitting(false);
        }
    }

    const renderInput = ({
            id,
            label,
            type,
            icon,
            error,
            isPassword,
            show,
            toggleVisibility,
            ...rest
            }: any) => {
            return (
                <div className="space-y-2">
                <label htmlFor={id} className="text-sm font-medium text-foreground">
                    {label}
                </label>

                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {icon}
                    </span>

                    <Input
                    id={id}
                    type={isPassword ? (show ? "text" : "password") : type}
                    className={`pl-10 pr-10 h-11 transition-colours ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-primary focus:ring-primary/20"}`}
                    {...rest}
                    />

                    {isPassword && (
                    <button
                        type="button"
                        onClick={(e) => {
                        e.preventDefault(); 
                        toggleVisibility();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 hover:text-foreground transition-colors"
                    >
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    )}
                </div>

                {error && <p className="text-sm text-red-500 flex items-center gap-1">{error}</p>}
                </div>
            );
            };


    

    if(verifying){
        return (
            <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-card">
                <CardHeader className="text-center space-y-2 pb-6">
                    <CardTitle>Verify Your Email</CardTitle>
                    <CardDescription>
                        We`ve send you a Verification code to your entered email.
                    </CardDescription>

                </CardHeader>

                <Separator />

                <CardContent className="space-y-4 py-6">
                    {verificationError && (
                        <div className="bg-red-100 text-red-700 p-3 rounded flex items-center gap-2 text-sm">
                            <AlertCircle className = "w-4 h-4" />
                            {verificationError}

                        </div>
                    )}
                    <form onSubmit={handleVerificationSubmit} className="space-y-4">
                        {renderInput({
                            id : "verificationCode",
                            label : "Verification Code",
                            type : "text",
                            value : verificationCode,
                            onChange : (e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value),
                            
                        })}

                        

                        <Button type = "submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Verifying..." : "verify email"}
                            </Button> 

                    </form>

                    <div>
                        Didn`t receive a Code?{" "}
                        <button 
                        onClick={async () => {
                            if(signUp){
                                await signUp.prepareEmailAddressVerification({
                                    strategy : "email_code",
                                });
                            }
                        }}
                        className="text-primary underline font-medium">
                            Resend
                        </button>
                    </div>
                </CardContent>
                



                

            </Card>

        )
        
            

            


            
            
        
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-card">
            <CardHeader className="text-center space-y-2 pb-6">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <User className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Create Account</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Join CloudNest to start managing your files

                </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-6 py-6">
                {authError && (
                    <div className="bg-red-100 text-red-700 p-3 rounded flex items-center gap-2 text-sm"> 
                        <AlertCircle className="w-4 h-4" />
                        {authError}
                    </div>
                )}

                <CardContent className="py-6 space-y-6">
                    <SocialButtons />
                    <div className="flex items-center gap-4">
    <Separator className="flex-1" />
    <span className="text-xs text-muted-foreground">or continue with email</span>
    <Separator className="flex-1" />
  </div>

                </CardContent>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {renderInput({
                        id : "email",
                        label : "Email",
                        type : "email",
                        icon : <Mail className="h-4 w-4" />,
                        error : errors.identifier?.message,
                        ...register("identifier"),
                    })}
                    {renderInput({
                        id : "password",
                        label : "Password",
                        type : "password",
                        icon : <Lock className="h-4 w-4" />,
                        isPassword : true,
                        show : showPassword ,
                        toggleVisibility : () => setShowPassword((prev) => !prev),
                        error : errors.password?.message,
                        ...register("password"),
                    })}
                    {renderInput({
                        id : "passwordConfirmation",
                        label : "Confirm Your Password",
                        type : "password",
                        icon : <Lock className="h-4 w-4" />,
                        isPassword : true,
                        show : showConfirmPassword,
                        toggleVisibility: () => setShowConfirmPassword((prev)=> !prev),
                        error : errors.passwordConfirmation?.message,
                        ...register("passwordConfirmation"),
                    })}

                    <div>
                        <CheckCircle className="h-4 w-4 mt-0.5 text-primary" />
                        <p className="text-xs text-muted-foreground text-center mt-4">
                                By signing up, you agree to CloudNest`s{" "}
                                <a
                                    href="/terms"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-primary"
                                >
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a
                                    href="/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-primary"
                                >
                                    Privacy Policy
                                </a>.
                         </p>


                    </div>

                    <div id="clerk-captcha" className="my-4" />

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account" : "Create Account"}
                    </Button>

                </form>
            </CardContent>
            <Separator />
            <CardFooter className="justify-center text-sm py-4">
                Already connected to us?{" "}
                <Link href = "/sign-in" className = "text-primary ml-1 hover:underline ">
                Sign In</Link>
            </CardFooter>
        </Card>
    );
}