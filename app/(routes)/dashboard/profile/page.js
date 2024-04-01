"use client"
import Loader from '@/app/_components/Loader';
import { auth, db } from '@/app/firebase'
import { Button } from '@/components/ui/button';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import toast from 'react-hot-toast';

const Profile = () => {
    const gradients = [
        {
            color: 'bg-gradient-to-r from-amber-500 to-pink-500'
        },
        {
            color: 'bg-gradient-to-r from-teal-400 to-yellow-200'
        },
        {
            color: 'bg-gradient-to-r from-indigo-400 to-cyan-400'
        },
        {
            color: 'bg-gradient-to-r from-fuchsia-500 to-cyan-500'
        },
    ]

    const [userData, setUserData] = useState([]);
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const [userBusiness, setUserBusiness] = useState([]);
    const [editData, setEditData] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [name, setName] = useState('');
    const [colors, setColors] = useState(false);
    const [theme, setTheme] = useState('');

    const getUserData = async () => {
        setUserData([]);
        setUserBusiness([]);
        const docref = query(collection(db, 'users'), where('uid', '==', user.uid));
        const snapshot = await getDocs(docref);
        snapshot.forEach(e => {
            setUserData(e.data())
        })
        const q = query(collection(db, 'Business'), where('email', '==', user.email));
        const docsnap = await getDocs(q);
        docsnap.forEach(e => {
            setUserBusiness(e.data())
        })
    }

    useEffect(() => {
        setLoading(true);
        if (user) {
            getUserData();
            setLoading(false);
        }
    }, [user])

    const submit = async () => {
        try {
            if (name) {
                db.collection("users").where("uid", "==", user.uid).limit(1).get().then(query => {
                    const thing = query.docs[0];
                    let tmp = thing.data();
                    tmp.displayName = name;
                    thing.ref.update(tmp);
                }).then(() => {
                    getUserData();
                })
                db.collection("Business").where("email", "==", user.email).limit(1).get().then(query => {
                    const thing = query.docs[0];
                    let tmp = thing.data();
                    tmp.displayName = name;
                    thing.ref.update(tmp);
                })
            }
            if (companyName) {
                db.collection("Business").where("email", "==", user.email).limit(1).get().then(query => {
                    const thing = query.docs[0];
                    let tmp = thing.data();
                    tmp.businessName = companyName;
                    thing.ref.update(tmp);
                })
                getUserData();
            }
            if (theme) {
                db.collection("users").where("uid", "==", user.uid).limit(1).get().then(query => {
                    const thing = query.docs[0];
                    let tmp = thing.data();
                    tmp.theme = theme;
                    thing.ref.update(tmp);
                }).then(() => {
                    getUserData();
                })
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setEditData(false);
            toast.success('Updated Succcessfully');
        }
    }

    return (
        <div className='md:p-14'>
            {loading && !userData ?
                <Loader />
                :
                <div className={`p-10 pr-4 md:pr-16 w-full md:w-auto h-screen md:h-auto flex flex-col gap-3 mt-4 shadow-xl rounded-lg ${theme ? theme : (userData?.theme ? userData?.theme : 'bg-zinc-200')}`}>
                    <div className='flex flex-col sm:flex-row sm:justify-between'>
                        <Image
                            src={userData?.photoURL || '/icons/placeholder.png'}
                            width={100}
                            height={100}
                            alt='user'
                            className='rounded-full'
                        />
                        {editData ?
                            <input
                                type="text"
                                className="block border border-gray-300 outline-gray-400 rounded-xl h-12 pl-4"
                                placeholder={userBusiness?.businessName}
                                value={companyName}
                                onChange={e => { setCompanyName(e.target.value) }}
                            />
                            :
                            <h2 className="font-semibold text-gray-800 text-2xl">{userBusiness?.businessName}</h2>
                        }
                    </div>
                    <div className="flex flex-col mt-6">
                        {editData ?
                            <input
                                type="text"
                                className="block border border-gray-300 outline-gray-400 rounded-xl h-12 pl-4 w-fit"
                                placeholder={userData?.displayName}
                                value={name}
                                onChange={e => { setName(e.target.value) }}
                            />
                            :
                            <h2 className="font-bold text-xl md:text-2xl">{userData?.displayName}</h2>
                        }

                        <h2 className="font-semibold text-gray-500 text-sm">{userData?.email}</h2>
                    </div>
                    <div className='flex flex-col gap-3 sm:flex-row sm:gap-0 items-center justify-between'>
                        {
                            editData ?
                                <div className='flex gap-4'>
                                    <Button
                                        className='w-fit mt-6 rounded-lg outline-none'
                                        variant='outline'
                                        onClick={() => setEditData(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className='w-fit mt-6 rounded-lg outline-none'
                                        onClick={submit}
                                    >
                                        Submit
                                    </Button>
                                </div>
                                :
                                <Button
                                    className='w-40 mt-6 rounded-lg outline-none'
                                    variant='outline'
                                    onClick={() => setEditData(true)}
                                >
                                    Edit
                                </Button>
                        }

                        {editData && (
                            colors ?
                                <div className='flex gap-2'>
                                    {gradients.map((gradient, id) => (
                                        <Button onClick={() => {
                                            setTheme(gradient.color);
                                            setColors(false);
                                        }}
                                            className={`${gradient.color} rounded-full shadow-lg`}
                                        >
                                        </Button>
                                    ))}
                                </div>
                                :
                                <Button onClick={() => setColors(true)} className={`${theme ? theme : (userData?.theme ? userData?.theme : 'bg-zinc-300')} border-2 rounded-full shadow-lg`}></Button>
                        )}

                    </div>
                </div>
            }
        </div>
    )
}

export default Profile