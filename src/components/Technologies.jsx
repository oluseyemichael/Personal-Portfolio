import React from 'react';
import { RiReactjsLine } from 'react-icons/ri';
import { PiFileSqlDuotone } from "react-icons/pi";
import { FaPython } from "react-icons/fa";
import { SiFlask, SiDjango } from "react-icons/si";
import { motion } from "framer-motion";

const iconVariants = (duration) => ({
    initial: { transform: 'translateY(10)' },
    animate: {
        transform: ['translateY(10px)', 'translateY(-10px)'],
        transition: {
            duration: duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
        }
    },
});

const Technologies = () => {
    return (
        <div id="technologies" className='border-b border-neutral-800 pb-24 relative'>
            <motion.h1
            whileInView={{opacity: 1, y:0}}
            initial={{ opacity:0, y:-100}}
            transition={{duration:1.5}} 
            className='my-20 text-center text-4xl'>
                Technologies
            </motion.h1>
            <motion.div
            whileInView={{opacity:1, x:0}}
            initial={{opacity:0, x:-100}}
            transition={{duration:1.5}}
             className='flex flex-wrap items-center justify-center gap-4'>
                <motion.div
                    variants={iconVariants(2.5)}
                    initial="initial"
                    animate="animate"
                    className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <RiReactjsLine className='text-7xl text-cyan-400' />
                </motion.div>
                <motion.div
                    variants={iconVariants(3)}
                    initial="initial"
                    animate="animate"
                    className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <PiFileSqlDuotone className='text-7xl text-cyan-400' />
                </motion.div>
                <motion.div
                    variants={iconVariants(6)}
                    initial="initial"
                    animate="animate"
                    className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <FaPython className='text-7xl text-yellow-300' />
                </motion.div>
                <motion.div
                    variants={iconVariants(2)}
                    initial="initial"
                    animate="animate"
                    className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <SiDjango className='text-7xl text-red-600' />
                </motion.div>
                <motion.div
                    variants={iconVariants(4)}
                    initial="initial"
                    animate="animate"
                    className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <SiFlask className='text-7xl text-red-600' />
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Technologies
