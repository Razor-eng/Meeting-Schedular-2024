"use client"
import { useState, useEffect } from 'react'
import { auth, db, provider } from '@/app/firebase'
import { Button } from '@/components/ui/button'
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { addDoc, collection, getDocs, query } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Loader from '@/app/_components/Loader'
import { useAuthState } from 'react-firebase-hooks/auth'
import toast from 'react-hot-toast'

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cnfrmPassword, setCnfrmPassword] = useState('');
    const router = useRouter();

    function validateName(name) {
        if (name === '') {
            return null;
        }
        return name.length > 10;
    }

    function validateEmail(email) {
        if (email === '') {
            return null;
        }
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test(email);
    }

    function validatePassword(password) {
        if (password === '') {
            return null;
        }
        return password.length > 8;
    }

    function validateConfirmPassword(cnfrmPassword) {
        if (cnfrmPassword === '') {
            return null;
        }
        return cnfrmPassword === password;
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
        toast.success('Signed up Successfully');
    }

    const register = async (e) => {
        e.preventDefault();
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(user, {
                displayName: name,
            })

            await addDoc(collection(db, "users"), {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL || null
            });
            toast.success('User Created Successfully')
            router.replace('/login');
        } catch (err) {
            toast.error('Email is already in use!');
        } finally {
            setEmail('');
            setName('');
            setPassword('');
            setCnfrmPassword('');
        }
    }

    const [user, loading] = useAuthState(auth);

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
                <div className="dark:bg-zinc-800 min-h-screen flex flex-col">
                    <div className="container max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-2">
                        <div className="bg-zinc-100 dark:bg-zinc-800 dark:text-white  px-6 py-8 rounded-2xl shadow-lg dark:shadow-gray-400 text-black w-full">
                            <h1 className="mb-8 text-3xl text-center">Sign up</h1>
                            <input
                                type="text"
                                className={`block border ${validateName(name) === null ? 'border-gray-300 outline-gray-400' : (validateName(name) ? 'border-green-500 outline-green-600' : 'border-red-400 outline-red-600')} w-full p-3 rounded-xl mb-4`}
                                name="fullname"
                                placeholder="Full Name"
                                value={name}
                                onChange={e => { setName(e.target.value) }}
                            />
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
                                className={`block border ${validatePassword(password) === null ? 'border-gray-300 outline-gray-400' : (validatePassword(password) ? 'border-green-500 outline-green-600' : 'border-red-400 outline-red-600')} w-full p-3 rounded-xl mb-4 outline-gray-400`}
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => { setPassword(e.target.value) }}
                            />
                            <input
                                type="password"
                                className={`block border ${validateConfirmPassword(cnfrmPassword) === null ? 'border-gray-300 outline-gray-400' : (validateConfirmPassword(cnfrmPassword) ? 'border-green-500 outline-green-600' : 'border-red-400 outline-red-600')} w-full p-3 rounded-xl mb-4`}
                                name="confirm_password"
                                placeholder="Confirm Password"
                                value={cnfrmPassword}
                                onChange={e => { setCnfrmPassword(e.target.value) }}
                            />

                            <Button
                                type="submit"
                                className="w-full text-center p-6 rounded bg-green-600 text-white hover:bg-green-500 focus:outline-none my-1 transition-all duration-200 ease-in-out"
                                onClick={register}
                                disabled={!email || !name || !password || !cnfrmPassword}
                            >
                                Create Account
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
                                    <p className='hidden sm:block'>Sign up with Google</p>
                                </Button>
                                <Button className='p-6 flex gap-4 bg-gray-300 sm:bg-[#4267B2]'>
                                    <Image
                                        src='/icons/facebook-circular.png'
                                        alt='facebook'
                                        width={30}
                                        height={30}
                                    />
                                    <p className='hidden sm:block'>Sign up with Facebook</p>
                                </Button>
                            </div>

                            <div className="text-center text-sm text-gray-500 mt-4">
                                By signing up, you agree to the
                                <Link className="no-underline border-b border-gray-500 text-gray-500" href="#">
                                    Terms of Service
                                </Link> and{" "}
                                <Link className="no-underline border-b border-gray-500 text-gray-500" href="#">
                                    Privacy Policy
                                </Link>
                            </div>
                        </div>

                        <div className="text-gray-500 mt-6">
                            Already have an account?
                            <Link className="hover:border-b border-blue-500 text-blue-500 ml-1 transition-all duration-100 ease-in-out" href="/login">
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Signup