'use client';
import { IKImage } from 'imagekitio-next';
import config from '@/lib/config';
import React from 'react'

const IdentificationDocument = ({ documentUrl }: { documentUrl: string | null }) => {
  return (
    <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
        {documentUrl ? (    
            <IKImage 
                path={documentUrl} 
                urlEndpoint={config.env.imagekit.urlEndpoint}
                alt='Identification Document' 
                fill
                className=''
                loading='lazy'
                lqip={{active: true}}
            />
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-sm dark:text-white">No Identification Document Uploaded</p>
            </div>
        )}
    </div>
  )
}

export default IdentificationDocument;