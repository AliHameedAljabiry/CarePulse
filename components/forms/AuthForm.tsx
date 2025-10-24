'use client'
import React, { useState } from 'react'
import PhoneInput from 'react-phone-number-input'
import {DefaultValues, Path,  FieldValues, SubmitHandler, useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/form'
import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { useRouter } from 'next/navigation'
import { ZodType } from "zod";
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '../ui/button'
import Image from 'next/image'
import { toast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { Input } from '../ui/input'
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import { Eye, EyeOff } from 'lucide-react'
import 'react-phone-number-input/style.css'
import '../../styles/phone-input-dark.css'
import useSWR from 'swr';


export enum FormFieldType {
   INPUT = 'input',
   TEXTAREA = 'textarea',
   CKECKBOX = 'checkbox',
   PHONE_INPUT = 'phoneInput',
   DATE_PICKER = 'datePicker',
   SELECT = 'select',
   SKELETON = 'skeleton',
   PASSWORD = 'password',
   LOCATION = 'location'
}

interface Props<T extends FieldValues> {
    type: 'SIGN_IN' | 'SIGN_UP';
    schema: ZodType;
    defaultValues: T
    onSubmit: (data: T) => Promise<{ success: boolean; message?: string }>;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const AuthForm = <T extends FieldValues> ({type, schema, defaultValues, onSubmit}: Props<T>) => {
    const { data: currentUser } = useSWR('/api/auth/authorized-user', fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });

    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter()
    const [isLoading, setIsLoadeing] = useState(false)

    const isSignIn = type === 'SIGN_IN';

    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    })



    const handleSubmit: SubmitHandler<T> = async (data) => {
        const result = await onSubmit(data);
    
        if (result.success) {
            toast({
                title: "Success",
                description: isSignIn
                ? "You have successfully signed in."
                : "You have successfully signed up.",
            });

            if (currentUser) {
                router.push(`/${currentUser.id}/register`);
            } else {
                console.log("currentUser is null after successful operation");
                router.refresh();
            }
        } else {
            toast({
                title: `Error ${isSignIn ? 'Signing In' : 'Signing Up'}`,
                description: result.message || "An error occurred. Please try again.",
                variant: 'destructive',
            })
        }
    }


    const signInWithGoogle = async () => {
        try {
            await signIn("google");
            if (currentUser) {
                router.refresh();
                router.push(`/${currentUser.id}/register`);
            } 
               
          
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            toast({
                title: "Error Signing In with Google",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        }
    };

    const signInWithFacebook = async () => {
        try {
            await signIn("facebook");
            if (currentUser) {
                router.push(`/${currentUser.id}/register`);
            } else {
                console.log("currentUser is null after successful operation");
                router.refresh();
            }
        } catch (error) {
            console.error("Facebook Sign-In Error:", error);
            toast({
                title: "Error Signing In with Facebook",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        }
    };



  return (
    <div className='dark:text-white flex flex-col gap-4'>
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-white text-center">
                {isSignIn ? "Welcome back to CarePulse" : "Create your account"}
            </h1>
        <Form {... form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6">
                {Object.keys(defaultValues).map((field) => (
                    <FormField key={field} control={form.control} name={field as Path<T>} render={({ field }) => {
                            return (
                            <FormItem>
                                <FormLabel className="capitalize dark:shad-input-label">
                                    {FIELD_NAMES[field.name as keyof typeof FIELD_TYPES] || field.name}
                                </FormLabel>
                                <FormControl>
                                    {field.name === "password" || field.name === "confirmPassword" ? (
                                        <div className="relative flex rounded-md border items-center max-h-12 bg-[#fafafa] dark:border-dark-500 dark:bg-dark-400   shadow">
                                            <Input required type={showPassword ? "text" : "password"} {...field} className="shad-input  border-0 bg-inherit" />
                                            <Button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-800" tabIndex={-1} onClick={() => setShowPassword((prev) => !prev)} >
                                                {showPassword ? <EyeOff className='dark:text-gray-300' size={18} /> : <Eye className='dark:text-gray-300' size={18} />}
                                            </Button>
                                        </div>
                                    ) : field.name === "phoneNumber" ? (
                    
                                        <PhoneInput
                                            defaultCountry='IQ'
                                            placeholder="Enter Your phone Number"
                                            international
                                            withCountryCallingCode
                                            onChange={field.onChange}
                                            className='input-phone min-h-12 text-black  bg-[#fafafa] dark:border-dark-500 dark:bg-dark-400   shadow  '
                                            value={field.value }
                                            required
                                            
                                        /> 
                                        
                                    ): field.name === "email" ? (
                                       <div className='flex rounded-md border items-center max-h-12 bg-[#fafafa] dark:border-dark-500 dark:bg-dark-400   shadow px-3'>
                                            
                                            <Image src="/assets/icons/email.svg" alt="email" width={24} height={24} className='invert dark:invert-0' style={{width: '24px', height: '24px'}} />
                                            <Input
                                                type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                                                placeholder="alihameed@gmail.com"
                                                {...field}
                                                className='shad-input border-0 bg-inherit '
                                                required
                                            />
                                        </div>
                                    ) : (
                                        <div className='flex rounded-md border items-center max-h-12 bg-[#fafafa] dark:border-dark-500 dark:bg-dark-400   shadow px-3'>
                                            
                                            <Image src="/assets/icons/user.svg" alt="email" width={24} height={24} className='invert dark:invert-0' style={{width: '24px', height: '24px'}} />
                                            <Input
                                                type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                                                placeholder="alihameed@gmail.com"
                                                {...field}
                                                className='shad-input border-0 bg-inherit '
                                                required
                                            />
                                        </div>
                                    )}
                                    </FormControl>
                                <FormMessage className='shad-error'/>
                            </FormItem>
                        );
                        
                        }}
                    />
                ))}
                <SubmitButton isLoading={isLoading}>
                    {isSignIn ? "Sign In" : "Sign Up"}
                </SubmitButton>
        
            </form>
        </Form>

        
        <p className={cn("text-center text-base font-medium flex flex-row items-center  gap-2 ",isSignIn ?"justify-between " : "justify-center")}>
            <span>
                {isSignIn 
                    ?<Link 
                        href="/forgot-password" 
                        className={cn(isSignIn ? "underline text-blue-400 dark:text-[#E7C9A5]" : "dark:text-gray-300")}
                    >
                    Forgot your password?
                    </Link>
                   : "Already have an account? "
                }

            </span>
            <Link
                href={isSignIn ? "/sign-up" : "/sign-in"}
                className="font-bold dark:text-[#E7C9A5] text-blue-400 underline"
                >
                {isSignIn ? "Create an account" : "Sign in"}
            </Link>
        </p>
        {isSignIn &&<h1 className='w-full text-center mt-10'>Or</h1>}
        {isSignIn && (
            <div className="flex flex-col items-center justify-center gap-2 w-full  space-y-4 mt-5">
                    
            <Button 
                variant="outline" 
                title="Sign In with your Google account" 
                className=" text-gray-700 dark:text-gray-300  h-[55px] text-lg bg-light-300 dark:bg-dark-400 flex flex-row gap-2 items-center justify-center w-full dark:border-dark-500  p-2 rounded-md" 
                onClick={() => signInWithGoogle()}>
                <Image src="/assets/icons/google-icon.svg" alt="Google Icon" width={24} height={24} 
                />
                Continue with Google
            </Button>
            <Button 
                variant="outline" 
                title="Sign In with your Facebook account" 
                className=" text-gray-700 dark:text-gray-200  h-[55px] text-lg   flex flex-row gap-2 items-center justify-center dark:border-dark-500 w-full bg-light-300 dark:bg-dark-400 p-2 rounded-md" 
                onClick={() => signInWithFacebook()}
                >
                <Image src="/assets/icons/facebook.svg"  alt="Google Icon" width={33} height={33} />
                Continue with Facebook
            </Button>
                
        </div>
        )
     }
    </div>
  )
}

export default AuthForm;