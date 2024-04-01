"use client"
import LocationOptions from '@/app/_utils/LocationOptions'
import ThemeOptions from '@/app/_utils/ThemeOptions'
import { db } from '@/app/firebase'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const MeetingForm = ({ setFormValue, user }) => {
    const [eventName, setEventName] = useState('');
    const [time, setTime] = useState(30);
    const [meetingType, setMeetingType] = useState('');
    const [meetingUrl, setMeetingUrl] = useState('');
    const [themeColor, setThemeColor] = useState('');
    const router = useRouter();

    useEffect(() => {
        setFormValue({
            eventName: eventName,
            duration: time,
            meetingType: meetingType,
            meetingUrl: meetingUrl,
            themeColor: themeColor
        })
    }, [eventName, time, meetingType, meetingUrl, themeColor])

    const CreateMeeting = async () => {
        const id = Date.now().toString();
        if ((eventName && meetingType && meetingUrl && themeColor) !== '') {
            try {
                await setDoc(doc(db, 'MeetingEvent', user.uid, 'meeting', id), {
                    id: id,
                    eventName: eventName,
                    duration: time,
                    meetingType: meetingType,
                    meetingUrl: meetingUrl,
                    themeColor: themeColor,
                    businessId: doc(db, 'Business', user.uid)
                }).then(() => {
                    toast.success('Meeting Created Successfully...!')
                    router.replace('/dashboard/meeting-type')
                });
            } catch (error) {
                alert(error.message);
            } finally {
                setEventName('');
                setTime(30);
                setMeetingType('');
                setMeetingUrl('');
                setThemeColor('');
            }
        }
    };


    return (
        <div className='p-4'>
            <Link href={'/dashboard'}>
                <h2 className="flex gap-2 hover:bg-gray-500 rounded-lg w-fit py-3 pr-3">
                    <ChevronLeft /> Back
                </h2>
            </Link>
            <div className="mt-4">
                <h2 className="font-bold text-2xl my-4">Create New Event</h2>
                <hr />
            </div>
            <div className="flex flex-col gap-3 my-4">
                <h2 className='font-bold'>Event Name *</h2>
                <input
                    type="text"
                    placeholder='Name of your meeting event'
                    className='border border-gray-300 outline-gray-400 p-3 rounded-xl mb-4 w-full'
                    value={eventName}
                    onChange={e => setEventName(e.target.value)}
                />

                <h2 className="font-bold">Duration *</h2>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className='outline-none'>
                        <Button variant='outline' className='max-w-40 dark:bg-zinc-700'>{time} Min</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setTime(15)}>15 Min</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTime(30)}>30 Min</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTime(45)}>45 Min</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTime(60)}>60 Min</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <h2 className="font-bold">Location *</h2>
                <div className="grid grid-cols-4 gap-3">
                    {LocationOptions.map((option, id) => (
                        <div
                            key={id}
                            className={`border flex flex-col justify-center items-center p-3 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-zinc-700 hover:border-primary ${meetingType === option.name ? 'bg-blue-100 border-primary dark:bg-zinc-800 dark:border-transparent' : ''}`}
                            onClick={() => setMeetingType(option.name)}
                        >
                            <Image src={option.icon} width={30} height={30} alt={option.name} />
                            <h2>{option.name}</h2>
                        </div>
                    ))}
                </div>

                {meetingType &&
                    <>
                        <h2 className="font-bold">Add Url *</h2>
                        <input
                            type="text"
                            placeholder={`Add ${meetingType} Url`}
                            className='border border-gray-300 outline-gray-400 p-3 rounded-xl mb-4 w-full'
                            value={meetingUrl}
                            onChange={e => setMeetingUrl(e.target.value)}
                        />
                    </>
                }

                <h2 className='font-bold'>Select Theme Color</h2>
                <div className='flex justify-evenly'>
                    {ThemeOptions.map((color, id) => (
                        <div
                            key={id}
                            className={`h-7 w-7 rounded-full cursor-pointer ${themeColor === color ? 'border-2 border-zinc-500 dark:border-zinc-300' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setThemeColor(color)}
                        >
                        </div>
                    ))}
                </div>
            </div>

            <Button
                className='w-full mt-9'
                disabled={(eventName && meetingType && meetingUrl && themeColor) === ''}
                onClick={() => CreateMeeting()}
            >
                Create
            </Button>
        </div>
    )
}

export default MeetingForm