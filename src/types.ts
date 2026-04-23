/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  user_id: string;
  user_name: string;
  role: string;
  licensed: boolean;
  membership_level: string;
  church_id: string;
  church_name: string;
}

export interface Group {
  group_id: string;
  group_name: string;
  church_id: string;
  church_name: string;
  group_override: string;
  members: string[];
  role_overrides: Record<string, string>;
}

export interface StudyPlan {
  plan_id: string;
  title: string;
  category: string;
  audience: string;
  difficulty: string;
  plan_type: 'platform' | 'church' | 'private';
  duration_weeks: number;
  length_sessions: number;
  cadence: string;
  format_type: string;
  season_tag: string;
  bible_book_focus: string;
}

export interface Session {
  session_id: string;
  plan_id: string;
  title: string;
  order: number;
  week: number;
  primary_verse: string;
  supporting_verses: string[];
  teaching: string;
  reflection: string;
}

export interface Assignment {
  assignment_id: string;
  group_id: string;
  plan_id: string;
  assigned_by: string;
  assigned_at: string;
}

export interface Progress {
  progress_id: string;
  user_id: string;
  group_id: string;
  session_id: string;
  status: 'completed' | 'not_started';
  completed_at?: string;
}

export interface AppNote {
  note_id: string;
  user_id: string;
  user_name?: string;
  group_id: string;
  plan_id: string;
  session_id: string | null;
  note_type: 'session' | 'verse' | 'plan';
  content: string;
  verse_id: string;
  visibility: 'private' | 'shared_group';
  created_at: string;
}

export interface Permissions {
  can_view_assigned_plans: boolean;
  can_view_assigned_sessions: boolean;
  can_view_unassigned_platform_plans: boolean;
  can_view_unassigned_church_plans: boolean;
  can_view_unassigned_private_plans: boolean;
  can_manage_church: boolean;
  can_manage_licenses: boolean;
  can_assign_plans_church: boolean;
  can_assign_plans_group: boolean;
  can_create_notes: boolean;
  can_edit_notes: boolean;
  can_view_existing_notes: boolean;
  can_track_progress: boolean;
  can_independent_study: boolean;
  can_navigate_sessions: boolean;
  can_monitor_group_progress: boolean;
}

export type NoteType = 'session' | 'verse' | 'plan';
export type Visibility = 'private' | 'shared_group';
