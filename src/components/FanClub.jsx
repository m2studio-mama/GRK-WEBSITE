import React, { useState, useRef, useEffect } from 'react';
import { User, Phone, Calendar, Mail, Upload, Download, CheckCircle, RefreshCw, MapPin, Award, Search, ShieldAlert, Image as ImageIcon } from 'lucide-react';
import { addRegistration, getRegistrationByPhone, updateRegistrationPhoto } from '../firebase/db';

const DISTRICT_WHATSAPP_GROUPS = {
  'Madurai': 'https://chat.whatsapp.com/MaduraiGRKFansOfficial',
  'Chennai': 'https://chat.whatsapp.com/ChennaiGRKFansOfficial',
  'Coimbatore': 'https://chat.whatsapp.com/CoimbatoreGRKFansOfficial',
  'Trichy': 'https://chat.whatsapp.com/TrichyGRKFansOfficial',
  'Tiruchirappalli': 'https://chat.whatsapp.com/TrichyGRKFansOfficial',
  'Salem': 'https://chat.whatsapp.com/SalemGRKFansOfficial',
  'Tirunelveli': 'https://chat.whatsapp.com/TirunelveliGRKFansOfficial',
  'Erode': 'https://chat.whatsapp.com/ErodeGRKFansOfficial',
  'Vellore': 'https://chat.whatsapp.com/VelloreGRKFansOfficial',
  'Thanjavur': 'https://chat.whatsapp.com/ThanjavurGRKFansOfficial',
  'Kanyakumari': 'https://chat.whatsapp.com/KanyakumariGRKFansOfficial',
  'Default': 'https://chat.whatsapp.com/TeamGRKFansOfficial'
};

