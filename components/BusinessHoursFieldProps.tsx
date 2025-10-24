'use client'
import { Control, useFieldArray } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'


const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
] as const

export function BusinessHoursField({ control }: any) {
  return (
    <div className="space-y-4">
     <p className="text-sm text-gray-700 dark:text-gray-300">
        Set your clinic's operating hours for each day
      </p>
      <div className=" grid grid-cols-1 2xl:grid-cols-2 gap-4 ">
        {daysOfWeek.map((day) => (
          <FormField
            key={day.key}
            control={control}
            name={`businessHours.${day.key}`}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between px-0 xs:px-3 py-3 pe-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center   flex-col sm:flex-row gap-5 justify-center mx-auto">
                    <div className='flex justify-center gap-5 items-start w-full'>
                        <FormControl>
                        <Checkbox
                            checked={!field.value?.closed}
                            onCheckedChange={(checked) => {
                            field.onChange({
                                ...field.value,
                                closed: !checked
                            })
                            }}
                            className="w-5 h-5"
                        />
                        </FormControl>
                        <span className="font-medium min-w-24 dark:text-gray-300">{day.label}</span>
                    </div>
                    
                
                    {!field.value?.closed ? (
                      <div className="flex items-center space-x-2  ">
                        <FormControl>
                          <Input
                            type="time"
                            value={field.value?.open || ''}
                            onChange={(e) => field.onChange({
                              ...field.value,
                              open: e.target.value
                            })}
                            className="w-32"
                          />
                        </FormControl>
                        <span className="text-gray-500 dark:text-gray-300">to</span>
                        <FormControl>
                          <Input
                            type="time"
                            value={field.value?.close || ''}
                            onChange={(e) => field.onChange({
                              ...field.value,
                              close: e.target.value
                            })}
                            className="w-32"
                          />
                        </FormControl>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">Closed</span>
                    )}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
      
      
    </div>
  )
}