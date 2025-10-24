'use client'
import { ClinicFormValidation} from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl} from '../ui/form'
import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { FormFieldType } from './AuthForm'
import { Countries, StatusOptions} from '@/constants'
import { SelectItem } from '../ui/select'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import ReactCountryFlag from "react-country-flag"; //npm install react-country-flag country-code-lookup --legacy-peer-deps
import { MapLocationPicker } from '../LocationPicker'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { BusinessHoursField } from '../BusinessHoursFieldProps'
import FileUpload from '../FileUploader'
import { toast } from "@/hooks/use-toast";
import { registerClinic } from '@/lib/actions/registerClinic'





const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json()
});

interface ClinicFormProps {
  type: "create" | "update" ;
  clinic?: any;

}

const ClinicForm = ({clinic, type}: ClinicFormProps) => {

    const { data: currentUser} = useSWR('/api/auth/authorized-user', fetcher, {
        refreshInterval: 3000,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
    });
    const userId = currentUser?.id

    const router = useRouter();
    const [isLoading, setIsLoadeing] = useState(false)
    const [locationData, setLocationData] = useState<{
    coordinates: [number, number] | null
    address: string
    }>({
        coordinates: [33.3152, 44.3661],
        address: ''
    })

    const form = useForm<z.infer<typeof ClinicFormValidation>>({
        resolver: zodResolver(ClinicFormValidation),
            defaultValues: {
                clinicName: '',
                clinicProfile: [],
                logo: [],
                location: '',
                city: '',
                phoneNumber: '',
                country: 'Iraq',
                address: '',
                ownerName: '',
                managerName: '',
                status: 'OPEN',
                businessHours: {
                    sunday: { open: "09:00", close: "17:00", closed: false },
                    monday: { open: "09:00", close: "17:00", closed: false },
                    tuesday: { open: "09:00", close: "17:00", closed: false },
                    wednesday: { open: "09:00", close: "17:00", closed: false },
                    thursday: { open: "09:00", close: "17:00", closed: false },
                    friday: { open: "09:00", close: "17:00", closed: true },
                    saturday: { open: "09:00", close: "13:00", closed: false },
                },
            }
    })


    // Handle location data from MapLocationPicker
    const handleLocationUpdate = (coordinates: [number, number] | null, address: string) => {
        setLocationData({ coordinates, address })
        
        // Update form fields
        form.setValue('location', coordinates ? `${coordinates[0]}, ${coordinates[1]}` : '')
        form.setValue('address', address)
    }

    const onSubmit = async (data: any) => {
        console.log(data)
        setIsLoadeing(true)
        try {
            if (type === "create") {
                const res = await registerClinic(data, locationData, userId);
    
                if (!res.success) {
                    toast({ title: "Error", description: res.error ?? "Failed to register clinic", variant: "destructive" });
                    return;
                }
    
                toast({ title: "Patient registered", description: "Clinic registered successfully" });
                // router.push(`/patients/${currentUser.id}/register`);
                
             } //else if (type === "update") {
            //     const res = await updatePatient(payload);
    
            //     if (!res.success) {
            //         toast({ title: "Error", description: res.error ?? "Failed to update patient", variant: "destructive" });
            //         return;
            //     }
    
            //     toast({ title: "Patient registered", description: "Patient updated successfully" });
            //     router.push(`/patients/${currentUser.id}/register`); 
            // }
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
            <form onSubmit={form.handleSubmit(onSubmit) } className='space-y-12 flex-1 pb-10'>
                <section className='space-y-4'>
                    <h1 className='header'>Welcome {currentUser?.fullName} 👋</h1>
                    <p className='text-dark-700'>Thank you for using CarePulse! You are currently signed in with these info:</p>
                    <div className='flex flex-col gap-1 text-sm'>
                        <span className='text-dark-700'>Email: {currentUser?.email}</span>
                        {currentUser?.phoneNumber && currentUser?.phoneNumber !== "-" && <span className='text-dark-700'>Phone number: {currentUser?.phoneNumber}</span>}          
                    </div>
                </section>
                <section className='space-y-6'>
                    <div className='mb-9 space-y-1'>
                        <h2 className='sub-header'>Personal information</h2>
                    </div>
                    <div className='flex flex-col md:flex-row gap-6'>
                        <CustomFormField 
                            type={FormFieldType.INPUT}
                            label="ClinicName"
                            name="clinicName"
                            placeholder="Enter your clinic name"
                            control={form.control}
                        />
                        <CustomFormField 
                            type={FormFieldType.INPUT}
                            label="Owner Name"
                            name="ownerName"
                            placeholder="Ali Hameed"
                            control={form.control}
                        />
                    </div>
                    <div className='flex flex-col md:flex-row gap-6'>
                        <CustomFormField 
                            type={FormFieldType.INPUT}
                            label="Manager Name"
                            name="managerName"
                            placeholder="Ali Hameed"
                            control={form.control}
                        />
                        <CustomFormField
                            type={FormFieldType.PHONE_INPUT}
                            control={form.control}
                            name="phoneNumber"
                            label="Phone Number"
                            placeholder="(555) 123-4567"
                            />
                    </div>
                    

                    <div className='flex flex-col md:flex-row gap-6'>
                        <CustomFormField
                            type={FormFieldType.SELECT}
                            label="Country"
                            name="country"
                            placeholder="Select Your Country"
                            control={form.control}
                            >
                            {Countries.map((country, i) => (
                                <SelectItem key={i} value={country.name} className='dark:text-white'>
                                    <div className='flex cursor-pointer items-center gap-2'>
                                       <ReactCountryFlag countryCode={country.code} svg />
                                       {country.name}
                                    </div>
                                </SelectItem>
                            ))} 
                            </CustomFormField>

                        <CustomFormField 
                            type={FormFieldType.INPUT}
                            label="City"
                            name="city"
                            placeholder="Enter Your City"
                            control={form.control}
                            />
                    </div>
                    
                    <div className='flex flex-col md:flex-row gap-6'>
                        <CustomFormField 
                            type={FormFieldType.INPUT}
                            label="Address"
                            name="address"
                            placeholder="ex: 14 street, New York, NY - 5101"
                            control={form.control}
                            />

                    </div>
                    
                </section>
                            
                <section className='space-y-6 border-t pt-3 border-b pb-5'>
                     <div className='mb-9 space-y-1'>
                        <h2 className='sub-header'>Clinic Location</h2>
                    </div>
                        <MapLocationPicker 
                            onLocationUpdate={handleLocationUpdate}
                            initialCoordinates={locationData.coordinates}
                        />
                </section>

                <section className='space-y-6 border-b pb-5'>
                     
                    {/* Business Information Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Business Information</h2>
                        
                        <div className="">
                            <CustomFormField
                                control={form.control}
                                name="status"
                                label="Clinic Status *"
                                placeholder="Select status"
                                type={FormFieldType.SKELETON}
                                required
                                sceletonType="statu"
                                 renderSkeleton={(field) => (
                                    <FormControl>
                                        <RadioGroup className='flex flex-wrap gap-4 xl:justify-between w-full '
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >     
                                            {StatusOptions.map((option) => (
                                            <div key={option} className="radio-group flex items-center gap-2 min-w-fit">
                                                <RadioGroupItem
                                                value={option}
                                                id={option}
                                                className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-400 dark:border-gray-200
                                                    data-[state=checked]:checked data-[state=checked]:border-blue-600"
                                                />
                                                <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                                            </div>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                )}
                              />
                               
                        </div>
                    </div>
                                
                </section>

                {/* Midea Section */}
                <section className='space-y-6  pt-3 border-b pb-5'>
                     <div className='mb-9 space-y-1'>
                        <h2 className='sub-header'>Midea</h2>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                        <CustomFormField 
                            type={FormFieldType.SKELETON}
                            label="Scanned copy of the clinic Profile Image"
                            name="clinicProfile"
                            defaultID={clinic ? clinic.clinicProfile : null}
                            sceletonType="ID"
                            control={form.control}
                            renderSkeleton={(field) => (
                                <FormControl>
                                    <FileUpload
                                        type="image"
                                        accept="image/*"
                                        placeholder="Click to upload or drag and drop SVG, PNG, JPG or GIF (max. 800x400px)"
                                        folder="clinics/profiles"
                                        variant="light"
                                        onFileChange={field.onChange}
                                        value={field.value}
                                        />
                                </FormControl>
                            )}
                        />
                        <CustomFormField 
                            type={FormFieldType.SKELETON}
                            label="Scanned copy of the clinic Logo Image"
                            name="logo"
                            defaultID={clinic ? clinic.logo : null}
                            sceletonType="logo"
                            control={form.control}
                            renderSkeleton={(field) => (
                                <FormControl>
                                    <FileUpload
                                        type="image"
                                        accept="image/*"
                                        placeholder="Click to upload or drag and drop SVG, PNG, JPG or GIF (max. 800x400px)"
                                        folder="clinics/logos"
                                        variant="light"
                                        onFileChange={field.onChange}
                                        value={field.value}
                                        />
                                </FormControl>
                            )}
                        />
                    </div>       
                </section>
                <section className='space-y-6  pt-3 border-b pb-5'>
                     <div className='mb-9 space-y-1'>
                        <h2 className='sub-header'>Business Hours</h2>
                    </div>
                    <BusinessHoursField control={form.control} />
                </section>
        
                   
                <SubmitButton isLoading={isLoading }>
                    {type === "create" ? "Get started" : "Update Patient Information"}
                </SubmitButton>
                
            </form>
        </Form>
        
    </div>
  )
}

export default ClinicForm