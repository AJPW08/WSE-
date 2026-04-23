/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SidebarItem = ({ title, children, count, isOpen: initialOpen = false, icon: Icon }: { title: string, children: React.ReactNode, count?: number, isOpen?: boolean, icon?: any }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  
  return (
    <div className="border-b border-zinc-200 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} className="text-brand-orange" />}
          <span className="font-bold text-sm tracking-tight text-zinc-800">{title} {count !== undefined && `(${count})`}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform duration-300 text-zinc-400 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Card = ({ title, subtitle, children, icon: Icon, active = false }: { title: string, subtitle?: string, children: React.ReactNode, icon?: any, active?: boolean }) => (
  <div className={`rounded-xl overflow-hidden border transition-all ${active ? 'border-brand-orange shadow-md' : 'border-zinc-200 shadow-sm'}`}>
    <div className={`${active ? 'bg-brand-orange text-white' : 'bg-zinc-900 text-white'} p-3 flex items-center gap-2`}>
      {Icon && <Icon size={16} />}
      <span className="text-[10px] font-bold uppercase tracking-wider">{title}</span>
    </div>
    <div className="p-4 bg-white">
      {subtitle && <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-3">{subtitle}</p>}
      {children}
    </div>
  </div>
);

export const ProgressCircle = ({ percent }: { percent: number }) => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    <svg className="w-full h-full transform -rotate-90">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-200" />
      <circle 
        cx="24" cy="24" r="20" 
        stroke="currentColor" strokeWidth="4" 
        fill="transparent" 
        strokeDasharray={125.6} 
        strokeDashoffset={125.6 - (125.6 * percent / 100)} 
        className="text-brand-orange transition-all duration-1000 ease-out" 
      />
    </svg>
    <span className="absolute text-[10px] font-bold text-zinc-800">{percent}%</span>
  </div>
);
