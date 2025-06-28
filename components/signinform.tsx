"use client"


import { signInSchema } from "@/schemas/signInschema";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import SocialButtons from "./social-buttons";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";





export default function SignInForm(){
    const router = useRouter();
    const {signIn , isLoaded , setActive} = useSignIn();
    const[isSubmitting , setIsSubmitting] = useState(false);
    const[authError , setAuthError] = useState<string | null>(null);
    const[showPassword , setShowPassword] = useState(false);


    const{
        register,
        handleSubmit,
        formState : {errors},
    } = useForm<z.infer<typeof signInSchema>>({
        resolver : zodResolver(signInSchema),
        defaultValues:{
            identifier : "",
            password : "",
        },
    });


    const onSubmit = async (data : z.infer<typeof signInSchema>) => {
        if(!isLoaded) return;

        setIsSubmitting(true);
        setAuthError(null);

        try {
            const result = await signIn.create({
                identifier : data.identifier,
                password : data.password,
            });

            if(result.status === "complete"){
                await setActive({session : result.createdSessionId});
                router.push("/dashboard");
            }
            else{
                setAuthError("Sign-in could not be completed. Please try again");
            }
            
        } catch (error:any) {
            setAuthError(
                error.errors?.[0]?.message || "An error occured during sign-in . Please try again"
            );
            
        }
        finally{
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader className="text-center space-y-1">
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Sign in to access your secure cloud storage
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="py-6 space-y-6">
        <SocialButtons />

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs text-gray-500">
            or continue with email
          </span>
          <Separator className="flex-1" />
        </div>

        {authError && (
          <div className="bg-red-100 text-red-700 p-3 rounded flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="identifier" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="identifier"
                type="email"
                placeholder="your.email@example.com"
                className={`pl-10 ${errors.identifier ? "border-red-500" : ""}`}
                {...register("identifier")}
              />
            </div>
            {errors.identifier && (
              <p className="text-sm text-red-500">{errors.identifier.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>

      <Separator />

      <CardFooter className="justify-center text-sm py-4">
        Don’t have an account?{' '}
        <Link href="/sign-up" className="ml-1 text-primary hover:underline font-medium">
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
    
    }