const DISTRICT_CITIES = {
  'Ariyalur': ['Ariyalur Town', 'Jayankondam', 'Sendurai', 'Udayarpalayam'],
  'Chengalpattu': ['Chengalpattu City', 'Tambaram', 'Pallavaram', 'Madurantakam', 'Tiruporur', 'Vandalur', 'ECR', 'Mahabalipuram'],
  'Chennai': ['Adyar', 'Anna Nagar', 'T. Nagar', 'Velachery', 'Mylapore', 'Tambaram', 'Chromepet', 'Royapettah', 'Nungambakkam', 'Saidapet', 'Perambur', 'Guindy'],
  'Coimbatore': ['Coimbatore City', 'Pollachi', 'Mettupalayam', 'Sulur', 'Valparai', 'Annur', 'Karumathampatti', 'Kinathukadavu'],
  'Cuddalore': ['Cuddalore Town', 'Chidambaram', 'Vriddhachalam', 'Panruti', 'Neyveli', 'Kurinjipadi', 'Kattumannarkoil'],
  'Dharmapuri': ['Dharmapuri Town', 'Harur', 'Pennagaram', 'Palacode', 'Pappireddipatti'],
  'Dindigul': ['Dindigul City', 'Palani', 'Kodaikanal', 'Oddanchatram', 'Vedasandur', 'Natham', 'Nilakottai'],
  'Erode': ['Erode City', 'Gobichettipalayam', 'Bhavani', 'Perundurai', 'Sathyamangalam', 'Anthiyur', 'Kodumudi'],
  'Kallakurichi': ['Kallakurichi Town', 'Sankarapuram', 'Ulundurpet', 'Chinnasalem', 'Tirukkoyilur'],
  'Kanchipuram': ['Kanchipuram City', 'Sriperumbudur', 'Walajabad', 'Kundrathur', 'Uttiramerur'],
  'Kanyakumari': ['Nagercoil', 'Kanyakumari Town', 'Marthandam', 'Thuckalay', 'Colachel', 'Padmanabhapuram', 'Kuzhithurai'],
  'Karur': ['Karur City', 'Kulithalai', 'Aravakurichi', 'Krishnarayapuram', 'Velur'],
  'Krishnagiri': ['Krishnagiri Town', 'Hosur', 'Denkanikottai', 'Pochampalli', 'Uthangarai', 'Shoolagiri'],
  'Madurai': ['Madurai City', 'Melur', 'Thirumangalam', 'Usilampatti', 'Vadipatti', 'Tirupparankundram', 'Sholavandan', 'Alanganallur'],
  'Mayiladuthurai': ['Mayiladuthurai Town', 'Sirkazhi', 'Tharangambadi', 'Kuthalam'],
  'Nagapattinam': ['Nagapattinam Town', 'Velankanni', 'Vedaranyam', 'Thirukkuvalai', 'Kilvelur'],
  'Namakkal': ['Namakkal Town', 'Rasipuram', 'Tiruchengode', 'Paramathi Velur', 'Sendamangalam', 'Komarapalayam'],
  'Nilgiris': ['Ooty', 'Coonoor', 'Gudalur', 'Kotagiri', 'Kundah'],
  'Perambalur': ['Perambalur Town', 'Veppanthattai', 'Alathur', 'Kunnam'],
  'Pudukkottai': ['Pudukkottai Town', 'Aranthangi', 'Illuppur', 'Gandarvakottai', 'Keeranur', 'Alangudi', 'Thirumayam'],
  'Ramanathapuram': ['Ramanathapuram Town', 'Rameswaram', 'Paramakudi', 'Kamuthi', 'Mudukulathur', 'Keelakarai', 'Tiruvadanai'],
  'Ranipet': ['Ranipet Town', 'Arakkonam', 'Walajapet', 'Arcot', 'Sholinghur'],
  'Salem': ['Salem City', 'Attur', 'Mettur', 'Omalur', 'Sankari', 'Yercaud', 'Edappadi', 'Valapady', 'Gangavalli'],
  'Sivaganga': ['Sivaganga Town', 'Karaikudi', 'Devakottai', 'Manamadurai', 'Kalayarkoil', 'Thiruppuvanam'],
  'Tenkasi': ['Tenkasi Town', 'Sankarankovil', 'Kadayanallur', 'Sengottai', 'Alangulam', 'Vasudevanallur', 'Puliyangudi'],
  'Thanjavur': ['Thanjavur City', 'Kumbakonam', 'Pattukkottai', 'Orathanadu', 'Thiruvaiyaru', 'Peravurani', 'Adirampattinam'],
  'Theni': ['Theni Town', 'Periyakulam', 'Bodinayakanur', 'Cumbum', 'Uthamapalayam', 'Andipatti'],
  'Thoothukudi': ['Thoothukudi City', 'Kovilpatti', 'Tiruchendur', 'Kayalpattinam', 'Vilathikulam', 'Sathankulam', 'Ottapidaram'],
  'Trichy': ['Trichy City', 'Srirangam', 'Lalgudi', 'Manapparai', 'Musiri', 'Thuraiyur', 'Thiruverumbur', 'Pullambadi'],
  'Tirunelveli': ['Tirunelveli City', 'Ambasamudram', 'Nanguneri', 'Radhapuram', 'Valliyur', 'Palayamkottai', 'Cheranmahadevi'],
  'Tirupathur': ['Tirupathur Town', 'Vaniyambadi', 'Ambur', 'Natrampalli'],
  'Tiruppur': ['Tiruppur City', 'Dharapuram', 'Udumalaipettai', 'Avinashi', 'Palladam', 'Kangeyam', 'Madathukulam'],
  'Tiruvallur': ['Tiruvallur Town', 'Avadi', 'Poonamallee', 'Ponneri', 'Gummidipoondi', 'Tiruttani'],
  'Tiruvannamalai': ['Tiruvannamalai Town', 'Arani', 'Vandavasi', 'Cheyyar', 'Chengam', 'Polur'],
  'Tiruvarur': ['Tiruvarur Town', 'Mannargudi', 'Thiruthuraipoondi', 'Nannilam', 'Kodavasal'],
  'Vellore': ['Vellore City', 'Katpadi', 'Gudiyatham', 'Pernambut', 'Anaicut'],
  'Viluppuram': ['Viluppuram City', 'Tindivanam', 'Vikravandi', 'Gingee', 'Vanur', 'Marakkanam'],
  'Virudhunagar': ['Virudhunagar Town', 'Sivakasi', 'Rajapalayam', 'Aruppukkottai', 'Sattur', 'Srivilliputhur', 'Watrap']
};

const DEFAULT_SILHOUETTE = 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';

