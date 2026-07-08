'use client';

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { ToastType } from './ToastContext';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const styles = {
    success: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-[#E50914]/10',
      border: 'border-[#E50914]/30',
      text: 'text-[#E50914]',
      icon: AlertCircle,
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: AlertTriangle,
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: Info,
    },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm ${style.bg} ${style.border} animate-in slide-in-from-right fade-in duration-300`}
    >
      <Icon size={18} className={style.text} />
      <span className={`text-sm font-medium ${style.text}`}>{message}</span>
      <button
        onClick={onClose}
        className={`ml-auto p-1 hover:bg-white/10 rounded transition-colors`}
        aria-label="Close notification"
      >
        <X size={16} className={style.text} />
      </button>
    </div>
  );
}
