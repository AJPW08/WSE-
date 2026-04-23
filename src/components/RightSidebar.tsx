/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { BookMarked, X, Settings, Copy, Trash2, BookOpen, Share2, Shield, Eye, ArrowUpDown, Calendar, LayoutList } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppNote, NoteType, Visibility } from '../types';

interface RightSidebarProps {
  notes: AppNote[];
  sharedNotes: AppNote[];
  activeNoteType: NoteType;
  setActiveNoteType: (type: NoteType) => void;
  noteContent: string;
  setNoteContent: (content: string) => void;
  noteVisibility: Visibility;
  setNoteVisibility: (v: Visibility) => void;
  onSaveNote: () => void;
  onDeleteNote: (id: string) => void;
  isLicensed: boolean;
  role: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

type SortOption = 'newest' | 'oldest' | 'type';

export const RightSidebar: React.FC<RightSidebarProps> = ({
  notes,
  sharedNotes,
  activeNoteType,
  setActiveNoteType,
  noteContent,
  setNoteContent,
  noteVisibility,
  setNoteVisibility,
  onSaveNote,
  onDeleteNote,
  isLicensed,
  role,
  isCollapsed,
  onToggleCollapse
}) => {
  const [showShared, setShowShared] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'type') return a.note_type.localeCompare(b.note_type);
      return 0;
    });
  }, [notes, sortBy]);

  return (
    <div className="relative flex h-full">
      {/* Toggle Button - Floating on the left edge */}
      <button
        onClick={onToggleCollapse}
        className={`absolute top-1/2 -left-4 z-50 transform -translate-y-1/2 w-8 h-12 bg-white border border-zinc-200 shadow-lg rounded-xl flex items-center justify-center text-zinc-400 hover:text-brand-orange transition-all group ${isCollapsed ? 'translate-x-1' : ''}`}
        title={isCollapsed ? "Expand Notes" : "Collapse Notes"}
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <BookMarked size={16} className="group-hover:scale-110 transition-transform" />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ 
          width: isCollapsed ? 0 : 380,
          opacity: isCollapsed ? 0 : 1,
          x: isCollapsed ? 20 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="border-l border-zinc-200 bg-zinc-50 flex flex-col overflow-hidden shadow-2xl z-20"
      >
        <div className="w-[380px] h-full flex flex-col">
          {/* Header */}
          <div className="p-6 bg-white border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookMarked className="text-brand-orange" size={20} />
          <div className="flex flex-col">
            <h2 className="text-lg font-black text-brand-dark tracking-tight leading-none mb-1">NOTES ENGINE</h2>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Personal</span>
              <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full text-[10px] font-black">
                {notes.length}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={onToggleCollapse}
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toggle between Personal and Shared */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex p-1 bg-zinc-200 rounded-xl">
             <button 
               onClick={() => setShowShared(false)}
               className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${!showShared ? 'bg-white text-brand-dark shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
             >
               <Shield size={12} />
               Personal
             </button>
             <button 
               onClick={() => setShowShared(true)}
               className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${showShared ? 'bg-brand-orange text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
             >
               <Share2 size={12} />
               Group Shared
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar space-y-6">
          {!showShared ? (
            <>
              {/* Note Creation Form */}
              {isLicensed && role !== 'observer' ? (
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-5">
                  <div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 block">Category</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['session', 'verse', 'plan'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setActiveNoteType(type)}
                          className={`py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all border ${
                            activeNoteType === type 
                              ? 'bg-brand-dark border-brand-dark text-white shadow-md' 
                              : 'bg-white border-zinc-100 text-zinc-500 hover:border-zinc-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                     <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Insight</span>
                       <span className="text-[10px] font-bold text-zinc-300">Markdown supported</span>
                     </div>
                    <textarea 
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Capture your reflection here..."
                      className="w-full h-32 p-4 bg-zinc-50 border border-zinc-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-orange/10 text-sm font-serif shadow-inner placeholder:italic"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                    <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${noteVisibility === 'private' ? 'bg-zinc-200 text-zinc-500' : 'bg-brand-orange/10 text-brand-orange'}`}>
                         {noteVisibility === 'private' ? <Shield size={16} /> : <Share2 size={16} />}
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[10px] font-black uppercase tracking-tight text-zinc-700">
                           {noteVisibility === 'private' ? 'Private Insight' : 'Group Shared'}
                         </span>
                         <span className="text-[9px] text-zinc-400 font-medium">Only you can see this note</span>
                       </div>
                    </div>
                    <button 
                      onClick={() => setNoteVisibility(noteVisibility === 'private' ? 'shared_group' : 'private')}
                      className={`w-10 h-5 rounded-full relative transition-colors ${noteVisibility === 'private' ? 'bg-zinc-300' : 'bg-brand-orange'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${noteVisibility === 'private' ? 'left-1' : 'left-6'}`} />
                    </button>
                  </div>

                  <button 
                    onClick={onSaveNote}
                    disabled={!noteContent.trim()}
                    className="w-full py-4 bg-brand-orange hover:bg-orange-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-orange/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    DEPLOY NOTE TO ENGINE
                  </button>
                </div>
              ) : (
                <div className="p-6 bg-zinc-100 border border-dashed border-zinc-300 rounded-2xl text-center">
                  <Shield size={32} className="mx-auto text-zinc-400 mb-3" />
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Observer Status</p>
                  <p className="text-[10px] text-zinc-400 mt-1">Notes are available for licensed members only.</p>
                </div>
              )}

              {/* Personal Notes List */}
              <div className="pt-4 pb-20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Eye size={12} />
                    Saved Perspectives
                  </h3>
                  <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-lg">
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest pl-2 pr-1">Sort:</span>
                    <button 
                      onClick={() => setSortBy('newest')}
                      className={`p-1.5 rounded-md transition-all ${sortBy === 'newest' ? 'bg-white text-brand-orange shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                      title="Newest First"
                    >
                      <ArrowUpDown size={12} />
                    </button>
                    <button 
                      onClick={() => setSortBy('oldest')}
                      className={`p-1.5 rounded-md transition-all ${sortBy === 'oldest' ? 'bg-white text-brand-orange shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                      title="Oldest First"
                    >
                      <Calendar size={12} />
                    </button>
                    <button 
                      onClick={() => setSortBy('type')}
                      className={`p-1.5 rounded-md transition-all ${sortBy === 'type' ? 'bg-white text-brand-orange shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                      title="Sort by Type"
                    >
                      <LayoutList size={12} />
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {sortedNotes.length > 0 ? (
                      sortedNotes.map((note) => (
                        <motion.div
                          key={note.note_id}
                          layout
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.95, opacity: 0 }}
                          whileHover={{ y: -2 }}
                          className={`p-6 bg-white rounded-2xl border-l-[6px] border border-zinc-100 space-y-4 relative group shadow-sm hover:shadow-xl hover:border-zinc-200 transition-all ${
                            note.note_type === 'session' ? 'border-l-brand-orange' : 
                            note.note_type === 'verse' ? 'border-l-blue-500' : 'border-l-zinc-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`text-[8px] uppercase font-black tracking-[0.15em] px-2 py-0.5 rounded-full border ${
                                note.note_type === 'session' ? 'bg-orange-50 border-orange-100 text-orange-600' : 
                                note.note_type === 'verse' ? 'bg-blue-50 border-blue-100 text-blue-600' : 
                                'bg-zinc-100 border-zinc-200 text-zinc-600'
                              }`}>
                                {note.note_type}
                              </span>
                              {note.visibility === 'shared_group' && (
                                <span className="flex items-center gap-1 text-[8px] font-black text-brand-orange uppercase tracking-widest bg-brand-orange/5 px-2 py-0.5 rounded-full">
                                  <Share2 size={8} />
                                  Shared
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                className="w-8 h-8 rounded-xl flex items-center justify-center bg-zinc-50 text-zinc-400 hover:text-brand-orange hover:bg-white border border-transparent hover:border-zinc-100 shadow-sm transition-all active:scale-95"
                                title="Copy Content"
                              >
                                <Copy size={14} />
                              </button>
                              <button 
                                onClick={() => onDeleteNote(note.note_id)}
                                className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-500 hover:text-white shadow-sm transition-all active:scale-95"
                                title="Delete Note"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="relative">
                            <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-zinc-50" />
                            <p className="text-[15px] font-serif leading-[1.65] text-zinc-800 italic indent-2">
                              {note.content}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                            {note.verse_id ? (
                              <button className="flex items-center gap-2 text-[10px] font-black text-brand-orange uppercase tracking-widest hover:text-brand-dark transition-colors group/link">
                                <div className="w-5 h-5 rounded-md bg-brand-orange/10 flex items-center justify-center group-hover/link:bg-brand-orange transition-colors">
                                  <BookOpen size={10} className="group-hover/link:text-white" />
                                </div>
                                {note.verse_id}
                              </button>
                            ) : <div />}
                            <div className="flex flex-col items-end">
                              <span className="text-[9px] font-black text-zinc-300 uppercase tracking-tighter">{note.created_at}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-zinc-400 italic text-xs">Your notes container is currently empty.</div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          ) : (
            /* Shared Notes List */
            <div className="py-2 pb-20">
               <h3 className="text-[10px] font-black text-brand-orange uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Share2 size={12} />
                 Collective Wisdom
              </h3>
              <div className="space-y-4">
                {sharedNotes.length > 0 ? (
                  sharedNotes.map(note => (
                    <div key={note.note_id} className="p-5 bg-white rounded-2xl border-l-4 border-l-brand-orange border-zinc-100 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-white text-[8px] font-black">
                             {note.user_name?.[0] || 'U'}
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{note.user_name}</span>
                         </div>
                         <span className="text-[9px] font-bold text-zinc-300 uppercase">{note.created_at}</span>
                      </div>
                      <p className="text-sm font-serif text-zinc-700 leading-relaxed italic">"{note.content}"</p>
                      <div className="flex items-center gap-2">
                         <span className="text-[8px] font-black uppercase tracking-wider text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">{note.note_type}</span>
                         {note.verse_id && <span className="text-[8px] font-black uppercase tracking-wider text-brand-orange">{note.verse_id}</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-zinc-400 italic text-xs">No shared group reflections available in this topic.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.div>
</div>
  );
};
