import { Button } from '@/components/ui/button'
import { signInWithPopup } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { auth, db, provider } from '../firebase'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import toast from 'react-hot-toast'

const Hero = () => {
    const signupWithGoogle = async () => {
        try {
            const res = await signInWithPopup(auth, provider);
            const user = res.user;
            const q = query(collection(db, 'users'), where("uid", "==", user.uid));
            const docs = await getDocs(q);
            if (docs.docs.length === 0) {
                await addDoc(collection(db, 'users'), {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                })
            }
            toast.success('Signed in Successfully');
        } catch (err) {
            toast.error('Something went wrong!');
        }
    }

    return (
        <div className='flex flex-col justify-center items-center my-20'>
            <div className="hidden lg:block">
                <Image
                    src='/icons/event1.png'
                    width={100}
                    height={100}
                    alt='event'
                    className='h-[100px] object-cover absolute right-36'
                />
                <Image
                    src='/icons/event2.png'
                    width={100}
                    height={100}
                    alt='event'
                    className='h-[100px] object-cover absolute top-48 left-16'
                />
                <Image
                    src='/icons/event3.png'
                    width={100}
                    height={100}
                    alt='event'
                    className='h-[100px] object-cover absolute bottom-20 left-36'
                />
                <Image
                    src='/icons/event4.png'
                    width={100}
                    height={100}
                    alt='event'
                    className='h-[100px] object-cover absolute right-16 bottom-32'
                />
            </div>
            <div className='text-center w-screen md:w-auto md:max-w-3xl'>
                <h2 className='font-bold text-2xl md:text-[60px] text-slate-700 dark:text-slate-300'>
                    Easy scheduling ahead
                </h2>
                <h2 className="text-lg mt-5 text-slate-500 dark:text-slate-400">
                    Schedular is your scheduling automation platform for eliminating the back-and-forth emails to find the perfect time, and so much more.
                </h2>
                <div className='flex gap-4 flex-col mt-5'>
                    <h3 className='text-sm'>Sign Up free with Google and Facebook</h3>
                    <div className='flex justify-center gap-8'>
                        <Button className='p-7 flex gap-4 w-fit md:w-auto bg-gray-300 sm:bg-[#4285F4]' onClick={signupWithGoogle}>
                            <Image
                                src='/icons/google.png'
                                alt='google'
                                width={30}
                                height={30}
                            />
                            <p className='hidden md:block'>
                                Sign up with Google
                            </p>
                        </Button>
                        <Button className='p-7 flex gap-4 w-fit md:w-auto bg-gray-300 sm:bg-[#4267B2]'>
                            <Image
                                src='/icons/facebook.png'
                                alt='facebook'
                                width={30}
                                height={30}
                            />
                            <p className='hidden md:block'>
                                Sign up with Facebook
                            </p>
                        </Button>
                    </div>
                    <hr />
                    <h2><Link href="/signup" className='text-primary'>Sign up Free with Email.</Link> No Credit card required.</h2>
                </div>
            </div>
        </div>
    )
}

export default Hero