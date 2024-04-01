import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
    const HeaderItems = ['Product', 'Pricing', 'Contact Us', 'About Us']

    return (
        <div>
            <div className='flex items-center justify-between p-1 md:px-4 shadow-sm'>
                <Image
                    src='/logo.png'
                    width={100}
                    height={100}
                    alt='logo'
                    className="w-14 h-14 md:w-[100px] md:h-[100px]"
                />
                <ul className='hidden md:flex gap-14 font-medium text-lg'>
                    {HeaderItems.map((item, id) => (
                        <li key={id} className='hover:text-primary transition-all duration-300 cursor-pointer'>
                            {item}
                        </li>
                    ))}
                </ul>
                <div className='flex gap-1 md:gap-5'>
                    <Button variant="ghost" className='w-fit'><Link href='/login'>Login</Link></Button>
                    <Button className='w-fit'><Link href='/signup'>Get Started</Link></Button>
                </div>
            </div>
        </div>
    )
}

export default Header