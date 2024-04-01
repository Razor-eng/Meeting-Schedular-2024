"use client"
import { Button } from '@/components/ui/button'
import { Briefcase, Calendar, Clock, Plus, Settings, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BottomNavbar = () => {
    const menu = [
        {
            name: 'Meeting Type',
            path: '/dashboard/meeting-type',
            icon: Briefcase
        },
        {
            name: 'Scheduled Meeting',
            path: '/dashboard/scheduled-meeting',
            icon: Calendar
        },
        {
            name: 'Availability',
            path: '/dashboard/availabilty',
            icon: Clock
        },
        {
            name: 'Settings',
            path: '/dashboard/settings',
            icon: Settings
        },
        {
            name: 'Profile',
            path: '/dashboard/profile',
            icon: User
        },
    ];
    const path = usePathname();

    return (
        <div className='sm:p-2 py-2 bg-zinc-300 dark:bg-zinc-700 h-fit w-screen'>
            <Link href={'/create-meeting'} className='absolute bottom-14 left-0'>
                <Button className='flex gap-2 text-black dark:text-white bg-zinc-300/75 dark:bg-zinc-800/75 rounded-full'>
                    <Plus />
                </Button>
            </Link>
            <div className='flex justify-between sm:gap-5 w-screen'>
                {menu.map((item, id) => (
                    <Link key={id} href={item.path}>
                        <Button
                            className={`w-12 flex justify-start hover:bg-blue-100 ${path === item.path ? 'text-primary dark:bg-zinc-700 bg-zinc-200/60' : ''} dark:hover:text-zinc-300 dark:hover:bg-zinc-600`}
                            variant='ghost'
                        >
                            <item.icon />
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default BottomNavbar