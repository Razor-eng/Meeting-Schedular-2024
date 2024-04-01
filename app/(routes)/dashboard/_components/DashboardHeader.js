import { auth } from "@/app/firebase"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { signOut } from "firebase/auth"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

function DashboardHeader({ user }) {
    const router = useRouter();
    const logout = () => {
        signOut(auth);
        toast.success('Signed out Successfully')
    }

    return (
        <div className="p-4 px-6">
            <div className='flex items-center float-right'>
                <DropdownMenu>
                    <DropdownMenuTrigger className='flex items-center float-right outline-none'>
                        <Image
                            src={user?.photoURL || '/icons/placeholder.png'}
                            alt='User Image'
                            width={40}
                            height={40}
                            className='rounded-full object-contain'
                        />
                        <ChevronDown />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel className='max-w-28'>{user?.displayName}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.replace('/dashboard/profile')}>Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.replace('/dashboard/settings')}>Settings</DropdownMenuItem>
                        <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default DashboardHeader
