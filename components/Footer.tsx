'use client'
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";


const Footer = () => {

    // set gmail link
    const emailAddress = "alihameed7121996programmer@gmail.com";
    const subject = encodeURIComponent('Subject Here');
    const body = encodeURIComponent('Body of the email goes hrer.');
    // gamil link format
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}&su=${subject}&body=${body}`;

    // set linkedin url
    const linkedinUrl = "https://www.linkedin.com/in/ali-hameed-225706318";

    // set Whatsapp url
    const phoneNumber = "+964 781 172 9815";
    const message = 'Hello! I would like to know more about your services.';
    // remove white spaces from the number
    const formattedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    const whatsappLink = `https://wa.me/${formattedPhoneNumber}?text=${message}`;
  // bg-[#ffffff]
    return (
       <footer className="w-full bg-[#fafafa] shadow-md dark:bg-[#080808] text-black dark:text-white py-16 border-t border-t-slate-200 dark:border-t-dark-600">
        <div className=" w-full px-4 sm:px-6 lg:px-8">
          <div className=" grid  xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ml-10 gap-16 justify-center  items-center">
            <div className="flex flex-col items-center">
                <Link href="/" className="text-xl lg:text-2xl flex flex-row items-center ">
                  <div className='flex items-center gap-2'>
                      <Image src="/assets/icons/logo-icon.svg" alt="Patient"  width={160} height={160} className=" h-10 w-fit"/>
                      <p className="text-2xl font-bold dark:text-white">CarePulse</p>
                  </div>
                  
                </Link>
                
              <p className="dark:text-slate-400 leading-relaxed mt-3 text-center">
                A healthcare management system for modern clinics..
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <h3 className="font-semibold mb-4 ">Connect</h3>
              <div className="flex space-x-4 ">
                <Link href={gmailLink} target="_blank" rel="noopener noreferrer">
                    <Image src="/assets/images/gmail.png" alt="gmail"  width={30} height={30} style={{ width: '30px', height: '30px' }} />
                </Link>

                <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Image src="/assets/icons/linkedIn.svg" alt="gmail"  width={30} height={30}/>
                </Link>

                <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Image src="/assets/icons/whatsapp.svg" alt="gmail"  width={30} height={30}/>
                </Link>
              </div>
            </div>
            

            <div className=" flex flex-col items-center">
              <h3 className="font-semibold mb-4 ">Rights</h3>
              <div className=" flex flex-col gap-5 justify-between items-center ">
                  <p className="dark:text-slate-400 text-sm">© 2025 CarePulse. All rights reserved.</p>
                  <div className="flex space-x-6 text-sm dark:text-slate-400  ">
                      <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                      <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                  </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center ">
              <ThemeToggle/>
            </div>
          </div>
        </div>
      </footer>
    )
}

export default Footer


