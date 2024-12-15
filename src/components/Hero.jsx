import React from 'react'
import {HERO_CONTENT} from '../constants'
import profilePic from '../assets/profilePic.jpeg'
import { motion } from "framer-motion"

const Hero = () => {
    return (
        <div id="home" className='border-b border-neutral-900 pb-4 lg:mb-35'>
            <div className='flex flex-wrap'>
                <div className='w-full lg:w-1/2'>
                    <div className='flex flex-col items-center lg:items-start'>
                        <motion.h1 initial={{x: -100, opacity:0}} animate={{x: 0, opacity: 1}} transition={{durationn: 0.5, delay:1}} className='pb-16 text-6xl font-thin tracking-tight lg:m-16 lg:text-7xl'>Michael Oluseye</motion.h1>
                        <motion.span  className='bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-3xl tracking-tight text-transparent'>Full Stack Developer| IT Specialist </motion.span>
                        <p className='my-2 max-w-xl py-6'> {HERO_CONTENT} </p>
                    </div>
                </div>
                <div className='w-full lg:w-1/2 lg:p-8'>
                    <div className='flex justfy-center'>
                        <img src={profilePic} alt="Michael Oluseye" width={450} height={150}/>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;