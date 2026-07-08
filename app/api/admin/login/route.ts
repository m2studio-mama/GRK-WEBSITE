import { NextRequest, NextResponse } from 'next/server';
import { signJWT } from '@/lib/security/auth';

const TN_DISTRICTS = [
  'Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul',
  'Erode','Kallakurichi','Kanchipuram','Kanyakumari','Karur','Krishnagiri','Madurai',
  'Mayiladuthurai','Nagapattinam','Namakkal','Nilgiris','Perambalur','Pudukkottai',
  'Ramanathapuram','Ranipet','Salem','Sivaganga','Tenkasi','Thanjavur','Theni',
  'Thoothukudi','Trichy','Tirunelveli','Tirupathur','Tiruppur','Tiruvallur',
  'Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar',
];

const legacyMap: Record<string, string> = { 
  gautham: 'Madurai', 
  suresh: 'Chennai', 
  karthik: 'Coimbatore', 
  raman: 'Trichy', 
  arun: 'Salem', 
  vijay: 'Tirunelveli' 
};

function getDistrictByPrefix(prefix: string) {
  if (legacyMap[prefix]) return legacyMap[prefix];
  return TN_DISTRICTS.find(d => d.toLowerCase() === prefix) || null;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    let authenticatedUser = null;

    // 1. Super Admin Validation
    if (cleanEmail === 'admin@gauthamramkarthik.com' && cleanPassword === 'password123') {
      authenticatedUser = {
        email: cleanEmail,
        name: 'Super Admin',
        role: 'Super Admin',
        district: '',
      };
    } else {
      // 2. District Coordinator Validation
      const parts = cleanEmail.split('@');
      if (parts.length === 2 && parts[1] === 'gauthamramkarthik.com') {
        const prefix = parts[0];
        const district = getDistrictByPrefix(prefix);
        if (district && cleanPassword === `${prefix}123`) {
          const name = prefix.charAt(0).toUpperCase() + prefix.slice(1);
          authenticatedUser = {
            email: cleanEmail,
            name: `${name} (${district} Coordinator)`,
            role: 'District Head',
            district,
          };
        }
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    // 3. Sign JWT Session Token (expires in 2 hours)
    const token = await signJWT(authenticatedUser, 2 * 60 * 60 * 1000);

    // 4. Send Response and Set HttpOnly Session Cookie
    const response = NextResponse.json({
      success: true,
      user: authenticatedUser,
    });

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 2 * 60 * 60, // 2 hours in seconds
    });

    return response;
  } catch (error) {
    console.error('Admin Login API Error:', error);
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}
