'use client'
import { PatientFormValidation } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl } from '../ui/form'
import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { FormFieldType } from './AuthForm'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from '@/constants'
import { Label } from '../ui/label'
import { SelectItem } from '../ui/select'
import Image from 'next/image'
import FileUpload from '../FileUploader'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { registerPatient } from '@/lib/actions/createPatient'
import { toast } from "@/hooks/use-toast";

const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json()
});


const RegisterForm = () => {

    const { data: currentUser, error, isLoading: userLoading} = useSWR('/api/auth/authorized-user', fetcher, {
        refreshInterval: 3000,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
    });
        

    const router = useRouter();
    const [isLoading, setIsLoadeing] = useState(false)
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
            defaultValues: {
                ...PatientFormDefaultValues,
                 phone: "",   
            },     
    })

    const onSubmit = async (values: any) => {
        console.log(values)
        setIsLoadeing(true)
        try {
            const payload = {
                ...values,
                userId: currentUser.id,
                phone: values.phone ?? undefined, // optional phone field
            };

            const res = await registerPatient(payload);

            if (!res.success) {
                toast({ title: "Error", description: res.error ?? "Failed to register patient", variant: "destructive" });
                return;
            }

            toast({ title: "Patient registered", description: "Patient registered successfully" });
            router.push(`/patients/${currentUser.id}/new-appointment`); // or wherever
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
                    {!currentUser?.phoneNumber || currentUser?.phoneNumber === "-" &&
                        <div className='w-full md:w-1/2'>
                            <CustomFormField
                                type={FormFieldType.PHONE_INPUT}
                                control={form.control}
                                name="phone"
                                label="Phone Number"
                                placeholder="(555) 123-4567"
                                />
                        </div>
                    }

                    <div className='flex flex-col md:flex-row gap-6'>
                        <CustomFormField 
                            type={FormFieldType.DATE_PICKER}
                            label='Date of Birth'
                            name='birthDate'
                            control={form.control}
                            placeholder='Select your birth date'
                            />
                        <CustomFormField 
                            type={FormFieldType.SKELETON}
                            label='Gender'
                            name='gender'
                            control={form.control}
                            renderSkeleton={(field) => (
                                <FormControl>
                                    <RadioGroup className='flex h-11 gap-6 xl:justify-between '
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >     
                                        {GenderOptions.map((option) => (
                                        <div key={option} className="radio-group flex items-center gap-2">
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

                    <div className='flex flex-col md:flex-row gap-6'>
                        <CustomFormField 
                            type={FormFieldType.INPUT}
                            label="Address"
                            name="address"
                            placeholder="ex: 14 street, New York, NY - 5101"
                            control={form.control}
                            />
                        <CustomFormField 
                            type={FormFieldType.INPUT}
                            label="Occupation"
                            name="occupation"
                            placeholder="Software Engineer"
                            control={form.control}
                            />
                    </div>
                    
                    <div className='flex flex-col md:flex-row gap-6'>
                        <CustomFormField 
                            type={FormFieldType.INPUT}
                            label="Emergency contact name"
                            name="emergencyContactName"
                            placeholder="Guardian’s name"
                            control={form.control}
                            />

                        <CustomFormField 
                            type={FormFieldType.PHONE_INPUT}
                            label='Emergency Phone number'
                            name='emergencyContactNumber'
                            placeholder='+964 781 172 9815'
                            control={form.control}
                        />
                    </div>

                </section>
                <section className='space-y-6'>
                    <div className='mb-9 space-y-1'>
                        <h2 className='sub-header'>Medical Information</h2>
                    </div>

                    <CustomFormField
                        type={FormFieldType.SELECT}
                        label='Primary care physician'
                        name='primaryPhysician'
                        control={form.control}
                        placeholder='Select a physician'
                        >
                    {Doctors.map((doctor, i) => (
                        <SelectItem key={i} value={doctor.name} className='dark:text-white'>
                            <div className='flex cursor-pointer items-center gap-2'>
                                <Image  src={doctor.image} alt={doctor.name} width={32} height={32} className='rounded-full border border-dark-500'/>
                                <p>{doctor.name}</p>
                            </div>
                        </SelectItem>
                    ))} 
                    </CustomFormField>

                    <div className='flex flex-col md:flex-row gap-6'>
                        <CustomFormField 
                            type={FormFieldType.INPUT}
                            label="Insurance provider"
                            name="insuranceProvider"
                            placeholder="ex: BlueCross"
                            control={form.control}
                        />
                        <CustomFormField 
                            type={FormFieldType.INPUT}
                            label="Insurance policy number"
                            name="insurancePolicyNumber"
                            placeholder="ex: ABC1234567"
                            control={form.control}
                        />
                    </div>
                    <div className='flex flex-col md:flex-row gap-6'>
                        <CustomFormField 
                            type={FormFieldType.TEXTAREA}
                            label="Allergies (if any)"
                            name="allergies"
                            placeholder="ex: Peanuts, Penicillin, Pollen"
                            control={form.control}
                        />
                        <CustomFormField 
                            type={FormFieldType.TEXTAREA}
                            label="Current medications"
                            name="currentMedication"
                            placeholder="ex: Ibuprofen 200mg, Levothyroxine 50mcg"
                            control={form.control}
                        />
                    </div>
                    <div className='flex flex-col md:flex-row gap-6'>
                        <CustomFormField 
                            type={FormFieldType.TEXTAREA}
                            label="Family medical history (if relevant)"
                            name="familyMedicalHistory"
                            placeholder="ex: Mother had breast cancer"
                            control={form.control}
                        />
                        <CustomFormField 
                            type={FormFieldType.TEXTAREA}
                            label="Past medical history"
                            name="pastMedicalHistory"
                            placeholder="ex: Asthma diagnosis in childhood"
                            control={form.control}
                        />
                    </div>
                </section>

                <section className='space-y-6'>
                    <div className='mb-9 space-y-1'>
                        <h2 className='sub-header'>Identification and Verfication</h2>
                    </div>

                    <CustomFormField
                        type={FormFieldType.SELECT}
                        label='Identification type'
                        name='identificationType'
                        control={form.control}
                        placeholder='Birth Certificate'
                    >
                        {IdentificationTypes.map((type, i) => (
                            <SelectItem key={i} value={type}>{type}</SelectItem>
                        ))}
                    </CustomFormField>

                    <CustomFormField 
                        type={FormFieldType.INPUT}
                        label="Identification Number"
                        name="identificationNumber"
                        placeholder="ex: 123456789"
                        control={form.control}
                    />

                    <CustomFormField 
                        type={FormFieldType.SKELETON}
                        label="Scanned copy of the identification document"
                        name="identificationDocument"
                        control={form.control}
                        renderSkeleton={(field) => (
                            <FormControl>
                                <FileUpload
                                    type="image"
                                    accept="image/*"
                                    placeholder="Click to upload or drag and drop SVG, PNG, JPG or GIF (max. 800x400px)"
                                    folder="patients/identifications"
                                    variant="light"
                                    onFileChange={field.onChange}
                                    value={field.value}
                                    />
                            </FormControl>
                        )}
                    />
                </section>
                
                <section className='space-y-6'>
                    <div className='mb-9 space-y-1'>
                        <h2 className='sub-header'>Consent and Privacy</h2>
                    </div>

                    <CustomFormField 
                        type={FormFieldType.CKECKBOX}
                        label="I consent to receive treatment for my health condition."
                        name="treatmentConsent"
                        control={form.control}
                    />
                    <CustomFormField 
                        type={FormFieldType.CKECKBOX}
                        label="I consent to the use and disclosure of my health information for treatment purposes."
                        name="disclosureConsent"
                        control={form.control}
                    />
                    <CustomFormField 
                        type={FormFieldType.CKECKBOX}
                        label="I acknowledge that I have reviewed and agree to the privacy policy"
                        name="privacyConsent"
                        control={form.control}
                    />

                </section>
                   
                <SubmitButton isLoading={isLoading }>Get started</SubmitButton>
                
            </form>
        </Form>
        
    </div>
  )
}

export default RegisterForm