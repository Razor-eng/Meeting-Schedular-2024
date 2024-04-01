"use client"
import Loader from '@/app/_components/Loader';
import { auth, db } from '@/app/firebase';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy } from 'firebase/firestore';
import { Clock, Copy, MapPin, Pen, Settings, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';

const MeetingEventList = () => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [meetings, setMeetings] = useState([]);
    const [val, setVal] = useState(true);
    const [loading, setLoading] = useState(false);
    const [businessInfo, setBusinessInfo] = useState(null);

    const getBusinessInfo = async () => {
        const docref = doc(db, 'Business', user.uid);
        const docSnap = await getDoc(docref);
        setBusinessInfo(docSnap.data());
    }

    const getMeetingDetails = (meeting) => {
        router.replace(`/${businessInfo.businessName}/${meeting.id}`)
    }

    const getData = async () => {
        setLoading(true);
        setMeetings([]);
        await getDocs(collection(db, "MeetingEvent", user.uid, "meeting")).then(data => {
            data.docs.sort((a, b) => b.data().id - a.data().id).map(doc => {
                setMeetings(e => [...e, doc.data()]);
            })
        });
        setLoading(false);
    }

    useEffect(() => {
        if (val) {
            if (user) {
                getData();
                getBusinessInfo();
                setVal(false);
            }
        }
    }, [])

    const deleteMeeting = async (meeting) => {
        await deleteDoc(doc(db, 'MeetingEvent', user.uid, 'meeting', meeting.id)).then(() => {
            toast.success('Meeting deleted successfully');
            getData();
        })
    }

    const onCopyClickHandler = (meeting) => {
        navigator.clipboard.writeText(meeting.meetingUrl);
        toast.success('Copied to Clipboard');
    }

    return (
        <>
            {loading ?
                <Loader />
                :
                <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
                    {meetings?.map((meeting, id) => (
                        <div
                            key={id}
                            className='border shadow-md border-t-8 rounded-lg p-5 flex flex-col gap-3'
                            style={{ borderTopColor: meeting?.themeColor }}
                        >
                            <div className="flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Settings className='text-gray-700 cursor-pointer' />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem className='flex gap-2 cursor-pointer'><Pen /> Edit</DropdownMenuItem>
                                        <DropdownMenuItem className='flex gap-2 cursor-pointer' onClick={() => deleteMeeting(meeting)}><Trash /> Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className='flex flex-col gap-5 cursor-pointer' onClick={() => getMeetingDetails(meeting)}>
                                <h2 className='font-bold text-xl'>{meeting?.eventName}</h2>
                                <div className='flex justify-between'>
                                    <h2 className='flex gap-2 text-gray-500'><Clock /> {meeting?.duration} Min</h2>
                                    <h2 className='flex gap-2 text-gray-500'><MapPin /> {meeting?.meetingType}</h2>
                                </div>
                            </div>
                            <hr />
                            <div className="flex justify-between">
                                <h2
                                    className='flex gap-2 text-sm items-center cursor-pointer hover:bg-zinc-100 rounded-md px-2'
                                    onClick={() => {
                                        onCopyClickHandler(meeting);
                                    }}
                                >
                                    <Copy className='h-4 w-4' />Copy Link
                                </h2>
                                <Button variant='outline' className='border-primary rounded-2xl text-primary'>Share</Button>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}

export default MeetingEventList