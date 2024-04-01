"use client"
import Loader from '@/app/_components/Loader'
import { auth, db, provider } from '@/app/firebase'
import { Button } from '@/components/ui/button'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import toast from 'react-hot-toast'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    function validateEmail(email) {
        if (email === '') {
            return null;
        }
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test(email);
    }

    const signupWithGoogle = async () => {
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
    }

    const signIn = async (e) => {
        e.preventDefault();
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem('user', JSON.stringify(user.user))
            toast.success('Signed in Successfully');
        } catch (err) {
            toast.error('Something went wrong!');
        }
    }

    useEffect(() => {
        if (user) {
            router.push('/dashboard')
        }
    }, [user])

    return (
        <>
            {loading || user ?
                <Loader />
                :
                <div className="bg-grey-lighter min-h-screen flex flex-col dark:bg-zinc-800">
                    <div className="container max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-2">
                        <div className="bg-zinc-100 dark:bg-zinc-800 dark:text-white px-6 py-8 rounded-2xl shadow-lg text-black dark:shadow-gray-400 w-full">
                            <h1 className="mb-8 text-3xl text-center">Sign in</h1>
                            <input
                                type="email"
                                className={`block border ${validateEmail(email) === null ? 'border-gray-300 outline-gray-400' : (validateEmail(email) ? 'border-green-500 outline-green-600' : 'border-red-400 outline-red-600')} w-full p-3 rounded-xl mb-4`}
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => { setEmail(e.target.value) }}
                            />
                            <input
                                type="password"
                                className="block border border-gray-300 outline-gray-400 w-full p-3 rounded-xl mb-4"
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => { setPassword(e.target.value) }}
                            />

                            <Button
                                type="submit"
                                className="w-full text-center p-6 rounded bg-green-600 text-white hover:bg-green-500 focus:outline-none my-1 transition-all duration-200 ease-in-out"
                                onClick={signIn}
                                disabled={!email || !password}
                            >
                                Login
                            </Button>

                            <h2 className='text-sm w-full text-center py-2 mt-2'>Or continue with</h2>

                            <div className='flex sm:flex-col justify-center gap-2'>
                                <Button className='p-6 flex gap-4 bg-gray-300 sm:bg-[#4285F4]' onClick={signupWithGoogle}>
                                    <Image
                                        src='/icons/google-circular.png'
                                        alt='google'
                                        width={30}
                                        height={30}
                                    />
                                    <p className='hidden sm:block'>Sign in with Google</p>
                                </Button>
                                <Button className='p-6 flex gap-4 bg-gray-300 sm:bg-[#4267B2]'>
                                    <Image
                                        src='/icons/facebook-circular.png'
                                        alt='facebook'
                                        width={30}
                                        height={30}
                                    />
                                    <p className='hidden sm:block'>Sign in with Facebook</p>
                                </Button>
                            </div>
                        </div>

                        <div className="text-gray-500 mt-6">
                            Dont't have an account?
                            <Link className="hover:border-b border-blue-500 text-blue-500 ml-1 transition-all duration-100 ease-in-out" href="/signup">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Login