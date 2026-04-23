/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  userName: string;
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

type NavItem = {
  name: string;
  /** If set, opens in a new tab; does not change active in-app nav (Wisdom Study Engine stays highlighted). */
  href?: string;
};

export const Header: React.FC<HeaderProps> = ({ userName, activeNav, setActiveNav }) => {
  const navItems: NavItem[] = [
    { name: 'Home', href: 'https://www.wisdomebooksclub.com/' },
    { name: 'Pearls of Wisdom', href: 'https://www.wisdomebooksclub.com/pearls-of-wisdom' },
    { name: 'eBook Library', href: 'https://app.wisdomebooksclub.com/book-library' },
    { name: 'Bible Study Suite', href: 'https://app.wisdomebooksclub.com/' },
    { name: 'My Library', href: 'https://app.wisdomebooksclub.com/my-library' },
    { name: 'Wisdom Study Engine' },
  ];

  return (
    <header className="z-50 flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-brand-dark px-6 text-white">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center overflow-hidden">
             <img src="https://picsum.photos/seed/wisdom_logo/100/100" alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold leading-none tracking-tight">Wisdom <span className="text-brand-orange">eBooks</span> Club</span>
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-4 h-full">
          {navItems.map((item) => {
            const active = activeNav === item.name;
            const className = `h-16 px-4 text-sm font-medium transition-colors relative flex items-center gap-2 ${
              active ? 'text-brand-orange' : 'text-zinc-400 hover:text-white'
            }`;

            const underline =
              active ? (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-brand-orange"
                />
              ) : null;

            if (item.href) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${className} no-underline`}
                >
                  {item.name}
                  {underline}
                </a>
              );
            }

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setActiveNav(item.name)}
                className={className}
              >
                {item.name}
                {underline}
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 mr-2">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Account</span>
            <span className="text-xs font-medium text-zinc-300">{userName}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center cursor-pointer overflow-hidden group">
            <User size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};
