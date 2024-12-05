'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from '@/components/ui/select';
import { SelectTrigger } from '@radix-ui/react-select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Signup() {
    const [name, setName] = useState('');
    const [enr,setEnr] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter()

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role,enr }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to sign up');
            }
            setSuccess('Signup successful! You can now log in.');
            router.replace('/login')
        } catch (err) {
            setError(err.message || 'Error signing up. Please try again.');
        }
    };
    return (
        <div className="flex justify-center items-center min-h-[90vh]">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Signup</CardTitle>
                    <CardDescription>
                        Enter your name, email and role below to login to your account
                    </CardDescription>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Name</Label>
                            <Input
                                value={name} onChange={(e) => setName(e.target.value)}
                                id="name"
                                type="name"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">ENR</Label>
                            <Input
                                value={enr} onChange={(e) => setEnr(e.target.value)}
                                id="name"
                                type="name"
                                placeholder="8-9 digit enr number"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Click to select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STUDENT">STUDENT</SelectItem>
                                    <SelectItem value="FACULTY">FACULTY</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleSignup} type="submit" className="w-full">
                            Signup
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
