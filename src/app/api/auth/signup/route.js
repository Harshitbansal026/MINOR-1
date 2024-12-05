import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {prisma} from '@/lib/db'
export async function POST(req) {
  const { name, email, password,role,enr } = await req.json();

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 400 });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      enr
    },
  });

  return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
}