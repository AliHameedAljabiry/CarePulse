'use client'

import { Control } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import React, { ReactNode, useState } from 'react'
import { FormFieldType } from './forms/AuthForm'
import Image from 'next/image'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import '../styles/phone-input-dark.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Check, Eye, EyeOff } from 'lucide-react'
import { Checkbox } from './ui/checkbox'
import { Button } from './ui/button'





interface CustomProps {
    control: Control<any>,
    name: string,
    label?: string,
    placeholder?: string,
    type: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    required?: boolean,
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?: React.ReactNode, 
    renderSkeleton?: (field: any) => React.ReactNode
   
 
}



const RenderField = ({ field, props}: {field: any, props: CustomProps}) => {
    const { control, name, label, placeholder, type, iconSrc, iconAlt, disabled, required, dateFormat, showTimeSelect, children, renderSkeleton } = props;
    const [showPassword, setShowPassword] = useState(false);

    switch (type) {
        case FormFieldType.INPUT:
            return (
                <div className='flex rounded-md border items-center max-h-12 bg-[#fafafa] dark:border-dark-500 dark:bg-dark-400   shadow px-3'>
                    {iconSrc && iconAlt && 
                    <Image src={iconSrc} alt={iconAlt} width={24} height={24} className='invert dark:invert-0' style={{width: '24px', height: '24px'}} />}
                    <Input
                        placeholder={placeholder}
                        type={type}
                        {...field}
                        className='shad-input border-0 bg-inherit '
                        required
                    />
                </div>
            )
        case FormFieldType.PASSWORD:
            return (
                <div className=' relative flex rounded-md border items-center max-h-12 bg-[#fafafa] dark:border-dark-500 dark:bg-dark-400   shadow '>      
                    <Input required type={showPassword ? "text" : type} {...field} className="shad-input  border-0 bg-inherit" placeholder={placeholder} />
                    <Button 
                        type="button" 
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-800" 
                        tabIndex={-1} 
                        onClick={() => setShowPassword((prev) => !prev)} 
                    >
                        {showPassword ? <EyeOff className='dark:text-gray-300' size={18} /> : <Eye className='dark:text-gray-300' size={18} />}
                    </Button>
                </div>
            )
        case FormFieldType.PHONE_INPUT:
            return (
                <FormControl className='bg-[#fafafa] dark:border-dark-500 dark:bg-dark-400   shadow '>
                    <PhoneInput
                        defaultCountry='IQ'
                        placeholder={placeholder}
                        international
                        withCountryCallingCode
                        onChange={field.onChange}
                        className='input-phone min-h-12 text-black  bg-[#fafafa] dark:border-dark-500 dark:bg-dark-400   shadow  '
                        value={field.value }
                        
                    /> 
                </FormControl>
            )
          
        case FormFieldType.DATE_PICKER: {
            return (
                <div className='flex items-center rounded-md border bg-[#fafafa] dark:border-dark-500 dark:bg-dark-400'>
                    <Image 
                        src="/assets/icons/calendar.svg" 
                        alt="calendar" 
                        width={24} 
                        height={24} 
                        className='ml-2 invert dark:invert-0' 
                        style={{ width: '24px', height: '24px' }}
                    />
                    <FormControl >
                        <DatePicker 
                            selected={field.value} 
                            onChange={(date) => field.onChange(date)}
                            dateFormat={dateFormat ?? 'MM/dd/yyyy'} 
                            showTimeSelect={showTimeSelect ?? false} 
                            placeholderText={placeholder}
                            timeInputLabel='Time:'
                            wrapperClassName='date-picker'
                            className='ml-2'

                        />
                    </FormControl>
                </div>
            )
        }

        case FormFieldType.SKELETON:
            return (
                renderSkeleton ? renderSkeleton(field) : null
            )

        case FormFieldType.SELECT:
            return (
                <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                        <FormControl className=' '>
                            <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="shad-select-content">
                            {children}
                        </SelectContent>
                    </Select>
                </FormControl>
            )

        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea  {...field} placeholder={placeholder} className='shad-textArea ' disabled={disabled} />
                </FormControl>
            )

        case FormFieldType.CKECKBOX:
            return (
                <FormControl>
                    <div className="flex items-center gap-4">
                        <Checkbox 
                            id={name} 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                            className="w-6 h-6 border border-gray-400 rounded data-[state=checked]:checked data-[state=checked]:border-blue-600"
                        />
                        <label htmlFor={name} className="checkbox-label">{label}</label>
                    </div>
                </FormControl>
            )
        default:
            break;
    }
}
const CustomFormField = ({...props}: CustomProps) => {
    const { control, name, label, placeholder, type, iconSrc, iconAlt, disabled, required, dateFormat, showTimeSelect, children, renderSkeleton } = props;
  return (
    <FormField control={control} name={name} render={({ field }) => (
        <FormItem className='flex-1'>
            {type !== FormFieldType.CKECKBOX && label && (
                <FormLabel className=' dark:shad-input-label'>{label}</FormLabel>
            )}
            
           <RenderField field={field} props={props} />
           <FormMessage className='shad-error'/>
        </FormItem>
    )}
/>
  )
}

export default CustomFormField

/**
 * background: linear-gradient(45deg, #4D62E5 0%, #87DDEE 45.31%, #B6F09C 100%);

 npm install react-phone-number-input --save --legacy-peer-deps
 npm install react-datepicker --save --legacy-peer-deps


 import { useRef } from "react"
 case FormFieldType.DATE_PICKER: {
            const inputRef = useRef<HTMLInputElement | null>(null)

            return (
                <div className="relative min-h-14 max-h-14">
                <Input
                    ref={inputRef}
                    type="date"
                    name={name}
                    value={field.value ? new Date(field.value).toISOString().substring(0, 10) : ""}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                    className="date-picker min-h-14 bg-dark-400 pr-12"
                />
                <Image
                    src="/assets/icons/calendar.svg"
                    alt="calendar"
                    width={28}
                    height={28}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => {
                    if (inputRef.current) {
                        // Try native showPicker() (Chromium browsers)
                        if (typeof inputRef.current.showPicker === "function") {
                        inputRef.current.showPicker()
                        } else {
                        // Fallback: just focus the input
                        inputRef.current.focus()
                        }
                    }
                    }}
                />
                </div>
              )
            }
 */