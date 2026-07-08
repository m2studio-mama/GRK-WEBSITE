'use client';

import { Share2, Mail } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  description?: string;
  url?: string;
}

export default function ShareButtons({ title, description = '', url = typeof window !== 'undefined' ? window.location.href : '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\n' + url)}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ShareIcon = ({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      title={label}
      className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700]/30 hover:bg-white/10 transition-all duration-300"
      aria-label={label}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-xs uppercase tracking-wider font-bold">Share:</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => window.open(shareLinks.facebook, '_blank', 'width=600,height=400')}
          title="Share on Facebook"
          className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700]/30 hover:bg-white/10 transition-all duration-300"
          aria-label="Share on Facebook"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </button>
        <button
          onClick={() => window.open(shareLinks.twitter, '_blank', 'width=600,height=400')}
          title="Share on Twitter"
          className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700]/30 hover:bg-white/10 transition-all duration-300"
          aria-label="Share on Twitter"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 002.856-3.615v-.34c0-.355-.023-.679-.075-1.004a6.957 6.957 0 01-1.946.749c.969-.566 1.771-1.495 2.165-2.585-.906.537-1.91.934-2.994 1.146.896-1.036 1.494-2.51 1.494-4.16 0-.916-.166-1.79-.53-2.626a19.736 19.736 0 00-5.618 1.316 6.205 6.205 0 00-5.03 4.528 6.185 6.185 0 00-.155 2.043 17.648 17.648 0 01-12.802-6.526 6.2 6.2 0 00-.835 3.12c0 2.15.55 4.165 1.53 5.948a6.165 6.165 0 01-2.815-.775v.08c0 3.01 2.14 5.53 4.982 6.1a6.177 6.177 0 01-2.81.106 6.211 6.211 0 005.787 4.31 12.425 12.425 0 01-7.695 2.655c-.5 0-.996-.025-1.492-.076a17.595 17.595 0 009.541 2.797c11.45 0 17.682-9.492 17.682-17.702 0-.27-.006-.537-.016-.803a12.609 12.609 0 003.088-3.216z"/></svg>
        </button>
        <button
          onClick={() => window.open(shareLinks.linkedin, '_blank', 'width=600,height=400')}
          title="Share on LinkedIn"
          className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700]/30 hover:bg-white/10 transition-all duration-300"
          aria-label="Share on LinkedIn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.474-2.231-1.663-2.231-1.32 0-2.105.883-2.456 1.735-.126.308-.158.738-.158 1.168v4.897h-3.554V9.04h3.554v1.342c.42-.647 1.168-1.571 2.84-1.571 2.074 0 3.63 1.355 3.63 4.267v6.374zM6.095 8.717c-1.145 0-2.08-.932-2.08-2.073s.935-2.073 2.08-2.073c1.144 0 2.08.932 2.08 2.073s-.936 2.073-2.08 2.073zm1.751 11.735H4.344V9.04h3.502v11.412zM23.996 0H.002C0 0 0 .006.002.019v23.962c0 .012 0 .019-.002.019h23.994c.012 0 .004-.007.004-.019V.019C24 .006 24 0 23.996 0z"/></svg>
        </button>
        <button
          onClick={() => window.open(shareLinks.whatsapp, '_blank')}
          title="Share on WhatsApp"
          className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700]/30 hover:bg-white/10 transition-all duration-300"
          aria-label="Share on WhatsApp"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.762c0 2.6.854 5.017 2.288 6.978L2.323 22.039l7.364-2.447a9.842 9.842 0 004.7 1.202h.005c5.432 0 9.748-4.317 9.748-9.747 0-2.6-.854-5.017-2.288-6.978a9.847 9.847 0 00-7.101-2.95M12.002 0C5.869 0 .974 4.895.974 11.026c0 1.91.505 3.799 1.469 5.43L.045 23.974l6.974-2.31a11.026 11.026 0 005.313 1.344h.022C18.135 23.008 23.026 18.113 23.026 11.026 23.026 4.895 18.134 0 12.002 0"/></svg>
        </button>
        <ShareIcon
          icon={Mail}
          label="Share via Email"
          onClick={() => window.open(shareLinks.email)}
        />
        <button
          onClick={copyToClipboard}
          className={`px-2 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all ${
            copied
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500'
              : 'bg-white/5 border border-white/10 text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700]/30'
          }`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
