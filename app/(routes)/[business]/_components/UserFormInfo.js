import React from 'react'

const UserFormInfo = ({ setName, setEmail, setDescription, name, email, description }) => {
    return (
        <div className='p-4 px-8 flex flex-col gap-3'>
            <h2 className="font-bold text-xl">
                Enter Details
            </h2>
            <div>
                <h2>Name *</h2>
                <input
                    type="text"
                    className="block border border-gray-300 outline-gray-400 w-full p-3 rounded-xl mb-4"
                    placeholder="Name"
                    value={name}
                    onChange={e => { setName(e.target.value) }}
                />
            </div>
            <div>
                <h2>Email *</h2>
                <input
                    type="email"
                    className="block border border-gray-300 outline-gray-400 w-full p-3 rounded-xl mb-4"
                    placeholder="Email"
                    value={email}
                    onChange={e => { setEmail(e.target.value) }}
                />
            </div>
            <div>
                <h2>Description</h2>
                <input
                    type="text"
                    className="block border border-gray-300 outline-gray-400 w-full p-3 rounded-xl mb-4"
                    placeholder="Description"
                    value={description}
                    onChange={e => { setDescription(e.target.value) }}
                />
            </div>
            <div>
                <h2 className="text-xs text-gray-400">By Proceeding, you confiem that you have read and agreed all the terms and conditions.</h2>
            </div>
        </div>
    )
}

export default UserFormInfo