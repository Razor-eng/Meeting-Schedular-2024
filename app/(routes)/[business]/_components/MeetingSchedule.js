"use client";
import { format } from 'date-fns';
import { CalendarCheck, ChevronLeft, Clock, MapPin, Timer } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import TimeDateSelection from './TimeDateSelection';
import { Button } from '@/components/ui/button';
import UserFormInfo from './UserFormInfo';
import toast from 'react-hot-toast';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from '@/app/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

const MeetingSchedule = ({ data, business }) => {
    const [date, setDate] = useState(new Date());
    const [timeSlots, setTimeSlots] = useState([]);
    const [enabledTimeSlot, setEnabledTimeSlot] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [prevBooking, setPrevBooking] = useState([]);
    const [description, setDescription] = useState('');
    const [user] = useAuthState(auth);
    const router = useRouter();

    const submitData = async () => {
        if (email && name.length > 3) {
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            if (emailReg.test(email)) {
                const id = Date.now().toString();
                try {
                    await setDoc(doc(db, 'ScheduleMeetings', user.uid, 'meeting', id), {
                        businessName: business.businessName,
                        businessEmail: business.email,
                        selectedTime: selectedTime,
                        selectedDate: date.toString(),
                        duration: data.duration,
                        meetingUrl: data.meetingUrl,
                        meetingId: data.id,
                        id: id,
                        name: name,
                        email: email,
                        description: description,
                        meetingName: data.eventName
                    }).then(() => {
                        toast.success('Meeting Scheduled Successfully!');
                        router.replace('/confirmation');
                    })
                } catch (error) {
                    toast.error(error.message)
                } finally {
                    setEmail('');
                    setDescription('');
                    setName('');
                }
            } else {
                toast.error('Enter a valid Email !');
            }
        } else {
            toast.error('Enter valid details in required fields !');
        }
    }

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

    const getPrevEventBooking = async (date) => {
        setPrevBooking([]);
        const q = query(collection(db, 'ScheduleMeetings', user.uid, 'meeting'),
            where('selectedDate', '==', date.toString()),
            where('meetingId', '==', data.id));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
            setPrevBooking(e => [...e, doc.data()]);
        })
    }


    const handleDateChange = (date) => {
        setDate(date);
        const day = format(date, 'EEEE');
        if (business.daysAvailable?.[day]) {
            getPrevEventBooking(date);
            setEnabledTimeSlot(true);
        } else {
            setEnabledTimeSlot(false);
        }
    }

    return (
        <div
            className='md:p-5 md:py-10 shadow-lg dark:shadow-gray-500 m-5 border-t-8 mx-2 md:mx-28 lg:mx-56 md:my-10'
            style={{ borderTopColor: data?.themeColor }}
        >
            <Link href={'/dashboard'}>
                <h2 className="flex gap-2 hover:bg-gray-500 rounded-lg w-fit py-3 pr-3">
                    <ChevronLeft /> Back
                </h2>
            </Link>
            <Image src={'/logo.png'} alt='logo' width={100} height={100} />
            <div className="grid grid-cols-1 md:grid-cols-3 mt-5">
                <div className='p-4 border-r'>
                    <h2>{business.businessName}</h2>
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

                        <h2 className="flex gap-2">
                            <CalendarCheck />
                            {date &&
                                format(date, 'PPP')
                            }
                        </h2>

                        {selectedTime &&
                            <h2 className="flex gap-2">
                                <Timer />
                                {selectedTime}
                            </h2>
                        }

                        <Link href={data?.meetingUrl || ''} className='text-primary'>{data?.meetingUrl}</Link>
                    </div>
                </div>

                {step === 1 ?
                    <TimeDateSelection
                        date={date}
                        enabledTimeSlot={enabledTimeSlot}
                        handleDateChange={handleDateChange}
                        setSelectedTime={setSelectedTime}
                        timeSlots={timeSlots}
                        selectedTime={selectedTime}
                        prevBooking={prevBooking}
                    />
                    :
                    <UserFormInfo
                        name={name}
                        email={email}
                        description={description}
                        setEmail={setEmail}
                        setName={setName}
                        setDescription={setDescription}
                    />
                }
            </div>

            <div className="flex gap-3 justify-end">
                {step === 2 &&
                    <Button
                        variant='outline'
                        className='mt-10 float-right'
                        onClick={() => setStep(1)}
                    >
                        Back
                    </Button>
                }
                {step === 1 ?
                    <Button
                        disabled={!(selectedTime && date)}
                        className='mt-10 float-right'
                        onClick={() => setStep(step + 1)}
                    >
                        Next
                    </Button>
                    :
                    <Button
                        disabled={!(name && email)}
                        className='mt-10 float-right'
                        onClick={submitData}
                    >
                        Schedule
                    </Button>
                }
            </div>
        </div>
    )
}

export default MeetingSchedule