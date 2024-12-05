import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {prisma} from '@/lib/db'

export async function POST(req) {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Login successful', user }, { status: 200 });
}