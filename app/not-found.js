import Link from "next/link";

export default function NotFound() {
    return (
        <div className='w-full h-[100vh] flex justify-center items-center flex-col'>
            <h1 className='text-3xl text-red-500'>Error 404 😥</h1>
            <p className='text-gray-400 text-lg'>Oops! This page was not found</p>
            <Link href="/" className='text-sm mt-4 hover:underline text-zinc-600 hover:text-gray-900 transition-all duration-150 ease-in-out'>
                Return Home
            </Link>
        </div>
    )
}