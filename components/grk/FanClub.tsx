'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  User, Phone, Calendar, MapPin, Mail, Upload,
  CheckCircle, RefreshCw, Search, ShieldAlert, Award,
  Download, X, Star,
} from 'lucide-react';
import {
  addRegistration, getRegistrationByPhone,
} from '@/lib/firebase/db';

/* ── District / City Data ── */
const TN_DISTRICTS = [
  'Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul',
  'Erode','Kallakurichi','Kanchipuram','Kanyakumari','Karur','Krishnagiri','Madurai',
  'Mayiladuthurai','Nagapattinam','Namakkal','Nilgiris','Perambalur','Pudukkottai',
  'Ramanathapuram','Ranipet','Salem','Sivaganga','Tenkasi','Thanjavur','Theni',
  'Thoothukudi','Trichy','Tirunelveli','Tirupathur','Tiruppur','Tiruvallur',
  'Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar',
];

const CITIES_BY_DISTRICT: Record<string, string[]> = {
  'Ariyalur': ['Ariyalur', 'Jayankondam', 'Sendurai', 'Udayarpalayam', 'Andimadam'],
  'Chengalpattu': ['Chengalpattu', 'Tambaram', 'Pallavaram', 'Chromepet', 'Maduranthakam', 'Mahabalipuram', 'Vandalur', 'Guduvanchery'],
  'Chennai': ['T. Nagar', 'Anna Nagar', 'Adyar', 'Perambur', 'Velachery', 'Kodambakkam', 'Guindy', 'Porur', 'Ambattur', 'Mylapore', 'Royapettah', 'Nungambakkam'],
  'Coimbatore': ['RS Puram', 'Gandhipuram', 'Saibaba Colony', 'Peelamedu', 'Singanallur', 'Tidel Park', 'Pollachi', 'Mettupalayam', 'Valparai', 'Sulur'],
  'Cuddalore': ['Cuddalore', 'Chidambaram', 'Neyveli', 'Vriddhachalam', 'Panruti', 'Kurinjipadi', 'Kattumannarkoil'],
  'Dharmapuri': ['Dharmapuri', 'Harur', 'Pennagaram', 'Palacode', 'Pappireddipatti'],
  'Dindigul': ['Dindigul', 'Palani', 'Kodaikanal', 'Oddanchatram', 'Vedasandur', 'Natham', 'Nilakottai'],
  'Erode': ['Erode', 'Perundurai', 'Bhavani', 'Gobichettipalayam', 'Sathyamangalam', 'Anthiyur', 'Kodumudi'],
  'Kallakurichi': ['Kallakurichi', 'Ulundurpet', 'Sankarapuram', 'Chinnasalem', 'Tirukkoyilur'],
  'Kanchipuram': ['Kanchipuram', 'Sriperumbudur', 'Walajabad', 'Kundrathur', 'Uthiramerur'],
  'Kanyakumari': ['Nagercoil', 'Kanyakumari', 'Marthandam', 'Thuckalay', 'Colachel', 'Padmanabhapuram', 'Kuzhithurai'],
  'Karur': ['Karur', 'Kulithalai', 'Aravakurichi', 'Krishnarayapuram', 'Velur'],
  'Krishnagiri': ['Krishnagiri', 'Hosur', 'Denkanikottai', 'Pochampalli', 'Uthangarai', 'Shoolagiri'],
  'Madurai': ['Tallakulam', 'Anna Nagar', 'KK Nagar', 'Goripalayam', 'Avaniyapuram', 'Melur', 'Thirumangalam', 'Usilampatti', 'Vadipatti'],
  'Mayiladuthurai': ['Mayiladuthurai', 'Sirkazhi', 'Tarangambadi', 'Kuthalam', 'Poompuhar'],
  'Nagapattinam': ['Nagapattinam', 'Velankanni', 'Vedaranyam', 'Thirukkuvalai', 'Kilvelur'],
  'Namakkal': ['Namakkal', 'Rasipuram', 'Tiruchengode', 'Paramathi Velur', 'Sendamangalam', 'Komarapalayam'],
  'Nilgiris': ['Ooty', 'Coonoor', 'Kotagiri', 'Gudalur', 'Wellington', 'Masinagudi'],
  'Perambalur': ['Perambalur', 'Veppanthattai', 'Kunnam', 'Alathur'],
  'Pudukkottai': ['Pudukkottai', 'Aranthangi', 'Illuppur', 'Alangudi', 'Gandarvakottai', 'Thirumayam'],
  'Ramanathapuram': ['Ramanathapuram', 'Rameswaram', 'Paramakudi', 'Keelakarai', 'Thuvadanai', 'Mudukulathur'],
  'Ranipet': ['Ranipet', 'Arakkonam', 'Arcot', 'Walajapet', 'Sholinghur', 'Kalavai'],
  'Salem': ['Salem', 'Attur', 'Mettur', 'Omalur', 'Yercaud', 'Edappadi', 'Sankari'],
  'Sivaganga': ['Sivaganga', 'Karaikudi', 'Devakottai', 'Manamadurai', 'Kalayarkoil', 'Tiruppattur'],
  'Tenkasi': ['Tenkasi', 'Sankarankovil', 'Kadayanallur', 'Sengottai', 'Alangulam', 'Vasudevanallur'],
  'Thanjavur': ['Thanjavur', 'Kumbakonam', 'Pattukkottai', 'Thiruvaiyaru', 'Orathanadu', 'Peravurani'],
  'Theni': ['Theni', 'Periyakulam', 'Bodinayakanur', 'Cumbum', 'Uthamapalayam', 'Andipatti'],
  'Thoothukudi': ['Thoothukudi', 'Kovilpatti', 'Tiruchendur', 'Kayalpattinam', 'Vilathikulam', 'Srivaikuntam'],
  'Trichy': ['Srirangam', 'Ariyamangalam', 'Thillai Nagar', 'Palakarai', 'Woraiyur', 'Lalgudi', 'Manapparai', 'Musiri', 'Thuraiyur'],
  'Tirunelveli': ['Palayamkottai', 'Melapalayam', 'Vadakku Neelakarai', 'Arumuganeri', 'Tirunelveli City', 'Ambasamudram', 'Nanguneri', 'Valliyur'],
  'Tirupathur': ['Tirupathur', 'Vaniyambadi', 'Ambur', 'Natrampalli', 'Yelagiri'],
  'Tiruppur': ['Tiruppur', 'Dharapuram', 'Udumalaipettai', 'Kangeyam', 'Palladam', 'Avinashi'],
  'Tiruvallur': ['Tiruvallur', 'Avadi', 'Poonamallee', 'Tiruttani', 'Gummidipoondi', 'Ponneri', 'Red Hills'],
  'Tiruvannamalai': ['Tiruvannamalai', 'Arni', 'Cheyyar', 'Polur', 'Chengam', 'Vandavasi'],
  'Tiruvarur': ['Tiruvarur', 'Mannargudi', 'Thiruthuraipoondi', 'Nannilam', 'Kodavasal'],
  'Vellore': ['Vellore', 'Katpadi', 'Gudiyatham', 'Pernambut', 'Sathuvachari'],
  'Viluppuram': ['Viluppuram', 'Tindivanam', 'Vikravandi', 'Gingee', 'Marakkanam'],
  'Virudhunagar': ['Virudhunagar', 'Sivakasi', 'Rajapalayam', 'Aruppukkottai', 'Sattur', 'Srivilliputhur'],
};

