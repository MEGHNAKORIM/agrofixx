import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 });
  }

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isVerified) {
    return NextResponse.json({ success: false, message: 'Invalid credentials or not verified' }, { status: 401 });
  }

  // Compare password hash
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  }

  // Set a session cookie (for demo; use JWT or secure session in production)
  const response = NextResponse.json({
    success: true,
    user: { email: user.email, role: user.role }
  });
  response.cookies.set(
    'session',
    Buffer.from(`${user.email}:${user.role}`).toString('base64'),
    { httpOnly: true, path: '/' }
  );
  return response;
}