'use client';

import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { subscribeNewsletter } from '@/lib/firebase/db';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email');
      return;
    }

    setStatus('loading');
    try {
      const result = await subscribeNewsletter(email);
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Subscription failed. Try again.');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#0B0F19] to-[#0B0F19] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E50914]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <p className="text-[#FFD700] text-xs uppercase tracking-[0.2em] font-bold mb-3">Stay Updated</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Subscribe to <span className="text-[#FFD700]">News & Updates</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Get the latest news about Gautham Ram Karthik, upcoming releases, and exclusive updates delivered to your inbox.
          </p>
        </div>

        <div className="glass-card p-8 rounded-2xl border border-white/6">
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your email address"
                  disabled={status === 'success'}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:bg-white/8 focus:border-[#FFD700]/50 transition-colors disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="px-8 py-3 bg-gradient-to-r from-[#FFD700] to-[#E50914] text-[#0B0F19] font-black text-sm uppercase tracking-wider rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/50 disabled:opacity-50 transition-all whitespace-nowrap"
              >
                {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {status === 'success' && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm animate-in fade-in">
                <CheckCircle size={16} />
                <span>{message}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 text-[#E50914] text-sm animate-in fade-in">
                <AlertCircle size={16} />
                <span>{message}</span>
              </div>
            )}
          </form>

          <p className="text-gray-500 text-xs mt-4 text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
