"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React, { useEffect, useState } from 'react'
import ScheduledMeetingList from './_components/ScheduledMeetingList'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/app/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { format, formatDate } from 'date-fns'

const ScheduledMeeting = () => {
    const [user] = useAuthState(auth);
    const [meetingList, setMeetingList] = useState([]);

    const getScheduledMeetings = async () => {
        setMeetingList([]);
        const q = query(collection(db, 'ScheduleMeetings', user.uid, 'meeting'),
            where('businessEmail', '==', user.email));

        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
            setMeetingList(prev => [...prev, doc.data()]);
        });
    }

    const filterMeetingList = (type) => {
        if (type === 'upcoming') {
            return meetingList.filter(item => format(item.selectedDate, 't') >= format(new Date(), 't'));
        }
        if (type === 'expired') {
            return meetingList.filter(item => format(item.selectedDate, 't') < format(new Date(), 't'));
        }
    }

    useEffect(() => {
        getScheduledMeetings()
    }, [])


    return (
        <div className='p-10'>
            <h2 className="font-bold text-2xl">Scheduled Meetings</h2>
            <hr className="my-5" />
            <Tabs defaultValue='upcoming' className='w-full flex flex-col items-center'>
                <TabsList className='bg-zinc-200 dark:bg-zinc-800 w-fit'>
                    <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
                    <TabsTrigger value='expired'>Expired</TabsTrigger>
                </TabsList>
                <TabsContent value='upcoming' className='w-full mx-20 px-5 border-2'>
                    <ScheduledMeetingList meetingList={filterMeetingList('upcoming')} />
                </TabsContent>
                <TabsContent value='expired' className='w-full mx-20 px-5 border-2'>
                    <ScheduledMeetingList meetingList={filterMeetingList('expired')} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ScheduledMeeting