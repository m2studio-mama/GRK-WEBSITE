import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear the admin_session cookie
    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // deletes immediately
    });

    return response;
  } catch (error) {
    console.error('Admin Logout API Error:', error);
    return NextResponse.json({ error: 'Internal server error during logout' }, { status: 500 });
  }
}
