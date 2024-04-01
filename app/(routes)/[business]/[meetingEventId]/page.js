'use client'
import MeetingSchedule from '../_components/MeetingSchedule'
import { collection, doc, getDocs, query, where } from 'firebase/firestore'
import { auth, db } from '@/app/firebase'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import Loader from '@/app/_components/Loader'

const SharedMeetingEvent = () => {
    const params = useParams();
    const [user] = useAuthState(auth);
    const [businessInfo, setBusinessInfo] = useState([]);
    const [eventInfo, setEventInfo] = useState([]);
    const [loading, setLoading] = useState(true);

    const getBusinessandMeetingDetails = async () => {
        const businessName = params.business.split('%20').join(' ');
        const q = query(collection(db, 'Business'), where('businessName', '==', businessName))
        const docSnap = await getDocs(q);
        docSnap.forEach((doc) => {
            setBusinessInfo(doc.data())
        });

        const docref = query(collection(db, 'MeetingEvent', user.uid, 'meeting'), where('id', "==", params.meetingEventId))
        const docsnap = await getDocs(docref);
        docsnap.forEach(data => {
            setEventInfo(data.data())
        })
    }

    useEffect(() => {
        setLoading(true);
        if (user) {
            getBusinessandMeetingDetails();
            setLoading(false);
        }
    }, [user])

    return (
        <div>
            {loading ?
                <Loader />
                :
                <MeetingSchedule data={eventInfo} business={businessInfo} />
            }
        </div>
    )
}

export default SharedMeetingEvent