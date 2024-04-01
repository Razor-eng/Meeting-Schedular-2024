"use client"
import Loader from '@/app/_components/Loader';
import { auth, db } from '@/app/firebase'
import { Button } from '@/components/ui/button';
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import toast from 'react-hot-toast';

const Settings = () => {
    const [userData, setUserData] = useState([]);
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const { theme, setTheme } = useTheme();

    const getUserData = async () => {
        setUserData([]);
        const docref = query(collection(db, 'users'), where('uid', '==', user.uid));
        const snapshot = await getDocs(docref);
        snapshot.forEach(e => {
            setUserData(e.data())
        })
    }

    const deleteMeeting = async (meeting) => {
        await deleteDoc(doc(db, 'ScheduleMeetings', user.uid, 'meeting', meeting.id));
    }
    const deleteEvent = async (meeting) => {
        await deleteDoc(doc(db, "MeetingEvent", user.uid, 'meeting', meeting.id));
        console.log(meeting.id)
    }

    const resetAvailabilty = async () => {
        let businessref = doc(db, "Business", user.uid);
        await updateDoc(businessref, {
            daysAvailable: [],
            endTime: '',
            startTime: ''
        })

        toast.success('Availabilty Reset Successful')
    }
    const resetMeeting = async () => {
        let meetingref = await getDocs(collection(db, "ScheduleMeetings", user.uid, 'meeting'));
        let eventref = await getDocs(collection(db, "MeetingEvent", user.uid, 'meeting'));
        if (meetingref.docs.length >= 1) {
            await getDocs(collection(db, "ScheduleMeetings", user.uid, 'meeting')).forEach(data => {
                deleteMeeting(data.data());
            })
        }
        if (eventref.docs.length >= 1) {
            await getDocs(collection(db, "MeetingEvent", user.uid, 'meeting')).forEach(data => {
                deleteEvent(data.data());
            })
        }

        toast.success('Meetings Reset Successfully')
    }

    useEffect(() => {
        setLoading(true);
        if (user) {
            getUserData();
            setLoading(false);
        }
    }, [user])

    return (
        <>
            {loading && !userData ?
                <Loader />
                :
                <div className='p-5'>
                    <h2 className="font-bold text-3xl pb-6">
                        Settings
                    </h2>
                    <hr />

                    <div className="flex flex-col gap-5 mt-2">
                        <div className="mt-3 flex flex-col gap-2">
                            <h2 className="text-2xl">Mode:</h2>
                            <div className='flex gap-3 mt-2'>
                                <Button variant='outline' className='bg-zinc-300 text-zinc-800' onClick={() => setTheme('light')}>Light</Button>
                                <Button className='bg-zinc-700 p-5 text-zinc-200 hover:bg-zinc-500' onClick={() => setTheme('dark')}>Dark</Button>
                            </div>
                        </div>
                        <div className="mt-3 flex flex-col gap-2">
                            <h2 className="text-2xl">Reset Meetings:</h2>
                            <AlertDialog>
                                <AlertDialogTrigger className='bg-red-400 outline-none hover:bg-gray-300/90 mt-2 px-5 py-2 rounded-lg text-black w-fit'>
                                    Reset
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your meetings data
                                            and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={resetMeeting}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        <div className="mt-3 flex flex-col gap-2">
                            <h2 className="text-2xl">Reset Availability:</h2>
                            <AlertDialog>
                                <AlertDialogTrigger className='bg-red-400 outline-none hover:bg-gray-300/90 mt-2 px-5 py-2 rounded-lg text-black w-fit'>
                                    Reset
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently reset your availabilty data
                                            and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={resetAvailabilty}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>

                    </div>
                </div>
            }
        </>
    )
}

export default Settings