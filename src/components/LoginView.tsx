/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { LogIn, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginView: React.FC = () => {
  const { signIn } = useFirebase();

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 bg-[url('https://picsum.photos/seed/wisdom_library/1920/1080?blur=10')] bg-cover bg-center">
      <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 bg-white p-10 rounded-[40px] shadow-2xl max-w-md w-full text-center border border-white/20"
      >
        <div className="w-20 h-20 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-orange/20">
          <Sparkles size={40} className="text-white" />
        </div>
        
        <h1 className="text-4xl font-display font-black text-brand-dark tracking-tighter mb-2">WISDOM STUDY</h1>
        <p className="text-zinc-500 font-serif mb-10 leading-relaxed italic">"The fear of the Lord is the beginning of wisdom."</p>
        
        <button 
          onClick={signIn}
          className="w-full py-4 bg-brand-dark hover:bg-zinc-800 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] group"
        >
          <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
          Sign in with Google
        </button>
        
        <p className="text-[10px] text-zinc-400 mt-8 leading-relaxed">
          Access your personalized study plans, group reflections, and cross-reference tools.
        </p>
      </motion.div>
    </div>
  );
};
