"use client";
import Loader from '@/app/_components/Loader';
import { auth, db } from '@/app/firebase';
import { Button } from '@/components/ui/button'
import { doc, setDoc } from 'firebase/firestore';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';

const CreateBusiness = () => {
    const [businessName, setBusinessName] = useState('');
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    const createBusiness = async () => {
        try {
            await setDoc(doc(db, 'Business', user.uid), {
                email: user.email,
                displayName: user.displayName,
                businessName: businessName,
            })
            toast.success('New Business Created');
            router.replace('/dashboard');
        } catch (err) {
            toast.error(err);
        } finally {
            setBusinessName('');
        }
    }

    useEffect(() => {
        if (!user) {
            router.replace('/')
        }
    }, [user])

    return (
        <>
            {loading || !user ?
                <Loader />
                :
                <div className='p-14 items-center flex flex-col gap-20 my-10'>
                    <Image
                        src='/logo.png'
                        width={100}
                        height={100}
                        alt='logo'
                    />
                    <div className='flex flex-col items-center gap-4 max-w-3xl'>
                        <h2 className='text-4xl font-bold'>What should we call your business?</h2>
                        <p className='text-slate-500'>You can always change this later from settings</p>
                        <div className='w-full flex flex-col'>
                            <label className='text-slate-400'>Team Name</label>
                            <input
                                type='text'
                                placeholder='Enter your Team name'
                                className="block border border-gray-300 w-full p-3 rounded-xl mt-2 outline-gray-400"
                                value={businessName}
                                onChange={e => setBusinessName(e.target.value)}
                            />
                        </div>
                        <Button
                            className='w-full p-6 rounded-lg'
                            disabled={!businessName}
                            onClick={createBusiness}
                        >Create Business</Button>
                    </div>
                </div>
            }
        </>
    )
}

export default CreateBusiness