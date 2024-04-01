import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { CalendarCheck, Clock, Timer, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const ScheduledMeetingList = ({ meetingList }) => {
    return (
        <div>
            {meetingList &&
                meetingList.map((meeting, id) => (
                    <Accordion type='single' collapsible key={id}>
                        <AccordionItem value='item-1'>
                            <AccordionTrigger>
                                {format(meeting?.selectedDate, 'PPP')}
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className='mt-5 flex flex-col gap-2'>
                                    <h2 className="font-bold text-xl">
                                        {meeting?.meetingName}
                                    </h2>


                                    <div className="flex flex-col mt-2 gap-3">
                                        <h2 className='flex gap-2 text-lg'>
                                            <User />
                                            {meeting?.email}
                                        </h2>

                                        <h2 className="flex gap-2">
                                            <Clock />
                                            {meeting?.duration} Min
                                        </h2>

                                        <h2 className="flex gap-2">
                                            <CalendarCheck />
                                            {format(meeting.selectedDate, 'PPP')}
                                        </h2>

                                        <h2 className="flex gap-2">
                                            <Timer />
                                            {meeting.selectedTime}
                                        </h2>

                                        <Link href={meeting?.meetingUrl || ''} className='text-primary'>
                                            {meeting?.meetingUrl}
                                        </Link>
                                    </div>

                                    <Link href={meeting.meetingUrl}>
                                        <Button className='mt-3'>Join Now</Button>
                                    </Link>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))
            }
        </div>
    )
}

export default ScheduledMeetingList