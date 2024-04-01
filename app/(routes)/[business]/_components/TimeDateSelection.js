import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar'

const TimeDateSelection = ({ date, handleDateChange, timeSlots, setSelectedTime, enabledTimeSlot, selectedTime, prevBooking }) => {
    const checkTimeSlot = (time) => {
        if (date.toString() === prevBooking[0]?.selectedDate) {
            return (prevBooking.filter(item => item.selectedTime === time)).length > 0;
        }
    }

    return (
        <div className='md:col-span-2 flex flex-col md:flex-row md:px-4 px-1'>
            <div className='flex flex-col'>
                <h2 className='font-bold text-lg'>Select Date</h2>
                <Calendar
                    mode='single'
                    selected={date}
                    onSelect={(d) => handleDateChange(d)}
                    className='rounded-md border mt-5'
                    disabled={(date) => date < new Date()}
                />
            </div>
            <div className='flex flex-col gap-4 mt-4 md:mt-10 max-h-[400px]'>
                <h2 className='font-bold text-lg md:hidden'>Select TimeSlot</h2>
                <div className="flex md:flex-col w-full overflow-auto gap-4 p-5 max-h-[300px] border md:border-none">
                    {timeSlots?.map((time, id) => (
                        <Button
                            key={id}
                            variant='outline'
                            disabled={!enabledTimeSlot || checkTimeSlot(time)}
                            onClick={() => setSelectedTime(time)}
                            className={`border-primary text-primary ${time === selectedTime ? 'bg-primary text-white' : ''}`}
                        >
                            {time}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TimeDateSelection