"use client";
import Loader from "@/app/_components/Loader";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Dashboard = () => {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.replace('/')
        }
        if (user) {
            router.push('/dashboard/meeting-type')
        }
    }, [user])
    return (
        <>
            {(user || loading) && <Loader />}
        </>
    )
}

export default Dashboard