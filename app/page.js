"use client";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "./firebase";
import { useEffect } from "react";
import Loader from "./_components/Loader";
import { useRouter } from "next/navigation";
import { Providers } from "./providers";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

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
        <Providers>
          <div className="dark:bg-zinc-800 h-screen dark:text-white">
            <Header />
            <Hero />
          </div>
        </Providers>
      }
    </>
  );
}
