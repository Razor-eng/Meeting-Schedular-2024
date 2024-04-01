"use client";
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar'
import { Clock, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const PreviewMeeting = ({ data }) => {
    const [date, setDate] = useState(new Date());
    const [timeSlots, setTimeSlots] = useState();

    useEffect(() => {
        data?.duration && createTimeSlot(data?.duration);
    }, [data])

    const createTimeSlot = (interval) => {
        const startTime = 8 * 60;
        const endTime = 22 * 60;
        const totalSlots = (endTime - startTime) / interval;
        const slots = Array.from({ length: totalSlots }, (_, i) => {
            const totalMinutes = startTime + i * interval;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            const formattedHours = hours > 12 ? hours - 12 : hours;
            const period = hours >= 12 ? 'PM' : 'AM';

            return `${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
        });

        setTimeSlots(slots);
    }

    return (
        <div
            className='md:p-5 py-10 md:shadow-lg shadow-gray-500 rounded-t-md m-1 md:m-5 border-t-8'
            style={{ borderTopColor: data?.themeColor }}
        >
            <Image src={'/logo.png'} alt='logo' width={100} height={100} />
            <div className="grid grid-cols-1 md:grid-cols-3 mt-5">
                <div className='p-4 md:border-r'>
                    <h2>Business Name</h2>
                    <h2 className="font-bold text-2xl">
                        {data?.eventName || 'Meeting Name'}
                    </h2>

                    <div className='mt-5 flex flex-col gap-4'>
                        <h2 className="flex gap-2">
                            <Clock />
                            {data?.duration} Min
                        </h2>

                        <h2 className="flex gap-2">
                            <MapPin />
                            {data?.meetingType} Meeting
                        </h2>

                        <Link href={data?.meetingUrl || ''} className='text-primary'>{data?.meetingUrl}</Link>
                    </div>
                </div>
                <div className='md:col-span-2 flex flex-col md:flex-row md:px-4'>
                    <div className='flex flex-col'>
                        <h2 className='font-bold text-lg'>Select Date</h2>
                        <Calendar
                            mode='single'
                            selected={date}
                            onSelect={setDate}
                            className='rounded-md border mt-5'
                            disabled={(date) => date < new Date()}
                        />
                    </div>
                    <div className='mt-4 md:mt-10 ml-2 w-fit max-h-[400px]'>
                        <h2 className='font-bold text-lg md:hidden'>Select TimeSlot</h2>
                        <div className="flex flex-row md:flex-col w-full overflow-auto gap-4 p-5 max-h-[300px] md:border-none border dark:border-gray-800 border-gray-200 mt-3">
                            {timeSlots?.map((time, id) => (
                                <Button
                                    key={id}
                                    variant='outline'
                                    className='border-primary text-primary'
                                >
                                    {time}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreviewMeeting