"use client"
import { Button } from '@/components/ui/button'
import { Briefcase, Calendar, Clock, Plus, Settings, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SideNavbar = () => {
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
        <div className='p-5 py-14'>
            <div className="flex justify-center">
                <Image src='/logo.png' width={100} height={100} alt='logo' />
            </div>
            <Link href={'/create-meeting'}>
                <Button className='flex gap-2 w-full mt-7 rounded-full'>
                    <Plus />
                    Create
                </Button>
            </Link>
            <div className='mt-5 flex flex-col gap-5'>
                {menu.map((item, id) => (
                    <Link key={id} href={item.path}>
                        <Button
                            className={`w-full flex gap-2 justify-start hover:bg-blue-100 ${path === item.path ? 'text-primary dark:bg-zinc-700 bg-blue-100' : ''} dark:hover:text-zinc-300 dark:hover:bg-zinc-600`}
                            variant='ghost'
                        >
                            <item.icon />
                            {item.name}
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SideNavbar