/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { X, BookOpen, Layers, GitBranch, Sparkles } from 'lucide-react';
import { EstudySuiteRouteKey } from '../utils/estudyUrls';

export interface EstudyLauncherModalProps {
  open: boolean;
  verseRef: string;
  onClose: () => void;
  /** Updates the main content iframe to this suite route (no new-tab redirect). */
  onSelectSuite: (suite: EstudySuiteRouteKey) => void;
}

export const EstudyLauncherModal: React.FC<EstudyLauncherModalProps> = ({
  open,
  verseRef,
  onClose,
  onSelectSuite,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const options = [
    {
      suite: 'parallelBible' as const,
      label: 'Parallel Bible',
      description: 'Compare translations side by side.',
      icon: Layers,
    },
    {
      suite: 'interlinear' as const,
      label: 'Interlinear',
      description: 'Original-language lines with glosses.',
      icon: BookOpen,
    },
    {
      suite: 'crossReference' as const,
      label: 'Cross-Reference Bible',
      description: 'On web, q is for Treasury word search, not passage navigation.',
      icon: GitBranch,
    },
    {
      suite: 'biblePlus' as const,
      label: 'Bible Plus',
      description: 'Enhanced Bible study tools.',
      icon: Sparkles,
    },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="estudy-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/20">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-6 py-5">
          <div>
            <h2 id="estudy-modal-title" className="font-display text-xl font-black tracking-tight text-brand-dark">
              Bible Study Suite
            </h2>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-400">
              Choose a view for the main panel
            </p>
            {verseRef ? (
              <p className="mt-3 text-sm font-semibold text-brand-orange">{verseRef}</p>
            ) : (
              <p className="mt-3 text-sm text-zinc-500">No verse reference — suite opens without context.</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-brand-dark"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        <ul className="flex flex-col gap-2 p-4">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <li key={opt.suite}>
                <button
                  type="button"
                  onClick={() => onSelectSuite(opt.suite)}
                  className="flex w-full items-start gap-4 rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-4 text-left transition hover:border-brand-orange/40 hover:bg-brand-sepia active:scale-[0.99]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-dark text-brand-orange">
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-brand-dark">{opt.label}</span>
                    <span className="mt-0.5 block text-xs text-zinc-500">{opt.description}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
