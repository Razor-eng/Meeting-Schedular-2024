import React from 'react'
import { Rings } from "react-loader-spinner";

const Loader = () => {
    return (
        <div className='w-full h-[100vh] flex justify-center items-center'>
            <Rings
                visible={true}
                height="150"
                width="150"
                color="purple"
                ariaLabel="rings-loading"
                radius="1"
            />
        </div>
    )
}

export default Loader