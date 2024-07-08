import React from 'react'
import { RiReactjsLine } from 'react-icons/ri'
import { PiFileSqlDuotone } from "react-icons/pi";
import { FaPython } from "react-icons/fa";
import { SiFlask } from "react-icons/si";

const Technologies = () => {
    return (
        <div id="technologies" className='border-b border-neutral-800 pb-24'>
            <h2 className='my-20 text-center text-4xl'>
                Technologies
            </h2>
            <div className='flex flex-wrap items-center justify-center gap-4'>
                <div className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <RiReactjsLine className='text-7xl text-cyan-400' />
                </div>
                <div className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <PiFileSqlDuotone className='text-7xl text-cyan-400' />
                </div>
                <div className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <FaPython className='text-7xl text-yellow-300' />
                </div>
                <div className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <SiFlask className='text-7xl text-red-600' />
                </div>
            </div>
        </div>
    )
}

export default Technologies
