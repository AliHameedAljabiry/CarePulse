'use client'
import {  specialtyFormValidation} from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form} from '../ui/form'
import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { FormFieldType } from './AuthForm'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { toast } from "@/hooks/use-toast";
import { createSpecailty } from '@/lib/actions/createSpecailty'
import { updateSpecailty } from '@/lib/actions/updateSpecailty'


interface SpecialtyFormProps {
  type: "create" | "update" | string;
  specialty?: any;
  clinicId: any;
  onSuccess?: () => void;

}

const SpecialtyForm = ({specialty, type, clinicId, onSuccess}: SpecialtyFormProps) => {
    const router = useRouter();
    const [isLoading, setIsLoadeing] = useState(false)
    const form = useForm<z.infer<typeof specialtyFormValidation>>({
        resolver: zodResolver(specialtyFormValidation),
            defaultValues: {
               specialty: specialty.specialty || ''
            }
    })
  
    const onSubmit = async (values: any) => {
        console.log(values)
        setIsLoadeing(true)
        try {
            if (type === "create") {
                const res = await createSpecailty(values, clinicId);
    
                if (!res.success) {
                    toast({ title: "Error", description: res.error ?? "Failed to register clinic", variant: "destructive" });
                    return;
                }
                if (onSuccess) {
                    onSuccess(); 
                    }else {
                    router.refresh();
                }
                toast({ title: "Specialty added", description: "Specialty added successfully" });
                
             } else if (type === "update") {
                const res = await updateSpecailty(values, specialty.id, clinicId);
     
                if (!res.success) {
                     toast({ title: "Error", description: res.error ?? "Failed to update Specialty", variant: "destructive" });
                     return;
                }
                
                if (onSuccess) {
                    onSuccess(); 
                }else {
                 router.refresh();
                }
                 toast({ title: "Specialty registered", description: "Specialty updated successfully" });
                // router.push(`/patients/${currentUser.id}/register`); 
             }
        } catch (err: any) {
            console.error("onSubmit error:", err);
            toast({ title: "Unexpected error", description: err?.message ?? String(err), variant: "destructive" });
        } finally {
            setIsLoadeing(false);
        }
        

    }


  return (
   <div className='dark:text-white '>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit) } className='space-y-6 flex-1 pb-10 bg-white dark:bg-[#121618] p-3 rounded-lg mb-2'>               
                <section className='space-y-2'>
                    <CustomFormField 
                        type={FormFieldType.INPUT}
                        label="Specialty"
                        name="specialty"
                        placeholder="Enter specialty name"
                        control={form.control}
                    />
                    </section>  
                <SubmitButton isLoading={isLoading }>
                    {type === "create" ? "Add Specialty" : "Update Specialty"}
                </SubmitButton>               
            </form>
        </Form>       
    </div>
  )
}

export default SpecialtyForm