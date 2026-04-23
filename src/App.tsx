/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Staging Build Sync - Marker
 */

import React, { useState, useMemo, useEffect } from 'react';
import { initialUsers, initialGroups, initialStudyPlans, initialSessions, initialAssignments, initialProgress, initialNotes } from './data';
import { User, Group, StudyPlan, Session, Assignment, Progress, AppNote, NoteType, Visibility, Permissions } from './types';
import { resolvePermissions, getRoleInGroup } from './utils/permissions';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { MainContent } from './components/MainContent';
import { useFirebase } from './context/FirebaseContext';
import { LoginView } from './components/LoginView';
import { EstudyLauncherModal } from './components/EstudyLauncherModal';
import type { EstudySuiteRouteKey } from './utils/estudyUrls';
import { db, collection, query, where, onSnapshot, addDoc, doc, deleteDoc, handleFirestoreError } from './lib/firebase';

export default function App() {
  const { user, appUser, loading } = useFirebase();

  // --- Real-time State from Firestore ---
  const [notes, setNotes] = useState<AppNote[]>([]);
  const [userProgress, setUserProgress] = useState<Progress[]>([]);

  // --- Bible Study Suite iframe + launcher ---
  const [estudyLauncher, setEstudyLauncher] = useState<{ open: boolean; verseRef: string }>({
    open: false,
    verseRef: '',
  });
  const [suiteRouteKey, setSuiteRouteKey] = useState<EstudySuiteRouteKey>('parallelBible');
  const [suitePassageOverride, setSuitePassageOverride] = useState<string | null>(null);

  // --- Local UI State ---
  const [selectedPlanId, setSelectedPlanId] = useState<string>("8_Week_Prayer");
  const [selectedSessionOrder, setSelectedSessionOrder] = useState<number>(1);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("g_new_01");
  const [activeNav, setActiveNav] = useState('Wisdom Study Engine');
  const [isNotesCollapsed, setIsNotesCollapsed] = useState(false);
  
  const [activeNoteType, setActiveNoteType] = useState<NoteType>('session');
  const [noteContent, setNoteContent] = useState('');
  const [noteVisibility, setNoteVisibility] = useState<Visibility>('private');

  // --- Sync Data ---
  useEffect(() => {
    if (!user || !selectedGroupId) return;

    // Pulse Notes
    const notesQuery = query(
      collection(db, 'notes'),
      where('group_id', '==', selectedGroupId)
    );
    
    const unsubNotes = onSnapshot(notesQuery, (snapshot) => {
      const syncedNotes = snapshot.docs.map(doc => ({
        ...doc.data(),
        note_id: doc.id
      })) as AppNote[];
      setNotes(syncedNotes);
    }, (err) => console.error("Notes Sync Error:", err));

    // Pulse Progress
    const progressQuery = query(
      collection(db, 'progress'),
      where('user_id', '==', user.uid),
      where('group_id', '==', selectedGroupId)
    );

    const unsubProgress = onSnapshot(progressQuery, (snapshot) => {
      const syncedProgress = snapshot.docs.map(doc => ({
        ...doc.data(),
        progress_id: doc.id
      })) as Progress[];
      setUserProgress(syncedProgress);
    }, (err) => console.error("Progress Sync Error:", err));

    return () => {
      unsubNotes();
      unsubProgress();
    };
  }, [user, selectedGroupId]);

  // --- Computed Context ---
  const currentGroup = useMemo(() => initialGroups.find(g => g.group_id === selectedGroupId)!, [selectedGroupId]);
  
  const context = useMemo(() => ({
    role_in_group: appUser ? getRoleInGroup(appUser, currentGroup) : 'member',
    membership_level: appUser?.membership_level || 'Free',
    licensed: appUser?.licensed || true
  }), [appUser, currentGroup]);

  const permissions = useMemo(() => resolvePermissions(context), [context]);

  // --- Data Selectors ---
  const assignedPlans = useMemo(() => {
    const ids = initialAssignments.filter(a => a.group_id === selectedGroupId).map(a => a.plan_id);
    return initialStudyPlans.filter(p => ids.includes(p.plan_id));
  }, [selectedGroupId]);

  const currentPlan = useMemo(() => initialStudyPlans.find(p => p.plan_id === selectedPlanId) || assignedPlans[0] || initialStudyPlans[0], [selectedPlanId, assignedPlans]);
  const sessions = useMemo(() => initialSessions[currentPlan.plan_id] || [], [currentPlan]);
  const currentSession = useMemo(() => sessions.find(s => s.order === selectedSessionOrder) || sessions[0], [sessions, selectedSessionOrder]);

  useEffect(() => {
    setSuitePassageOverride(null);
  }, [currentSession.session_id, currentPlan.plan_id]);

  const passageForSuite = suitePassageOverride ?? currentSession?.primary_verse ?? '';

  const personalNotes = useMemo(() => notes.filter(n => 
    n.user_id === user?.uid && 
    n.group_id === selectedGroupId && 
    n.plan_id === currentPlan.plan_id &&
    ((n.note_type === 'plan' && n.session_id === null) || (n.note_type !== 'plan' && n.session_id === currentSession?.session_id))
  ), [notes, user, selectedGroupId, currentPlan, currentSession]);

  const sharedNotes = useMemo(() => notes.filter(n => 
    n.visibility === 'shared_group' && 
    n.user_id !== user?.uid && 
    n.group_id === selectedGroupId && 
    n.plan_id === currentPlan.plan_id &&
    ((n.note_type === 'plan' && n.session_id === null) || (n.note_type !== 'plan' && n.session_id === currentSession?.session_id))
  ), [notes, user, selectedGroupId, currentPlan, currentSession]);

  const progressPercent = useMemo(() => {
    const completed = userProgress.filter(p => 
      sessions.some(s => s.session_id === p.session_id) && 
      p.status === 'completed'
    ).length;
    return Math.round((completed / (sessions.length || 1)) * 100);
  }, [userProgress, sessions]);

  // --- Handlers ---
  const handleSaveNote = async () => {
    if (!noteContent.trim() || !user) return;
    try {
      const noteData = {
        user_id: user.uid,
        user_name: user.displayName || 'User',
        group_id: selectedGroupId,
        plan_id: currentPlan.plan_id,
        session_id: activeNoteType === 'plan' ? null : currentSession.session_id,
        note_type: activeNoteType,
        content: noteContent,
        verse_id: activeNoteType === 'verse' ? currentSession.primary_verse : '',
        visibility: noteVisibility,
        created_at: new Date().toISOString()
      };
      await addDoc(collection(db, 'notes'), noteData);
      setNoteContent('');
    } catch (err) {
      handleFirestoreError(err, 'create', 'notes');
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (err) {
      handleFirestoreError(err, 'delete', `notes/${id}`);
    }
  };

  const handleComplete = async () => {
    if (!permissions.can_track_progress || !user) return;
    const exists = userProgress.find(p => p.session_id === currentSession.session_id);
    if (!exists) {
      try {
        await addDoc(collection(db, 'progress'), {
          user_id: user.uid,
          group_id: selectedGroupId,
          session_id: currentSession.session_id,
          status: 'completed',
          completed_at: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, 'create', 'progress');
      }
    }
  };

  const openEstudyLauncher = (verseRef: string) =>
    setEstudyLauncher({ open: true, verseRef });
  const closeEstudyLauncher = () => setEstudyLauncher({ open: false, verseRef: '' });

  const selectEstudySuiteInMain = (suite: EstudySuiteRouteKey) => {
    const fromModal = estudyLauncher.verseRef.trim();
    setSuitePassageOverride(fromModal.length > 0 ? fromModal : null);
    setSuiteRouteKey(suite);
    closeEstudyLauncher();
  };

  if (loading) return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user || !appUser) return <LoginView />;

  return (
    <div className="flex h-full min-h-0 max-h-[100dvh] flex-col overflow-hidden bg-zinc-100 font-sans">
      <EstudyLauncherModal
        open={estudyLauncher.open}
        verseRef={estudyLauncher.verseRef}
        onClose={closeEstudyLauncher}
        onSelectSuite={selectEstudySuiteInMain}
      />
      <Header userName={appUser.user_name} activeNav={activeNav} setActiveNav={setActiveNav} />
      
      <main className="flex min-h-0 flex-1 overflow-hidden">
        <LeftSidebar 
          session={currentSession}
          plan={currentPlan}
          assignedPlans={assignedPlans}
          selectedPlanId={selectedPlanId}
          setSelectedPlan={setSelectedPlanId}
          onComplete={handleComplete}
          progressPercent={progressPercent}
          onOpenEstudyLauncher={openEstudyLauncher}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            <MainContent
              activeNav={activeNav}
              suiteRouteKey={suiteRouteKey}
              passage={passageForSuite}
            />
          </div>
        </div>

        <RightSidebar 
          notes={personalNotes}
          sharedNotes={sharedNotes}
          activeNoteType={activeNoteType}
          setActiveNoteType={setActiveNoteType}
          noteContent={noteContent}
          setNoteContent={setNoteContent}
          noteVisibility={noteVisibility}
          setNoteVisibility={setNoteVisibility}
          onSaveNote={handleSaveNote}
          onDeleteNote={handleDeleteNote}
          isLicensed={appUser.licensed}
          role={context.role_in_group}
          isCollapsed={isNotesCollapsed}
          onToggleCollapse={() => setIsNotesCollapsed(!isNotesCollapsed)}
        />
      </main>
    </div>
  );
}
