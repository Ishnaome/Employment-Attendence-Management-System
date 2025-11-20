// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { sendCredentials, sendOTP } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, otp} = body;
    
    // Validate presence of required fields
    if (!email || !name ) {
      console.log("Missing email, name, or otp.")
      return NextResponse.json(
        { message: 'Missing email, name, or otp.' },
        { status: 400 }
      );
    }


    await sendOTP(email, name, otp);


    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Error sending OTP', error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'Unknown error occurred.' },
      { status: 500 }
    );
  }
}