const FanClub = () => {
  // Navigation tabs state
  const [subTab, setSubTab] = useState('register'); // register, status

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    district: '',
    city: '',
    email: '',
    bloodGroup: '',
    photo: null
  });
  
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  // Status Search State
  const [statusInput, setStatusInput] = useState('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusResult, setStatusResult] = useState(null);
  const [statusError, setStatusError] = useState('');

  // Interactive Photo Prompt States (for Approved users who have no photo)
  const [showPhotoPrompt, setShowPhotoPrompt] = useState(false);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);

  const canvasRef = useRef(null);

  // All 38 Districts of Tamil Nadu
  const districts = Object.keys(DISTRICT_CITIES).sort();
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Dynamic Cities list based on selected district
  const availableCities = formData.district ? DISTRICT_CITIES[formData.district] : [];

  // Helper to extract clean 10 digits from any formatted phone input (handles +91, 91, 0, etc.)
  const normalizePhone = (phoneStr) => {
    const digits = phoneStr.replace(/\D/g, '');
    if (digits.length > 10) {
      return digits.slice(-10);
    }
    if (digits.length === 11 && digits.startsWith('0')) {
      return digits.slice(1);
    }
    return digits;
  };

  // Photo upload handler (during registration)
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, photo: 'File size must be under 2MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, photo: file }));
      setFormErrors(prev => ({ ...prev, photo: null }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Interactive Photo Prompt Upload handler (during approval check)
  const handlePromptPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !statusResult) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Photo must be under 2MB');
      return;
    }

    setIsUpdatingPhoto(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Photo = reader.result;
        // Save to database
        await updateRegistrationPhoto(statusResult.id, base64Photo);
        // Update local statusResult state so card renders with new photo
        setStatusResult(prev => ({ ...prev, photo: base64Photo }));
        setShowPhotoPrompt(false);
      } catch (err) {
        console.error(err);
        alert('Failed to save profile picture. Please try again.');
      } finally {
        setIsUpdatingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    
    // Normalization check for phone
    const normalizedVal = normalizePhone(formData.phone);
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (normalizedVal.length !== 10) {
      errors.phone = 'Invalid phone number (must contain a 10-digit mobile number)';
    }

    if (!formData.dob) errors.dob = 'Date of birth is required';
    if (!formData.district) errors.district = 'Please select a district';
    if (!formData.city) errors.city = 'Please select a city/town';
    if (!formData.bloodGroup) errors.bloodGroup = 'Please select a blood group';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Cascading effect: Reset city when district changes
    if (name === 'district') {
      setFormData(prev => ({ ...prev, district: value, city: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const regObj = {
        name: formData.name,
        phone: normalizePhone(formData.phone), // Store normalized 10 digits
        dob: formData.dob,
        district: formData.district,
        city: formData.city,
        email: formData.email,
        bloodGroup: formData.bloodGroup,
        photo: photoPreview || null // Optional during registration!
      };

      const result = await addRegistration(regObj);
      setRegistrationSuccess(result);
    } catch (err) {
      console.error(err);
      alert('Error during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status Search Lookups
  const handleCheckStatus = async (e) => {
    e.preventDefault();
    if (!statusInput.trim()) {
      setStatusError('Please enter your phone number');
      return;
    }
    
    const searchVal = normalizePhone(statusInput);
    if (searchVal.length !== 10) {
      setStatusError('Invalid phone number (must contain a 10-digit mobile number)');
      return;
    }

    setIsCheckingStatus(true);
    setStatusError('');
    setStatusResult(null);
    setShowPhotoPrompt(false);

    try {
      const member = await getRegistrationByPhone(searchVal);
      if (member) {
        setStatusResult(member);
        // If approved but has no photo uploaded, trigger the interactive photo prompt!
        if (member.status === 'Approved' && !member.photo) {
          setShowPhotoPrompt(true);
        }
      } else {
        setStatusError('No registration found with this phone number. Please register first.');
      }
    } catch (err) {
      console.error(err);
      setStatusError('Unable to connect. Please try again.');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Select which data should be drawn on the Canvas card (Approved only, and prompt hidden or skipped)
  const displayCardData = (statusResult?.status === 'Approved' && !showPhotoPrompt) ? statusResult : null;

  // HTML Canvas Card Drawing
  useEffect(() => {
    if (displayCardData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Canvas dimensions for high quality
      canvas.width = 600;
      canvas.height = 350;

      // Draw background
      const grad = ctx.createRadialGradient(300, 175, 50, 300, 175, 300);
      grad.addColorStop(0, '#1c1c1c');
      grad.addColorStop(1, '#070707');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 350);

      // Draw border
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, 580, 330);
      
      // Draw sub border
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(16, 16, 568, 318);

      // Draw Header Logo text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px Montserrat';
      ctx.fillText('GAUTHAM RAM ', 80, 50);
      
      ctx.fillStyle = '#FFD700';
      ctx.font = 'black 18px Montserrat';
      ctx.fillText('KARTHIK', 225, 50);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '500 9px Poppins';
      ctx.fillText('OFFICIAL FAN CLUB', 80, 68);

      // Draw Chip
      ctx.fillStyle = '#0F3BA2';
      ctx.fillRect(520, 40, 40, 25);
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(525, 45, 10, 15);
      ctx.fillRect(540, 45, 15, 15);

      // Draw Details
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '500 10px Poppins';
      
      ctx.fillText('MEMBER NAME', 220, 125);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px Montserrat';
      ctx.fillText(displayCardData.name.toUpperCase(), 220, 150);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '500 10px Poppins';
      ctx.fillText('REGISTRATION ID', 220, 195);
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 16px Courier New';
      ctx.fillText(displayCardData.id, 220, 215);

      // Column 1: Location (District / City)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '500 10px Poppins';
      ctx.fillText('LOCATION', 220, 260);
      
      const locationText = `${displayCardData.district} / ${displayCardData.city}`;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = locationText.length > 22 ? 'bold 11px Montserrat' : 'bold 13px Montserrat';
      ctx.fillText(locationText.toUpperCase(), 220, 280);

      // Column 2: Blood Group
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '500 10px Poppins';
      ctx.fillText('BLOOD GROUP', 355, 260);
      ctx.fillStyle = '#E50914'; // Crimson Red
      ctx.font = 'bold 15px Montserrat';
      ctx.fillText(displayCardData.bloodGroup || 'O+', 355, 280);

      // Column 3: Issued Date
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '500 10px Poppins';
      ctx.fillText('ISSUED ON', 460, 260);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px Montserrat';
      ctx.fillText(displayCardData.joinedDate, 460, 280);

      // Draw Barcode lines mock
      ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
      const barcodeX = 420;
      const barcodeY = 195;
      for (let i = 0; i < 24; i++) {
        const w = (i % 3 === 0) ? 3 : 1;
        ctx.fillRect(barcodeX + (i * 5), barcodeY, w, 20);
      }

      // Draw photo and logo when loaded
      const img = new Image();
      const logoImg = new Image();
      
      let memberLoaded = false;
      let logoLoaded = false;
      
      const checkAndDraw = () => {
        if (memberLoaded && logoLoaded) {
          // Draw circular logo on the canvas at (30, 30) with diameter 40
          ctx.save();
          ctx.beginPath();
          ctx.arc(50, 50, 20, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(logoImg, 30, 30, 40, 40);
          ctx.restore();

          // Draw logo border
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(50, 50, 20, 0, Math.PI * 2, true);
          ctx.stroke();

          // Draw round member photo border
          ctx.save();
          ctx.beginPath();
          ctx.arc(110, 190, 70, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          
          // Calculate centered square crop to prevent stretching
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, 40, 120, 140, 140);
          ctx.restore();
          
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(110, 190, 70, 0, Math.PI * 2, true);
          ctx.stroke();
        }
      };

      img.crossOrigin = "anonymous";
      img.onload = () => {
        memberLoaded = true;
        checkAndDraw();
      };
      
      logoImg.crossOrigin = "anonymous";
      logoImg.onload = () => {
        logoLoaded = true;
        checkAndDraw();
      };
      
      img.src = displayCardData.photo || DEFAULT_SILHOUETTE;
      logoImg.src = '/logo.png';
    }
  }, [displayCardData]);

  // Download membership card trigger
  const downloadCard = () => {
    if (canvasRef.current && displayCardData) {
      const url = canvasRef.current.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `Gautham_Ram_Karthik_${displayCardData.name.replace(/\s+/g, '_')}_ID.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const getWhatsAppLink = (district) => {
    return DISTRICT_WHATSAPP_GROUPS[district] || DISTRICT_WHATSAPP_GROUPS['Default'];
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      phone: '',
      dob: '',
      district: '',
      city: '',
      email: '',
      bloodGroup: '',
      photo: null
    });
    setPhotoPreview(null);
    setRegistrationSuccess(null);
    setFormErrors({});
  };

  const handleResetStatusSearch = () => {
    setStatusInput('');
    setStatusResult(null);
    setStatusError('');
    setShowPhotoPrompt(false);
  };

  return (
    <section id="fan-club" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-10">
          <p className="text-primary text-xs uppercase tracking-[0.2em] font-semibold mb-2">Join the Family</p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Official <span className="text-primary text-glow-gold">Gautham Ram Karthik Fan Club</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-accent to-primary mx-auto mt-4 rounded-full" />
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#121212] p-1.5 rounded-lg border border-white/5 flex gap-1">
            <button
              onClick={() => { setSubTab('register'); handleResetForm(); }}
              className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                subTab === 'register' 
                  ? 'bg-primary text-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Become a Member
            </button>
            <button
              onClick={() => { setSubTab('status'); handleResetStatusSearch(); }}
              className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                subTab === 'status' 
                  ? 'bg-primary text-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Membership Card / Status
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* TAB 1: REGISTRATION FORM */}
          {subTab === 'register' && (
            <div>
              {!registrationSuccess ? (
                <div className="glass-card p-6 sm:p-10 rounded-xl border border-white/10">
                  <div className="text-center mb-8">
                    <h3 className="text-white text-xl font-bold mb-2">Member Registration</h3>
                    <p className="text-gray-400 text-sm">Fill in your details. Photo upload is optional. Your application is reviewed by regional coordinators.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Full Name *</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><User size={16} /></span>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full bg-white/5 border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 ${formErrors.name ? 'border-danger' : 'border-white/10 focus:border-primary'}`}
                            placeholder="Your full name"
                          />
                        </div>
                        {formErrors.name && <p className="text-danger text-xs mt-1">{formErrors.name}</p>}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Phone Number *</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Phone size={16} /></span>
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full bg-white/5 border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 ${formErrors.phone ? 'border-danger' : 'border-white/10 focus:border-primary'}`}
                            placeholder="Mobile number (0 / +91 accepted)"
                          />
                        </div>
                        {formErrors.phone && <p className="text-danger text-xs mt-1">{formErrors.phone}</p>}
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Date of Birth *</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Calendar size={16} /></span>
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className={`w-full bg-white/5 border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 ${formErrors.dob ? 'border-danger' : 'border-white/10 focus:border-primary'}`}
                          />
                        </div>
                        {formErrors.dob && <p className="text-danger text-xs mt-1">{formErrors.dob}</p>}
                      </div>

                      {/* District Dropdown select */}
                      <div>
                        <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">District *</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><MapPin size={16} /></span>
                          <select
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            className={`w-full bg-[#121212] border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none ${formErrors.district ? 'border-danger' : 'border-white/10 focus:border-primary'}`}
                          >
                            <option value="">Select District</option>
                            {districts.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                        {formErrors.district && <p className="text-danger text-xs mt-1">{formErrors.district}</p>}
                      </div>

                      {/* Dynamic City Dropdown select */}
                      <div>
                        <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">City / Town *</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><MapPin size={16} /></span>
                          <select
                            name="city"
                            disabled={!formData.district}
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`w-full bg-[#121212] border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed ${formErrors.city ? 'border-danger' : 'border-white/10 focus:border-primary'}`}
                          >
                            <option value="">{formData.district ? 'Select City / Town' : 'Select District First'}</option>
                            {availableCities.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        {formErrors.city && <p className="text-danger text-xs mt-1">{formErrors.city}</p>}
                      </div>

                      {/* Blood Group Dropdown */}
                      <div>
                        <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Blood Group *</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Award size={16} /></span>
                          <select
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleInputChange}
                            className={`w-full bg-[#121212] border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none ${formErrors.bloodGroup ? 'border-danger' : 'border-white/10 focus:border-primary'}`}
                          >
                            <option value="">Select Blood Group</option>
                            {bloodGroups.map(bg => (
                              <option key={bg} value={bg}>{bg}</option>
                            ))}
                          </select>
                        </div>
                        {formErrors.bloodGroup && <p className="text-danger text-xs mt-1">{formErrors.bloodGroup}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Email Address *</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Mail size={16} /></span>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full bg-white/5 border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 ${formErrors.email ? 'border-danger' : 'border-white/10 focus:border-primary'}`}
                            placeholder="Your email address"
                          />
                        </div>
                        {formErrors.email && <p className="text-danger text-xs mt-1">{formErrors.email}</p>}
                      </div>
                    </div>

                    {/* Photo Upload */}
                    <div>
                      <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Profile Photo (Optional)</label>
                      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-white/5 border border-dashed border-white/15 rounded-lg">
                        <div className="w-20 h-20 rounded-full border border-primary/30 overflow-hidden bg-black flex items-center justify-center flex-shrink-0">
                          {photoPreview ? (
                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <User size={32} className="text-gray-600" />
                          )}
                        </div>
                        
                        <div className="flex-grow text-center sm:text-left">
                          <p className="text-white text-xs font-semibold mb-1">Upload JPEG/PNG file</p>
                          <p className="text-gray-500 text-[10px] mb-3">File should not exceed 2MB. Square image works best.</p>
                          <label className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/15 rounded text-xs font-bold tracking-wider uppercase text-white cursor-pointer hover:bg-white/5 transition-all">
                            <Upload size={12} />
                            Choose Photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      {formErrors.photo && <p className="text-danger text-xs mt-1">{formErrors.photo}</p>}
                    </div>

                    {/* Register button */}
                    <div className="text-center pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-3 bg-primary text-black font-bold uppercase tracking-wider rounded-md hover:bg-white transition-all shadow-gold-glow disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="animate-spin" size={16} />
                            Processing...
                          </>
                        ) : (
                          'Register Now'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Application Submitted Success View (Pending State) */
                <div className="glass-card p-6 sm:p-10 rounded-xl border border-primary/20 text-center animate-fade-in-up">
                  <div className="flex justify-center mb-4 text-primary">
                    <CheckCircle size={48} />
                  </div>
                  
                  <h3 className="text-white text-2xl font-extrabold tracking-tight mb-2">Registration Submitted!</h3>
                  <p className="text-gray-300 text-sm max-w-lg mx-auto mb-6">
                    Thank you for applying! Your registration is complete and is **pending approval** by the Coordinator of <strong>{registrationSuccess.district}</strong>.
                  </p>
                  
                  <p className="text-gray-400 text-xs max-w-md mx-auto mb-8">
                    Once the coordinator reviews and approves your submission, you will be able to download your official membership card by entering your phone number under the **"Membership Card / Status"** tab.
                  </p>

                  {/* Action CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                      href={getWhatsAppLink(registrationSuccess.district)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-white border border-accent font-bold text-xs uppercase tracking-wider rounded hover:bg-primary hover:text-black hover:border-primary transition-all shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.949h.004c4.368 0 7.927-3.558 7.93-7.93a7.9 7.9 0 0 0-2.327-5.594ZM7.993 14.566c-1.208 0-2.392-.325-3.424-.944l-.245-.145-2.54.666.677-2.476-.159-.253a6.58 6.58 0 0 1-1.008-3.486c.003-3.61 2.95-6.557 6.564-6.557 1.753 0 3.4.683 4.636 1.921A6.56 6.56 0 0 1 14.49 7.93c-.002 3.61-2.948 6.56-6.56 6.566M11.535 9.01c-.193-.096-1.144-.564-1.32-.629-.176-.065-.306-.096-.436.096-.13.193-.503.629-.617.758-.114.129-.228.144-.422.048-.194-.096-.818-.302-1.56-1.004-.576-.514-.966-1.15-1.078-1.343-.114-.194-.012-.3-.109-.395-.088-.085-.176-.206-.264-.309-.088-.103-.118-.175-.177-.293-.059-.118-.03-.22-.015-.316.015-.096.13-.306.194-.458.064-.15.088-.255.044-.351-.044-.096-.436-1.047-.597-1.436-.157-.38-.314-.329-.43-.335-.11-.005-.238-.005-.365-.005-.128 0-.337.048-.514.24-.177.194-.678.662-.678 1.616s.697 1.87 1.005 2.28c.307.411 1.372 2.1 3.326 2.944.465.201.828.322 1.111.412.467.148.89.127 1.226.077.375-.056 1.144-.467 1.305-.919.162-.452.162-.919-.048-.078-.176-.129-.368-.225"/>
                      </svg>
                      Join {registrationSuccess.district} WhatsApp Group
                    </a>

                    <button
                      onClick={() => setSubTab('status')}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-black border border-primary text-xs font-bold uppercase tracking-wider rounded hover:bg-white transition-all shadow-gold-glow"
                    >
                      <Search size={14} /> Check Card Status
                    </button>

                    <button
                      onClick={handleResetForm}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 text-white border border-white/10 text-xs font-bold uppercase tracking-wider rounded hover:bg-white/10 transition-all"
                    >
                      <RefreshCw size={14} /> Register Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STATUS CHECK & DIGITAL CARD LOOKUP */}
          {subTab === 'status' && (
            <div className="glass-card p-6 sm:p-10 rounded-xl border border-white/10">
              {!statusResult ? (
                <div className="max-w-md mx-auto text-center">
                  <h3 className="text-white text-xl font-bold mb-2">Check Membership Status</h3>
                  <p className="text-gray-400 text-sm mb-8">Enter your phone number (0 / +91 prefix accepted) to verify approval and download your card.</p>
                  
                  <form onSubmit={handleCheckStatus} className="space-y-4">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Phone size={16} /></span>
                      <input
                        type="text"
                        value={statusInput}
                        onChange={(e) => { setStatusInput(e.target.value); setStatusError(''); }}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                        placeholder="e.g. +91 9876543210 or 09876543210"
                      />
                    </div>
                    {statusError && (
                      <div className="flex items-center gap-1.5 p-3 rounded bg-danger/10 border border-danger/20 text-danger text-xs font-semibold text-left">
                        <ShieldAlert size={14} className="flex-shrink-0" />
                        <span>{statusError}</span>
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isCheckingStatus}
                      className="w-full py-3 bg-primary text-black font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-all shadow-gold-glow flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {isCheckingStatus ? (
                        <>
                          <RefreshCw className="animate-spin" size={14} />
                          Checking...
                        </>
                      ) : (
                        <>
                          <Search size={14} />
                          Lookup Membership
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* STATUS RESULTS RENDER */
                <div className="text-center animate-fade-in-up">
                  {statusResult.status === 'Pending' && (
                    <div className="max-w-lg mx-auto py-8">
                      <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto mb-4 text-yellow-500">
                        <RefreshCw className="animate-spin" size={24} />
                      </div>
                      <h4 className="text-yellow-500 text-lg font-bold uppercase tracking-wider mb-2">Application Pending</h4>
                      <p className="text-gray-300 text-sm mb-6">
                        Hi <strong>{statusResult.name}</strong>, your membership registration is currently **pending coordinator review** for the <strong>{statusResult.district}</strong> district.
                      </p>
                      <p className="text-gray-400 text-xs mb-8">
                        Coordinators review approvals regularly. Once approved, search your number here again to retrieve your high-quality Digital ID Card.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                          href={getWhatsAppLink(statusResult.district)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-white border border-accent font-bold text-xs uppercase tracking-wider rounded hover:bg-primary hover:text-black hover:border-primary transition-all shadow-lg"
                        >
                          Join {statusResult.district} WhatsApp Group
                        </a>
                        <button
                          onClick={handleResetStatusSearch}
                          className="w-full sm:w-auto px-6 py-3.5 bg-white/5 text-white border border-white/10 text-xs font-bold uppercase tracking-wider rounded hover:bg-white/10 transition-all"
                        >
                          Check Another Number
                        </button>
                      </div>
                    </div>
                  )}

                  {statusResult.status === 'Rejected' && (
                    <div className="max-w-lg mx-auto py-8">
                      <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center mx-auto mb-4 text-danger">
                        <ShieldAlert size={24} />
                      </div>
                      <h4 className="text-danger text-lg font-bold uppercase tracking-wider mb-2">Application Denied</h4>
                      <p className="text-gray-300 text-sm mb-6">
                        Hi <strong>{statusResult.name}</strong>, your membership application for the <strong>{statusResult.district}</strong> district could not be approved at this time.
                      </p>
                      <p className="text-gray-400 text-xs mb-8">
                        This usually happens if your details were invalid. Please submit a new registration or contact your regional coordinator.
                      </p>
                      
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => { setSubTab('register'); handleResetForm(); }}
                          className="px-6 py-3.5 bg-primary text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-white transition-all shadow-gold-glow"
                        >
                          Submit New Application
                        </button>
                        <button
                          onClick={handleResetStatusSearch}
                          className="px-6 py-3.5 bg-white/5 text-white border border-white/10 text-xs font-bold uppercase tracking-wider rounded hover:bg-white/10 transition-all"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Approved Flow */}
                  {statusResult.status === 'Approved' && (
                    <div className="max-w-2xl mx-auto">
                      {/* Sub-flow: Photo upload prompt for approved members who registered without a photo */}
                      {showPhotoPrompt ? (
                        <div className="max-w-md mx-auto py-8 glass-card p-6 sm:p-8 rounded-xl border border-primary/20 text-center">
                          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 text-primary">
                            <ImageIcon size={24} />
                          </div>
                          
                          <h4 className="text-white text-lg font-bold uppercase tracking-wider mb-2">Add Profile Photo?</h4>
                          <p className="text-gray-300 text-xs mb-6">
                            Hi <strong>{statusResult.name}</strong>! Your application is approved. Would you like to upload a profile photo now to print on your official Digital ID card?
                          </p>

                          <div className="flex flex-col gap-3">
                            <label className="w-full py-3 bg-primary text-black font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-all shadow-gold-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                              {isUpdatingPhoto ? (
                                <>
                                  <RefreshCw className="animate-spin" size={14} />
                                  Saving Photo...
                                </>
                              ) : (
                                <>
                                  <Upload size={14} />
                                  Yes, Upload Photo
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                disabled={isUpdatingPhoto}
                                onChange={handlePromptPhotoUpload}
                                className="hidden"
                              />
                            </label>

                            <button
                              onClick={() => setShowPhotoPrompt(false)}
                              disabled={isUpdatingPhoto}
                              className="w-full py-3 bg-white/5 text-white border border-white/10 text-xs font-bold uppercase tracking-wider rounded hover:bg-white/10 transition-all"
                            >
                              No, Skip & Get Card
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Render Approved ID Card */
                        <div>
                          <div className="flex justify-center mb-2 text-primary">
                            <CheckCircle size={36} />
                          </div>
                           <h3 className="text-white text-xl font-extrabold tracking-tight mb-1">Approved & Verified Card!</h3>
                           <p className="text-gray-400 text-xs mb-6">Congratulations <strong>{statusResult.name}</strong>! Your official Gautham Ram Karthik Fan Club Digital ID card is ready.</p>
                          
                          {/* Card Canvas Container */}
                          <div className="flex justify-center mb-8">
                            <div className="overflow-x-auto max-w-full rounded-xl border border-primary/30 id-card-glow bg-black">
                              <canvas ref={canvasRef} className="block max-w-full" style={{ width: '600px', height: '350px' }} />
                            </div>
                          </div>

                          {/* Action CTA Buttons */}
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                              onClick={downloadCard}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-white transition-all shadow-gold-glow"
                            >
                              <Download size={14} />
                              Download Digital ID
                            </button>

                            <a
                              href={getWhatsAppLink(statusResult.district)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-white border border-accent font-bold text-xs uppercase tracking-wider rounded hover:bg-primary hover:text-black hover:border-primary transition-all shadow-lg"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.949h.004c4.368 0 7.927-3.558 7.93-7.93a7.9 7.9 0 0 0-2.327-5.594ZM7.993 14.566c-1.208 0-2.392-.325-3.424-.944l-.245-.145-2.54.666.677-2.476-.159-.253a6.58 6.58 0 0 1-1.008-3.486c.003-3.61 2.95-6.557 6.564-6.557 1.753 0 3.4.683 4.636 1.921A6.56 6.56 0 0 1 14.49 7.93c-.002 3.61-2.948 6.56-6.56 6.566M11.535 9.01c-.193-.096-1.144-.564-1.32-.629-.176-.065-.306-.096-.436.096-.13.193-.503.629-.617.758-.114.129-.228.144-.422.048-.194-.096-.818-.302-1.56-1.004-.576-.514-.966-1.15-1.078-1.343-.114-.194-.012-.3-.109-.395-.088-.085-.176-.206-.264-.309-.088-.103-.118-.175-.177-.293-.059-.118-.03-.22-.015-.316.015-.096.13-.306.194-.458.064-.15.088-.255.044-.351-.044-.096-.436-1.047-.597-1.436-.157-.38-.314-.329-.43-.335-.11-.005-.238-.005-.365-.005-.128 0-.337.048-.514.24-.177.194-.678.662-.678 1.616s.697 1.87 1.005 2.28c.307.411 1.372 2.1 3.326 2.944.465.201.828.322 1.111.412.467.148.89.127 1.226.077.375-.056 1.144-.467 1.305-.919.162-.452.162-.919-.048-.078-.176-.129-.368-.225"/>
                              </svg>
                              Join {statusResult.district} WhatsApp Group
                            </a>

                            <button
                              onClick={handleResetStatusSearch}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 text-white border border-white/10 text-xs font-bold uppercase tracking-wider rounded hover:bg-white/10 transition-all"
                            >
                              <RefreshCw size={14} />
                              Check Another
                            </button>
                          </div>
                        </div>
                      )}
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
};

export default FanClub;
