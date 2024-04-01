"use client";
import { Button } from '@/components/ui/button'
import { CircleCheckBig } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Confiramtion = () => {
    const router = useRouter();

    return (
        <div className='w-screen flex flex-col gap-4 mt-40 items-center justify-center'>
            <CircleCheckBig className='text-green-600 w-10 h-10' />
            <h2 className="text-bold text-2xl w-full text-center">Your meeting scheduled successfully!</h2>
            <p className="text-gray-500 mt-10 text-sm">Continue to Dashboard</p>
            <Button onClick={() => router.replace('/')}>Go Home</Button>
        </div>
    )
}

export default Confiramtion