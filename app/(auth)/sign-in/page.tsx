'use client';


import React from 'react'
import { signInSchema } from "@/lib/validation";
import { signInWithCredentials } from '@/lib/actions/auth';

import dynamic from 'next/dynamic';
import AuthForm from '@/components/forms/AuthForm';
const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

const SignIn = () => {
  return (
    <>
      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        className=""
      >
        <AuthForm
          type="SIGN_IN"
          schema={signInSchema}
          defaultValues={{ email: '', password: '' }}
          onSubmit={signInWithCredentials}
        /> 
      </MotionDiv>
    </>
  )
}

export default SignIn