import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
    const { setTheme, theme } = useTheme()
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }
    const [user, setUser] = useState('')
    const [name, setName] = useState('')
    useEffect(() => {
        const email = localStorage.getItem('user')
        if (email) {
            setUser(email)
        }
    }, [])
    useEffect(() => {
        const fetchUserName = async () => {
            if (user) {
                try {
                    const response = await fetch('/api/getName', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: user }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setName(data.name);
                    } else {
                        const errorData = await response.json();
                        console.error(errorData.error);
                    }
                } catch (error) {
                    console.error('Error fetching name:', error);
                }
            }
        };

        fetchUserName();
    }, [user]);
    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser('');
        setName('');
    };
    return (
        <div className='w-full h-14 shadow-sm flex items-center justify-between px-2 md:px-16'>
            <div>
                <Link href={'/'}>
                    <h1 className='text-lg md:text-2xl font-bold flex items-center gap-2'><img src={'/logo.svg'} className='h-8 w-8' />JIIT Social</h1>
                </Link>
            </div>
            <div className='flex items-center gap-5'>
                <Link href='/dashboard'>
                    {name && <p>Hello,{name}</p>}
                </Link>
                <div>
                    <Button variant='outline' onClick={toggleTheme}>
                        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </Button>
                </div>
                {user ? <Button onClick={handleLogout}>Logout</Button> : <Link href='/login'><Button>Login</Button></Link>}
            </div>
        </div>
    )
}
export default Navbar