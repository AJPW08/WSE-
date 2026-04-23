/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { EstudySuiteRouteKey, buildSuiteReaderSrc } from '../utils/estudyUrls';

interface MainContentProps {
  activeNav: string;
  suiteRouteKey: EstudySuiteRouteKey;
  /** Passage string for `q` on Parallel / Interlinear / Bible Plus (e.g. `John 3:16`). */
  passage: string;
}

const WISDOM_STUDY_ENGINE = 'Wisdom Study Engine';

export const MainContent: React.FC<MainContentProps> = ({ activeNav, suiteRouteKey, passage }) => {
  const showStudySuite = activeNav === WISDOM_STUDY_ENGINE;

  const suiteEmbedSrc = useMemo(
    () => buildSuiteReaderSrc(suiteRouteKey, passage),
    [suiteRouteKey, passage],
  );

  return (
    <div
      className={`relative min-h-0 flex-1 bg-white ${
        showStudySuite ? 'overflow-hidden' : 'overflow-y-auto'
      }`}
    >
      {showStudySuite ? (
        <iframe
          key={suiteEmbedSrc}
          src={suiteEmbedSrc}
          title="Wisdom Bible Study Suite"
          className="absolute inset-0 block h-full w-full border-0"
          allow="clipboard-read; clipboard-write; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <div className="flex min-h-full flex-col items-center justify-center gap-4 bg-brand-sepia px-8 py-12 text-center">
          <p className="text-sm text-zinc-600">
            Select <span className="font-semibold text-brand-dark">Wisdom Study Engine</span> in the header to open the
            embedded app.
          </p>
        </div>
      )}
    </div>
  );
};
