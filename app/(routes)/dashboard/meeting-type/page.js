import MeetingEventList from "./_components/MeetingEventList"

const MeetingType = () => {
    return (
        <div className='sm:p-5 p-1 mt-10 sm:mt-0'>
            <div className='flex flex-col gap-5'>
                <h2 className="font-bold text-xl sm:text-2xl md:text-3xl">
                    Meeting Event Type
                </h2>
                <input
                    type="text"
                    placeholder='Search'
                    className='border border-gray-300 outline-gray-400 p-2 rounded-xl max-w-xs'
                />
                <hr />
            </div>
            <MeetingEventList />
        </div>
    )
}

export default MeetingType