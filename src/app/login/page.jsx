'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            localStorage.setItem('user', email);
            router.push('/');
        } else {
            console.error('Login failed');
        }
    };

    return (
        // <div className="flex items-center justify-center min-h-screen bg-gray-100">
        //     <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-lg w-80">
        //         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        //         {error && <p className="text-red-500 text-sm">{error}</p>}
        //         <div className="mb-4">
        //             <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        //             <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        //         </div>
        //         <div className="mb-4">
        //             <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
        //             <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        //         </div>
        //         <Button type="submit" className="w-full mt-4">Login</Button>
        //     </form>
        // </div>
        <div className="flex justify-center items-center min-h-[90vh]">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" required />
                        </div>
                        <Button onClick={handleLogin} type="submit" className="w-full">
                            Login
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}