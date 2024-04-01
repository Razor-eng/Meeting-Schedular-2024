"use client"
import DaysList from '@/app/_utils/DaysList'
import { auth, db } from '@/app/firebase'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import toast from 'react-hot-toast'

const Availabilty = () => {
    const [user] = useAuthState(auth);
    const [days, setDays] = useState(
        {
            Sunday: false,
        },
        {
            Monday: false,
        },
        {
            Tuesday: false,
        },
        {
            Wednesday: false,
        },
        {
            Thursday: false,
        },
        {
            Friday: false,
        },
        {
            Saturday: false,
        },
    );
    const [startTime, setStartTime] = useState('00:00');
    const [endTime, setEndTime] = useState('12:00');

    const getBusinessInfo = async () => {
        const docref = doc(db, 'Business', user.uid);
        const docSnap = await getDoc(docref);
        const result = docSnap.data();
        setDays(result.daysAvailable || days);
        setStartTime(result.startTime || startTime);
        setEndTime(result.endTime || endTime);
    }

    const handleSave = async () => {
        const docref = doc(db, 'Business', user?.uid);
        await updateDoc(docref, {
            daysAvailable: days,
            startTime: startTime,
            endTime: endTime
        }).then(() => {
            toast.success('Changes Updated !');
        })
    }

    const selectDay = (day, e) => {
        setDays({
            ...days,
            [day]: e
        });
    }

    useEffect(() => {
        user && getBusinessInfo();
    }, [user])


    return (
        <div className="p-2 mt-5 md:mt-0 md:p-10 h-fit md:h-auto">
            <h2 className='font-bold text-lg sm:text-2xl'>Availabilty</h2>
            <hr className="my-7" />
            <div>
                <h2 className="font-bold">Availabilty Days</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 md:gap-5 gap-2 my-3">
                    {DaysList.map((day, id) => (
                        <div key={id} className="">
                            <h2>
                                <Checkbox checked={days[day.day] || false} onCheckedChange={e => selectDay(day.day, e)} /> {day.day}
                            </h2>
                        </div>
                    ))}
                </div>
            </div>
            <div className="border-t-2 md:border-none">
                <h2 className="font-bold mt-4 md:mt-10">Availabilty Time</h2>
                <div className="flex flex-col md:flex-row md:gap-10">
                    <div className="mt-3">
                        <h2 className="">Start Time</h2>
                        <input
                            type="time"
                            className="block border border-gray-300 outline-gray-400 w-full p-3 rounded-xl md:mb-4"
                            value={startTime}
                            onChange={e => { setStartTime(e.target.value) }}
                        />
                    </div>
                    <div className="mt-3">
                        <h2 className="">End Time</h2>
                        <input
                            type="time"
                            className="block border border-gray-300 outline-gray-400 w-full p-3 rounded-xl md:mb-4"
                            value={endTime}
                            onChange={e => { setEndTime(e.target.value) }}
                        />
                    </div>
                </div>
            </div>
            <Button className='md:mt-10 float-right md:float-none mt-2' onClick={handleSave}>Save</Button>
        </div>
    )
}

export default Availabilty