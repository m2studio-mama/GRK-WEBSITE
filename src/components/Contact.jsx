import React, { useState } from 'react';
import { Mail, MessageSquare, Tag, User, Send, CheckCircle, ArrowUp, MapPin, Phone } from 'lucide-react';

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YoutubeIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/>
  </svg>
);

const TwitterIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const Contact = ({ onAdminClick }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSending(true);
    // Simulate contact form submission
    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const socialLinks = [
    { icon: InstagramIcon, href: 'https://instagram.com', color: 'hover:text-primary hover:border-primary', label: 'Instagram' },
    { icon: FacebookIcon, href: 'https://facebook.com', color: 'hover:text-primary hover:border-primary', label: 'Facebook' },
    { icon: YoutubeIcon, href: 'https://youtube.com', color: 'hover:text-primary hover:border-primary', label: 'YouTube' },
    { icon: TwitterIcon, href: 'https://twitter.com', color: 'hover:text-primary hover:border-primary', label: 'Twitter' }
  ];

  return (
    <section id="contact" className="pt-24 bg-background relative overflow-hidden">
      <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <p className="text-primary text-xs uppercase tracking-[0.2em] font-semibold mb-2">Get In Touch</p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Contact <span className="text-primary text-glow-gold">Gautham Ram Karthik Fan Club</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-accent to-primary mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-stretch">
          
          {/* Contact Details & Socials */}
          <div className="lg:col-span-5 flex flex-col justify-between glass-card p-8 sm:p-10 rounded-xl border border-white/5">
            <div>
              <h3 className="text-white text-xl font-bold tracking-wide mb-6">Fan Club Admin Office</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Official contact coordinates for Gautham Ram Karthik Fan Club Administration. For registrations, coordinator updates, or official press inquiries, contact our central desk.
              </p>
              
              <div className="space-y-5 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Headquarters:</strong><br />
                    Muthuraman Towers, T. Nagar,<br />
                    Chennai, Tamil Nadu - 600017
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-primary w-5 h-5 flex-shrink-0" />
                  <span>office@gauthamramkarthik.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-primary w-5 h-5 flex-shrink-0" />
                  <span>+91 94440 12345 / 044-2435 6789</span>
                </div>
              </div>
            </div>

            {/* Social Links Grid */}
            <div className="mt-10 pt-8 border-t border-white/5">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Follow Gautham Ram Karthik</h4>
              <div className="flex items-center gap-4">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-white/5 text-gray-400 border border-white/10 ${social.color} hover:bg-white/10 hover:border-white/20 transition-all duration-300`}
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 glass-card p-8 sm:p-10 rounded-xl border border-white/5">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-fade-in-up">
                <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
                <h3 className="text-white text-xl font-bold mb-2">Message Sent Successfully!</h3>
                <p className="text-gray-400 text-sm max-w-sm">
                  Thank you for reaching out. A representative from Gautham Ram Karthik Fan Club will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Your Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><User size={16} /></span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 ${formErrors.name ? 'border-danger' : 'border-white/10 focus:border-primary'}`}
                      placeholder="Enter your name"
                    />
                  </div>
                  {formErrors.name && <p className="text-danger text-xs mt-1">{formErrors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><Mail size={16} /></span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 ${formErrors.email ? 'border-danger' : 'border-white/10 focus:border-primary'}`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {formErrors.email && <p className="text-danger text-xs mt-1">{formErrors.email}</p>}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Subject</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><Tag size={16} /></span>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 ${formErrors.subject ? 'border-danger' : 'border-white/10 focus:border-primary'}`}
                      placeholder="What is this regarding?"
                    />
                  </div>
                  {formErrors.subject && <p className="text-danger text-xs mt-1">{formErrors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full bg-white/5 border rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 ${formErrors.message ? 'border-danger' : 'border-white/10 focus:border-primary'}`}
                    placeholder="Type your message here..."
                  />
                  {formErrors.message && <p className="text-danger text-xs mt-1">{formErrors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-black font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-all shadow-gold-glow disabled:opacity-50"
                >
                  <Send size={14} />
                  {isSending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* SWA-STYLE INTEGRATED 3-COLUMN FOOTER */}
        <footer className="border-t border-white/10 pt-16 pb-12 relative overflow-hidden bg-[#0B0F19] w-full">
          {/* Watermark Actor Cutout in Background (Positioned on the Far Right Edge, completely clear of text) */}
          <div className="absolute bottom-0 right-0 h-full w-[300px] pointer-events-none z-0 overflow-hidden select-none hidden lg:block">
            <img 
              src="/gautham_about.jpg" 
              className="h-full w-full object-cover object-[center_15%]" 
              style={{ 
                maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                filter: 'brightness(0.9) contrast(1.15) grayscale(5%)'
              }}
              alt="Gautham Ram Karthik Footer Cutout" 
            />
          </div>

          {/* Centered Content Container */}
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-10">
              
              {/* Column 1: Contact Info (Location, Mobile, Email) */}
              <div className="md:col-span-5 space-y-6">
                <div className="space-y-5">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center flex-shrink-0 shadow-md">
                      <MapPin className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-white text-xs font-semibold uppercase tracking-wider block mb-0.5">Location</span>
                      <p className="text-white text-base font-bold leading-snug max-w-[320px]">
                        No. 75 Thiruvalluvar Salai, Ramapuram Road, Valasaravakkam, Chennai – 600087.
                      </p>
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center flex-shrink-0 shadow-md">
                      <Phone className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-white text-xs font-semibold uppercase tracking-wider block mb-0.5">Mobile No</span>
                      <a href="tel:+918122267108" className="text-white text-base font-bold leading-snug hover:text-primary transition-colors">
                        +91 81222 67108
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center flex-shrink-0 shadow-md">
                      <Mail className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-white text-xs font-semibold uppercase tracking-wider block mb-0.5">Email</span>
                      <a href="mailto:allindiagkfc@gmail.com" className="text-white text-base font-bold leading-snug hover:text-primary transition-colors break-all">
                        allindiagkfc@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div className="md:col-span-3">
                <h4 className="text-xl font-bold text-white tracking-wide uppercase mb-1">Quick Links</h4>
                <div className="w-16 h-0.5 bg-primary mb-6" />
                <ul className="space-y-4 text-sm text-white font-medium">
                  <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
                  <li><a href="#welfare" className="hover:text-primary transition-colors">Our Journey</a></li>
                  <li><a href="#filmography" className="hover:text-primary transition-colors">Gallery</a></li>
                  <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
                  <li><a href="#fan-club" className="hover:text-primary transition-colors">REGISTRATION</a></li>
                </ul>
              </div>

              {/* Column 3: Map Embed */}
              <div className="md:col-span-4 relative z-10">
                <h4 className="text-xl font-bold text-white tracking-wide uppercase mb-1">Location</h4>
                <div className="w-16 h-0.5 bg-primary mb-6" />
                <div className="w-[300px] h-[250px] rounded overflow-hidden border border-white/10 shadow-lg bg-black">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3886.9677405957254!2d80.18138507507754!3d13.037725387283688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDAyJzE1LjgiTiA4MMKwMTEnMDIuMyJF!5e0!3m2!1sen!2sin!4v1774794392560!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Headquarters Location Map"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

            </div>

            {/* Bottom copyright row */}
            <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              <p className="text-xs text-gray-400 font-normal">
                &copy; <a href="#" className="font-semibold text-primary hover:underline">gauthamramkarthik</a> {new Date().getFullYear()}. All rights reserved.
              </p>
              
              <div className="flex items-center gap-6">
                <span className="text-xs text-gray-500 font-medium">
                  Developed by <span className="text-primary font-semibold">Abhishek</span>
                </span>
                
                <button
                  onClick={scrollToTop}
                  className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg cursor-pointer"
                  title="Back To Top"
                >
                  <ArrowUp size={20} className="stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
