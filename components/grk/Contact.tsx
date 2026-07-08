'use client';

import { useState } from 'react';
import { Mail, Tag, User, Send, CheckCircle, ArrowUp, MapPin, Phone } from 'lucide-react';

const SocialIcon = ({ children, href, label }: { children: React.ReactNode; href: string; label: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
    className="p-3 rounded-full bg-white/5 text-gray-400 border border-white/10 hover:text-[#FFD700] hover:border-[#FFD700]/30 hover:bg-white/10 transition-all duration-300">
    {children}
  </a>
);

export default function Contact({ onAdminClick }: { onAdminClick: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    }, 1500);
  };

  const inputCls = (field: string) =>
    `w-full bg-white/5 border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/8 transition-colors ${errors[field] ? 'border-[#E50914]' : 'border-white/10 focus:border-[#FFD700]/50'}`;

  return (
    <section id="contact" className="pt-24 bg-[#0B0F19] relative overflow-hidden">
      <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-[#FFD700]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-[#E50914]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <p className="text-[#FFD700] text-xs uppercase tracking-[0.2em] font-bold mb-3">Get In Touch</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight text-balance">
            Contact <span className="text-[#FFD700] text-glow-gold">Fan Club</span>
          </h2>
          <div className="w-16 h-1 bg-[#FFD700] mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-stretch">
          {/* Contact Details */}
          <div className="lg:col-span-5 glass-card p-8 sm:p-10 rounded-2xl border border-white/6 flex flex-col justify-between">
            <div>
              <h3 className="text-white text-xl font-black mb-4">Fan Club Admin Office</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 font-serif">
                Official contact coordinates for Gautham Ram Karthik Fan Club Administration. For registrations, coordinator updates, or press inquiries.
              </p>
              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="text-[#FFD700] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">No. 75 Thiruvalluvar Salai, Ramapuram Road, Valasaravakkam,<br />Chennai – 600087.</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-[#FFD700] w-5 h-5 flex-shrink-0" />
                  <a href="mailto:allindiagkfc@gmail.com" className="text-gray-300 hover:text-[#FFD700] transition-colors">allindiagkfc@gmail.com</a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-[#FFD700] w-5 h-5 flex-shrink-0" />
                  <a href="tel:+918122267108" className="text-gray-300 hover:text-[#FFD700] transition-colors">+91 81222 67108</a>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/6">
              <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4">Follow Gautham Ram Karthik</h4>
              <div className="flex items-center gap-3">
                <SocialIcon href="https://instagram.com" label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </SocialIcon>
                <SocialIcon href="https://facebook.com" label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </SocialIcon>
                <SocialIcon href="https://youtube.com" label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/></svg>
                </SocialIcon>
                <SocialIcon href="https://twitter.com" label="X (Twitter)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </SocialIcon>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 glass-card p-8 sm:p-10 rounded-2xl border border-white/6">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-fade-in-up">
                <CheckCircle className="text-emerald-500 w-14 h-14 mb-4" />
                <h3 className="text-white text-xl font-black mb-2">Message Sent!</h3>
                <p className="text-gray-400 text-sm max-w-sm font-serif">
                  Thank you for reaching out. A representative from the Fan Club will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label className="block text-gray-300 text-[10px] font-black uppercase tracking-wider mb-2">Your Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><User size={15} /></span>
                    <input type="text" name="name" value={form.name} onChange={handleChange} className={inputCls('name')} placeholder="Enter your name" />
                  </div>
                  {errors.name && <p className="text-[#E50914] text-[10px] mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-gray-300 text-[10px] font-black uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><Mail size={15} /></span>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className={inputCls('email')} placeholder="Enter email address" />
                  </div>
                  {errors.email && <p className="text-[#E50914] text-[10px] mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-gray-300 text-[10px] font-black uppercase tracking-wider mb-2">Subject</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><Tag size={15} /></span>
                    <input type="text" name="subject" value={form.subject} onChange={handleChange} className={inputCls('subject')} placeholder="What is this regarding?" />
                  </div>
                  {errors.subject && <p className="text-[#E50914] text-[10px] mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-gray-300 text-[10px] font-black uppercase tracking-wider mb-2">Message</label>
                  <textarea name="message" rows={4} value={form.message} onChange={handleChange}
                    className={`w-full bg-white/5 border rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/8 transition-colors resize-none ${errors.message ? 'border-[#E50914]' : 'border-white/10 focus:border-[#FFD700]/50'}`}
                    placeholder="Type your message here..." />
                  {errors.message && <p className="text-[#E50914] text-[10px] mt-1">{errors.message}</p>}
                </div>

                <button type="submit" disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#FFD700] text-[#0B0F19] font-black uppercase tracking-wider text-xs rounded hover:bg-white transition-all shadow-gold-glow disabled:opacity-50">
                  <Send size={13} /> {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/8 pt-16 pb-12 relative overflow-hidden" role="contentinfo">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-10">
            {/* Contact Column */}
            <div className="md:col-span-5 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#FFD700] text-[#0B0F19] flex items-center justify-center flex-shrink-0 shadow-gold-glow">
                  <MapPin className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-white text-[10px] font-black uppercase tracking-wider block mb-0.5">Location</span>
                  <p className="text-white text-sm font-bold leading-snug max-w-xs">No. 75 Thiruvalluvar Salai, Ramapuram Road, Valasaravakkam, Chennai – 600087.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#FFD700] text-[#0B0F19] flex items-center justify-center flex-shrink-0 shadow-gold-glow">
                  <Phone className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-white text-[10px] font-black uppercase tracking-wider block mb-0.5">Mobile</span>
                  <a href="tel:+918122267108" className="text-white text-sm font-bold hover:text-[#FFD700] transition-colors">+91 81222 67108</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#FFD700] text-[#0B0F19] flex items-center justify-center flex-shrink-0 shadow-gold-glow">
                  <Mail className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-white text-[10px] font-black uppercase tracking-wider block mb-0.5">Email</span>
                  <a href="mailto:allindiagkfc@gmail.com" className="text-white text-sm font-bold hover:text-[#FFD700] transition-colors break-all">allindiagkfc@gmail.com</a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3">
              <h4 className="text-white text-lg font-black uppercase mb-1">Quick Links</h4>
              <div className="w-14 h-0.5 bg-[#FFD700] mb-5" />
              <nav aria-label="Footer navigation">
                <ul className="space-y-3 text-sm">
                  {[['#home','Home'],['#welfare','Our Journey'],['#filmography','Filmography'],['#media-library','Media Library'],['#fan-club','Registration'],['#contact','Contact']].map(([href, label]) => (
                    <li key={href}>
                      <a href={href} className="text-gray-300 hover:text-[#FFD700] transition-colors font-semibold">{label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Map */}
            <div className="md:col-span-4">
              <h4 className="text-white text-lg font-black uppercase mb-1">Location</h4>
              <div className="w-14 h-0.5 bg-[#FFD700] mb-5" />
              <div className="w-full max-w-xs h-52 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3886.9677405957254!2d80.18138507507754!3d13.037725387283688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDAyJzE1LjgiTiA4MMKwMTEnMDIuMyJF!5e0!3m2!1sen!2sin!4v1774794392560!5m2!1sen!2sin"
                  width="100%" height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Fan Club Headquarters Location"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Copyright row */}
          <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              &copy; <a href="#" className="font-semibold text-[#FFD700] hover:underline">gauthamramkarthik</a> {new Date().getFullYear()}. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <span className="text-xs text-gray-600 font-medium">
                Developed by <span className="text-[#FFD700] font-semibold">Abishek.U</span>
              </span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-10 h-10 rounded-full bg-[#FFD700] text-[#0B0F19] flex items-center justify-center hover:bg-white transition-all duration-300 shadow-gold-glow"
                aria-label="Back to top"
              >
                <ArrowUp size={18} className="stroke-[2.5]" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