const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

const WA_GROUPS: Record<string, string> = {
  Chennai: 'https://wa.me/918122267108?text=I+have+registered+in+GRK+Fan+Club+-+Chennai',
  Coimbatore: 'https://wa.me/918122267108?text=I+have+registered+in+GRK+Fan+Club+-+Coimbatore',
  Madurai: 'https://wa.me/918122267108?text=I+have+registered+in+GRK+Fan+Club+-+Madurai',
};

function getWhatsAppLink(district: string) {
  return WA_GROUPS[district] || `https://wa.me/918122267108?text=I+have+registered+in+GRK+Fan+Club+-+${encodeURIComponent(district)}`;
}

function normalizePhone(raw: string) {
  let p = raw.trim().replace(/[\s\-]/g, '');
  if (p.startsWith('+91')) p = p.slice(3);
  else if (p.startsWith('091')) p = p.slice(3);
  else if (p.startsWith('0') && p.length === 11) p = p.slice(1);
  return p;
}

type Reg = {
  id: string; name: string; phone: string; dob: string;
  district: string; city: string; email: string;
  photo: string; bloodGroup: string; status: string; joinedDate: string;
};

type FormData = Omit<Reg, 'id'|'status'|'joinedDate'>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const INIT: FormData = { name:'', phone:'', dob:'', district:'', city:'', email:'', photo:'', bloodGroup:'' };

