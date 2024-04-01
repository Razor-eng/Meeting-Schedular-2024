"use client"
import React, { useEffect, useState } from 'react'
import MeetingForm from './_components/MeetingForm'
import PreviewMeeting from './_components/PreviewMeeting'
import { auth } from '@/app/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import Loader from '@/app/_components/Loader'

const CreateMeeting = () => {
    const [formValue, setFormValue] = useState()
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(false);
        }
    }, [user])


    return (
        <>
            {loading ?
                <Loader />
                :
                <div className='grid grid-cols-1 md:grid-cols-3 dark:bg-zinc-900 min-h-screen'>
                    <div className="shadow-md border min-h-screen">
                        <MeetingForm setFormValue={setFormValue} user={user} />
                    </div>
                    <div className="md:col-span-2 dark:bg-zinc-900">
                        <PreviewMeeting data={formValue} />
                    </div>
                </div>
            }
        </>
    )
}

export default CreateMeeting