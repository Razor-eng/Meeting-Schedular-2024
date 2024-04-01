"use client";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "@/app/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from '@/app/_components/Loader';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import SideNavbar from "./_components/SideNavbar"
import DashboardHeader from './_components/DashboardHeader';
import { Providers } from '@/app/providers';
import BottomNavbar from './_components/BottomNavbar';


const DashboardLayout = ({ children }) => {
    const [registered, setRegistered] = useState(false);
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState([]);

    const getUserData = async () => {
        setCurrentUser([]);
        const docref = query(collection(db, 'users'), where('uid', '==', user.uid));
        const snapshot = await getDocs(docref);
        snapshot.forEach(e => {
            setCurrentUser(e.data());
        })
    };

    useEffect(() => {
        if (!user) {
            router.replace('/')
        }
        if (user) {
            isBussinessRegistered();
            getUserData();
        }
    }, [user])

    const isBussinessRegistered = async () => {
        const docref = doc(db, 'Business', user.uid);
        const docSnap = await getDoc(docref);

        if (docSnap.exists()) {
            setRegistered(true);
        } else {
            router.replace('/create-business')
        }
    }

    return (
        <>
            {loading || !user || !registered ?
                <Loader />
                :
                <Providers>
                    <div className='hidden md:block md:w-64 bg-slate-50 dark:bg-zinc-800 h-screen fixed transition-colors duration-300 ease-in-out'>
                        <SideNavbar />
                    </div>
                    <div className='md:ml-64 dark:bg-zinc-900 h-screen transition-colors duration-300 ease-in-out'>
                        <DashboardHeader user={currentUser} />
                        {children}
                        <div className='md:hidden fixed bottom-0 transition-colors duration-300 ease-in-out'>
                            <BottomNavbar />
                        </div>
                    </div>
                </Providers>
            }
        </>
    )
}

export default DashboardLayout