function IDCard({ reg }: { reg: Reg }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1000;
    canvas.height = 630;

    const templateImg = new Image();
    const userImg = new Image();
    let templateLoaded = false;
    let userLoaded = false;

    const drawCardContent = () => {
      if (templateLoaded && userLoaded) {
        // 1. Draw template background
        ctx.drawImage(templateImg, 0, 0, 1000, 630);

        // 2. Draw Member No
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 22px Arial, Montserrat, sans-serif';
        const cleanId = reg.id.toUpperCase();
        const memberId = cleanId.startsWith('GRK-') ? cleanId : `GRK-${cleanId}`;
        ctx.fillText(memberId, 810, 48);

        // 3. Draw cropped user photo inside the rounded rectangle box
        ctx.save();
        ctx.beginPath();
        const x = 72, y = 226, w = 236, h = 308, r = 16;
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.clip();

        // Aspect ratio cover crop
        const imgRatio = userImg.width / userImg.height;
        const boxRatio = w / h;
        let sx = 0, sy = 0, sw = userImg.width, sh = userImg.height;
        if (imgRatio > boxRatio) {
          sw = userImg.height * boxRatio;
          sx = (userImg.width - sw) / 2;
        } else {
          sh = userImg.width / boxRatio;
          sy = (userImg.height - sh) / 2;
        }
        ctx.drawImage(userImg, sx, sy, sw, sh, x, y, w, h);
        ctx.restore();

        // 4. Draw text field values
        ctx.fillStyle = '#051A4D'; // Navy blue from template
        ctx.font = 'bold 22px Arial, Helvetica, sans-serif';

        // NAME
        ctx.fillText(reg.name.toUpperCase(), 570, 260);

        // DATE OF BIRTH
        ctx.fillText(reg.dob, 570, 320);

        // BLOOD GROUP
        ctx.fillText(reg.bloodGroup.toUpperCase(), 570, 370);

        // ADDRESS (2 lines)
        ctx.fillText(reg.city.toUpperCase(), 570, 432);
        ctx.fillText(`${reg.district.toUpperCase()} DIST, TN`, 570, 494);

        // CONTACT
        ctx.fillText(reg.phone, 570, 556);
      }
    };

    templateImg.crossOrigin = 'anonymous';
    templateImg.onload = () => {
      templateLoaded = true;
      drawCardContent();
    };
    templateImg.onerror = () => {
      templateLoaded = true;
      drawCardContent();
    };

    userImg.crossOrigin = 'anonymous';
    userImg.onload = () => {
      userLoaded = true;
      drawCardContent();
    };
    userImg.onerror = () => {
      userLoaded = true;
      drawCardContent();
    };

    templateImg.src = '/card_template.jpg';
    userImg.src = reg.photo || '/placeholder-user.jpg';
  }, [reg]);

  const downloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `GRK_MemberCard_${reg.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="w-full max-w-2xl mx-auto block rounded-xl border border-[#FFD700]/20 shadow-2xl"
        style={{ aspectRatio: '1000/630' }}
      />
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={downloadCard}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#FFD700] text-[#0B0F19] font-black text-xs uppercase tracking-wider rounded hover:bg-white transition-all shadow-gold-glow"
        >
          <Download size={14} /> Download ID Card
        </button>
        <a
          href={getWhatsAppLink(reg.district)}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700/20 text-emerald-400 border border-emerald-500/30 font-black text-xs uppercase tracking-wider rounded hover:bg-emerald-700/30 transition-all"
        >
          Join WhatsApp Group
        </a>
      </div>
    </div>
  );
}

/* ─────────────────── Main Component ─────────────────── */
export default function FanClub() {
  const [subTab, setSubTab] = useState<'register' | 'status'>('register');
  const [formData, setFormData] = useState<FormData>(INIT);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [photoPreview, setPhotoPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<Reg | null>(null);

  const [statusInput, setStatusInput] = useState('');
  const [statusError, setStatusError] = useState('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusResult, setStatusResult] = useState<Reg | null>(null);

  const availableCities = formData.district ? (CITIES_BY_DISTRICT[formData.district] || []) : [];

  useEffect(() => { if (formData.district) setFormData(p => ({ ...p, city: '' })); }, [formData.district]);

  const validate = useCallback(() => {
    const e: FormErrors = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    const p = normalizePhone(formData.phone);
    if (!p || p.length !== 10 || !/^[6-9]\d{9}$/.test(p)) e.phone = 'Enter a valid 10-digit Indian mobile number';
    if (!formData.dob) e.dob = 'Date of birth is required';
    if (!formData.district) e.district = 'District is required';
    if (!formData.city) e.city = 'City is required';
    if (!formData.bloodGroup) e.bloodGroup = 'Blood group is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email format';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (formErrors[name as keyof FormErrors]) setFormErrors(p => ({ ...p, [name]: undefined }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setFormErrors(p => ({ ...p, photo: 'Image must be under 2MB' })); return; }
    
    setIsProcessingPhoto(true);
    const reader = new FileReader();
    reader.onload = async ev => {
      const src = ev.target?.result as string;
      try {
        const res = await fetch('/api/cards/process-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photo: src })
        });
        if (res.ok) {
          const data = await res.json();
          setPhotoPreview(data.photo);
          setFormData(p => ({ ...p, photo: data.photo }));
        } else {
          setPhotoPreview(src);
          setFormData(p => ({ ...p, photo: src }));
        }
      } catch (err) {
        setPhotoPreview(src);
        setFormData(p => ({ ...p, photo: src }));
      } finally {
        setIsProcessingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const normalized = { ...formData, phone: normalizePhone(formData.phone) };
      const existing = await getRegistrationByPhone(normalized.phone);
      if (existing) {
        setFormErrors({ phone: 'This phone number is already registered.' });
        setIsSubmitting(false);
        return;
      }
      const result = await addRegistration(normalized);
      setRegistrationSuccess(result as Reg);
    } catch {
      setFormErrors({ name: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusInput.trim()) { setStatusError('Please enter your phone number.'); return; }
    setIsCheckingStatus(true);
    setStatusError('');
    try {
      const found = await getRegistrationByPhone(normalizePhone(statusInput));
      if (!found) {
        setStatusError('No registration found for this number. Please check and try again.');
      } else {
        setStatusResult(found as Reg);
      }
    } catch {
      setStatusError('Failed to check status. Please try again.');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const resetForm = () => {
    setFormData(INIT); setPhotoPreview(''); setRegistrationSuccess(null); setFormErrors({});
  };

  const inputCls = (field: keyof FormErrors) =>
    `w-full bg-white/5 border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/8 transition-colors ${formErrors[field] ? 'border-[#E50914]' : 'border-white/10 focus:border-[#FFD700]/50'}`;

  return (
    <section id="fan-club" className="py-24 bg-[#080B14] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-[#FFD700] text-xs uppercase tracking-[0.2em] font-bold mb-3">Membership</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight text-balance">
            Join the <span className="text-[#FFD700] text-glow-gold">Official Fan Club</span>
          </h2>
          <div className="w-16 h-1 bg-[#FFD700] mx-auto mt-4 rounded-full" />
          <p className="text-gray-400 text-sm mt-4 max-w-xl mx-auto font-serif">
            Register to receive your official membership card, join district WhatsApp groups, and be part of a community of {'{'}1200+{'}'} registered members.
          </p>
        </div>

        {/* Sub Tabs */}
        <div className="flex justify-center mb-10">
          <div className="glass-card p-1 rounded-full border border-white/10 flex gap-1">
            {(['register', 'status'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  subTab === tab ? 'bg-[#FFD700] text-[#0B0F19] shadow-gold-glow' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'register' ? 'Register Now' : 'Membership Card / Status'}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* REGISTER TAB */}
          {subTab === 'register' && (
            <div>
              {!registrationSuccess ? (
                <div className="glass-card p-6 sm:p-10 rounded-2xl border border-white/8">
                  <div className="text-center mb-8">
                    <h3 className="text-white text-xl font-black mb-2">Member Registration</h3>
                    <p className="text-gray-400 text-sm font-serif">Fill in your details. Your application is reviewed by regional coordinators.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-gray-300 text-[10px] font-black uppercase tracking-wider mb-2">Full Name *</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><User size={15} /></span>
                          <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={inputCls('name')} placeholder="Your full name" />
                        </div>
                        {formErrors.name && <p className="text-[#E50914] text-[10px] mt-1">{formErrors.name}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-gray-300 text-[10px] font-black uppercase tracking-wider mb-2">Phone Number *</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Phone size={15} /></span>
                          <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className={inputCls('phone')} placeholder="0 / +91 accepted" />
                        </div>
                        {formErrors.phone && <p className="text-[#E50914] text-[10px] mt-1">{formErrors.phone}</p>}
                      </div>

                      {/* DOB */}
                      <div>
                        <label className="block text-gray-300 text-[10px] font-black uppercase tracking-wider mb-2">Date of Birth *</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Calendar size={15} /></span>
                          <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className={inputCls('dob')} />
                        </div>
                        {formErrors.dob && <p className="text-[#E50914] text-[10px] mt-1">{formErrors.dob}</p>}
                      </div>

                      {/* District */}
                      <div>
                        <label className="block text-gray-300 text-[10px] font-black uppercase tracking-wider mb-2">District *</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><MapPin size={15} /></span>
                          <select name="district" value={formData.district} onChange={handleInputChange} className={`${inputCls('district')} bg-[#111827]`}>
                            <option value="">Select District</option>
                            {TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        {formErrors.district && <p className="text-[#E50914] text-[10px] mt-1">{formErrors.district}</p>}
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-gray-300 text-[10px] font-black uppercase tracking-wider mb-2">City / Town *</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><MapPin size={15} /></span>
                          <select name="city" disabled={!formData.district} value={formData.city} onChange={handleInputChange} className={`${inputCls('city')} bg-[#111827] disabled:opacity-40`}>
                            <option value="">{formData.district ? 'Select City / Town' : 'Select District First'}</option>
                            {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        {formErrors.city && <p className="text-[#E50914] text-[10px] mt-1">{formErrors.city}</p>}
                      </div>

                      {/* Blood Group */}
                      <div>
                        <label className="block text-gray-300 text-[10px] font-black uppercase tracking-wider mb-2">Blood Group *</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Award size={15} /></span>
                          <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className={`${inputCls('bloodGroup')} bg-[#111827]`}>
                            <option value="">Select Blood Group</option>
                            {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                          </select>
                        </div>
                        {formErrors.bloodGroup && <p className="text-[#E50914] text-[10px] mt-1">{formErrors.bloodGroup}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-gray-300 text-[10px] font-black uppercase tracking-wider mb-2">Email Address *</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Mail size={15} /></span>
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputCls('email')} placeholder="Your email address" />
                        </div>
                        {formErrors.email && <p className="text-[#E50914] text-[10px] mt-1">{formErrors.email}</p>}
                      </div>
                    </div>

                    {/* Photo Upload */}
                    <div>
                      <label className="block text-gray-300 text-[10px] font-black uppercase tracking-wider mb-2">Profile Photo (Optional)</label>
                      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-white/3 border border-dashed border-white/15 rounded-xl">
                        <div className="w-20 h-20 rounded-full border border-[#FFD700]/30 overflow-hidden bg-black flex items-center justify-center flex-shrink-0">
                          {isProcessingPhoto ? (
                            <RefreshCw size={24} className="text-[#FFD700] animate-spin" />
                          ) : photoPreview ? (
                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <User size={30} className="text-gray-600" />
                          )}
                        </div>
                        <div className="flex-grow text-center sm:text-left">
                          <p className="text-white text-xs font-semibold mb-1">Upload JPEG/PNG file</p>
                          <p className="text-gray-500 text-[10px] mb-3">Max 2 MB. Square image recommended.</p>
                          <label className={`inline-flex items-center gap-1.5 px-4 py-2 border border-white/15 rounded text-xs font-bold tracking-wider uppercase text-white cursor-pointer hover:bg-white/5 transition-all ${isProcessingPhoto ? 'opacity-40 pointer-events-none' : ''}`}>
                            {isProcessingPhoto ? (
                              <><RefreshCw size={11} className="animate-spin" /> Processing...</>
                            ) : (
                              <><Upload size={11} /> Choose Photo</>
                            )}
                            <input type="file" accept="image/*" disabled={isProcessingPhoto} onChange={handlePhotoChange} className="hidden" />
                          </label>
                        </div>
                      </div>
                      {formErrors.photo && <p className="text-[#E50914] text-[10px] mt-1">{formErrors.photo}</p>}
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-10 py-3 bg-[#FFD700] text-[#0B0F19] font-black uppercase tracking-wider rounded hover:bg-white transition-all shadow-gold-glow disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                      >
                        {isSubmitting ? <><RefreshCw className="animate-spin" size={15} /> Processing...</> : <><Star size={14} fill="currentColor" /> Register Now</>}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Success */
                <div className="glass-card p-6 sm:p-10 rounded-2xl border border-[#FFD700]/20 text-center animate-fade-in-up">
                  <div className="flex justify-center mb-4 text-[#FFD700]">
                    <CheckCircle size={52} />
                  </div>
                  <h3 className="text-white text-2xl font-black mb-2">Registration Submitted!</h3>
                  <p className="text-gray-300 text-sm max-w-lg mx-auto mb-3 font-serif">
                    Your application is <strong className="text-[#FFD700]">pending approval</strong> by the Coordinator of{' '}
                    <strong>{registrationSuccess.district}</strong>.
                  </p>
                  <p className="text-gray-500 text-xs max-w-md mx-auto mb-8 font-serif">
                    Once approved, you can download your official membership card from the &ldquo;Membership Card / Status&rdquo; tab using your phone number.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a href={getWhatsAppLink(registrationSuccess.district)} target="_blank" rel="noopener noreferrer"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700/20 text-emerald-400 border border-emerald-500/30 font-black text-xs uppercase tracking-wider rounded hover:bg-emerald-700/30 transition-all">
                      Join {registrationSuccess.district} WhatsApp Group
                    </a>
                    <button onClick={() => setSubTab('status')}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#FFD700] text-[#0B0F19] font-black text-xs uppercase tracking-wider rounded hover:bg-white transition-all shadow-gold-glow">
                      <Search size={13} /> Check Card Status
                    </button>
                    <button onClick={resetForm}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/5 text-white border border-white/10 font-black text-xs uppercase tracking-wider rounded hover:bg-white/10 transition-all">
                      <RefreshCw size={13} /> Register Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STATUS TAB */}
          {subTab === 'status' && (
            <div className="glass-card p-6 sm:p-10 rounded-2xl border border-white/8">
              {!statusResult ? (
                <div className="max-w-md mx-auto text-center">
                  <h3 className="text-white text-xl font-black mb-2">Check Membership Status</h3>
                  <p className="text-gray-400 text-sm mb-8 font-serif">Enter your registered phone number to verify approval and download your card.</p>

                  <form onSubmit={handleCheckStatus} className="space-y-4">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Phone size={15} /></span>
                      <input
                        type="text"
                        value={statusInput}
                        onChange={e => { setStatusInput(e.target.value); setStatusError(''); }}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]/50"
                        placeholder="+91 9876543210 or 09876543210"
                      />
                    </div>
                    {statusError && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914] text-xs font-semibold text-left">
                        <ShieldAlert size={14} className="flex-shrink-0" /> {statusError}
                      </div>
                    )}
                    <button type="submit" disabled={isCheckingStatus}
                      className="w-full py-3 bg-[#FFD700] text-[#0B0F19] font-black uppercase tracking-wider text-xs rounded hover:bg-white transition-all shadow-gold-glow flex items-center justify-center gap-1.5 disabled:opacity-50">
                      {isCheckingStatus ? <><RefreshCw className="animate-spin" size={13} /> Checking...</> : <><Search size={13} /> Lookup Membership</>}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="animate-fade-in-up">
                  {statusResult.status === 'Pending' && (
                    <div className="max-w-lg mx-auto text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
                        <RefreshCw className="animate-spin text-yellow-500" size={24} />
                      </div>
                      <h4 className="text-yellow-500 text-lg font-black uppercase tracking-wider mb-2">Application Pending</h4>
                      <p className="text-gray-300 text-sm mb-6 font-serif">
                        Your application for <strong>{statusResult.district}</strong> is pending coordinator review. Please check back later.
                      </p>
                      <button onClick={() => { setStatusResult(null); setStatusInput(''); }}
                        className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                        Back to Lookup
                      </button>
                    </div>
                  )}
                  {statusResult.status === 'Rejected' && (
                    <div className="max-w-lg mx-auto text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 flex items-center justify-center mx-auto mb-4">
                        <X className="text-[#E50914]" size={24} />
                      </div>
                      <h4 className="text-[#E50914] text-lg font-black uppercase tracking-wider mb-2">Application Not Approved</h4>
                      <p className="text-gray-300 text-sm mb-6 font-serif">
                        Your application was not approved. Contact the <strong>{statusResult.district}</strong> coordinator for more information.
                      </p>
                      <button onClick={() => { setStatusResult(null); setStatusInput(''); }}
                        className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                        Back to Lookup
                      </button>
                    </div>
                  )}
                  {statusResult.status === 'Approved' && (
                    <div className="space-y-6">
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-2">
                          <CheckCircle size={13} /> Approved Member
                        </div>
                        <h4 className="text-white text-xl font-black">Official Membership Card</h4>
                      </div>
                      <IDCard reg={statusResult} />
                      <div className="text-center">
                        <button onClick={() => { setStatusResult(null); setStatusInput(''); }}
                          className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                          Back to Lookup
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
