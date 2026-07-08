'use client';

import { useState, useRef } from 'react';
import { Download, Eye, X } from 'lucide-react';
import { generateMembershipCard, downloadCard } from '@/lib/cardGenerator';

interface MembershipCardPreviewProps {
  member: {
    id: string;
    name: string;
    photo: string;
    district: string;
    joinedDate: string;
  };
  onClose: () => void;
}

export default function MembershipCardPreview({ member, onClose }: MembershipCardPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardUrls, setCardUrls] = useState<{ pngUrl: string; pdfUrl: string } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleGenerateCard = async () => {
    setIsGenerating(true);
    try {
      const memberId = `GRK-${member.id.substring(0, 8).toUpperCase()}`;
      const joinDate = new Date(member.joinedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      const urls = await generateMembershipCard({
        name: member.name,
        memberId,
        district: member.district,
        state: 'Tamil Nadu',
        joinDate,
        photo: member.photo,
        designation: 'Fan Club Member',
      });

      setCardUrls(urls);
    } catch (error) {
      console.error('Failed to generate card:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (type: 'png' | 'pdf') => {
    if (!cardUrls) return;
    const url = type === 'png' ? cardUrls.pngUrl : cardUrls.pdfUrl;
    const filename = `${member.name}_membership_card.${type}`;
    downloadCard(url, filename);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#0B0F19] to-[#1a2947] rounded-2xl border border-[#FFD700]/30 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[#FFD700]">Membership Card Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Member Info */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-white font-bold mb-2">{member.name}</h3>
          <p className="text-sm text-gray-400">
            District: <span className="text-[#FFD700]">{member.district}</span>
          </p>
          <p className="text-sm text-gray-400">
            Member Since: <span className="text-[#FFD700]">{member.joinedDate}</span>
          </p>
        </div>

        {/* Card Preview Reference */}
        <div
          ref={cardRef}
          className="mb-6 bg-gradient-to-br from-[#0B0F19] to-[#1a2947] rounded-xl border-2 border-[#FFD700] p-6 shadow-2xl"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgba(11, 15, 25, 0.9) 0%, rgba(26, 41, 71, 0.9) 100%)',
          }}
        >
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#FFD700]">
            <div className="text-lg font-bold text-[#FFD700] uppercase tracking-widest">
              GRK Fan Club
            </div>
          </div>

          <div className="flex gap-4 items-start mb-4">
            {/* Photo */}
            <div className="w-20 h-20 rounded-lg border-2 border-[#FFD700] overflow-hidden flex-shrink-0">
              <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="text-[#FFD700] font-bold text-lg mb-1">{member.name}</div>
              <div className="text-xs text-gray-300 mb-2">
                ID: GRK-{member.id.substring(0, 8).toUpperCase()}
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <div>District: {member.district}</div>
                <div>Joined: {member.joinedDate}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-400 pt-3 border-t border-[#FFD700]/30">
            <span>www.gauthamramkarthik.com</span>
            <span className="text-[#FFD700]">{new Date().getFullYear()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleGenerateCard}
            disabled={isGenerating}
            className="flex-1 px-4 py-3 bg-[#FFD700] text-[#0B0F19] rounded-lg font-bold hover:bg-white disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Eye size={18} />
            {isGenerating ? 'Generating...' : 'Generate Card'}
          </button>

          {cardUrls && (
            <>
              <button
                onClick={() => handleDownload('png')}
                className="flex-1 px-4 py-3 bg-[#E50914]/20 text-[#E50914] rounded-lg font-bold hover:bg-[#E50914]/30 transition-all flex items-center justify-center gap-2 border border-[#E50914]/30"
              >
                <Download size={18} />
                PNG
              </button>
              <button
                onClick={() => handleDownload('pdf')}
                className="flex-1 px-4 py-3 bg-emerald-600/20 text-emerald-400 rounded-lg font-bold hover:bg-emerald-600/30 transition-all flex items-center justify-center gap-2 border border-emerald-600/30"
              >
                <Download size={18} />
                PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
