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
  group_id: string;
  plan_id: string;
  session_id: string | null;
  note_type: 'session' | 'verse' | 'plan';
  content: string;
  verse_id: string;
  visibility: 'private' | 'shared_group';
  created_at: string;
}

export const initialUsers: User[] = [
  { user_id: "u1", user_name: "Michael Admin", role: "admin", licensed: false, membership_level: "Admin", church_id: "church_01", church_name: "First Baptist Demo" },
  { user_id: "u2", user_name: "Hans Leader", role: "leader", licensed: true, membership_level: "Bible Study Plus", church_id: "church_01", church_name: "First Baptist Demo" },
  { user_id: "u3", user_name: "Member One", role: "member", licensed: true, membership_level: "Bible Study Plus", church_id: "church_01", church_name: "First Baptist Demo" },
  { user_id: "u4", user_name: "Observer One", role: "observer", licensed: true, membership_level: "Free", church_id: "church_01", church_name: "First Baptist Demo" },
  { user_id: "u5", user_name: "Admin Two", role: "admin", licensed: false, membership_level: "Admin", church_id: "church_02", church_name: "Grace Community" },
  { user_id: "u6", user_name: "Leader Two", role: "leader", licensed: true, membership_level: "Bible Study Plus", church_id: "church_02", church_name: "Grace Community" },
  { user_id: "u7", user_name: "Member Two", role: "member", licensed: false, membership_level: "Bible Study Plus", church_id: "church_02", church_name: "Grace Community" },
  { user_id: "u8", user_name: "Observer Two", role: "observer", licensed: false, membership_level: "Free", church_id: "church_02", church_name: "Grace Community" },
  { user_id: "u9", user_name: "Leader Three", role: "leader", licensed: true, membership_level: "Bible Study Plus", church_id: "church_01", church_name: "First Baptist Demo" },
  { user_id: "u10", user_name: "Member Three", role: "member", licensed: true, membership_level: "Bible Study Plus", church_id: "church_01", church_name: "First Baptist Demo" },
  { user_id: "u11", user_name: "Member Four", role: "member", licensed: true, membership_level: "Bible Study Plus", church_id: "church_02", church_name: "Grace Community" },
  { user_id: "u12", user_name: "Observer Three", role: "observer", licensed: false, membership_level: "Free", church_id: "church_01", church_name: "First Baptist Demo" }
];

export const initialGroups: Group[] = [
  { group_id: "g1", group_name: "Men's Group", church_id: "church_01", church_name: "First Baptist Demo", group_override: "None", members: ["u1","u2","u3","u4","u9","u10"], role_overrides: { u1:"admin", u2:"leader", u3:"member", u4:"observer", u9:"leader", u10:"member" } },
  { group_id: "g2", group_name: "Women's Study", church_id: "church_02", church_name: "Grace Community", group_override: "Women's study access", members: ["u5","u6","u7","u8","u11"], role_overrides: { u5:"admin", u6:"leader", u7:"member", u8:"observer", u11:"member" } },
  { group_id: "g3", group_name: "New Believers Class", church_id: "church_01", church_name: "First Baptist Demo", group_override: "None", members: ["u1","u3","u10","u12"], role_overrides: { u1:"admin", u3:"member", u10:"member", u12:"observer" } },
  { group_id: "g4", group_name: "Leadership Track", church_id: "church_02", church_name: "Grace Community", group_override: "Leadership bundle", members: ["u5","u6"], role_overrides: { u5:"admin", u6:"leader" } },
  { group_id: "g5", group_name: "Prayer Team", church_id: "church_01", church_name: "First Baptist Demo", group_override: "None", members: ["u1","u2","u3","u9"], role_overrides: { u1:"admin", u2:"leader", u3:"member", u9:"leader" } },
  { group_id: "g6", group_name: "Marriage Study", church_id: "church_02", church_name: "Grace Community", group_override: "None", members: ["u5","u6","u11"], role_overrides: { u5:"admin", u6:"leader", u11:"member" } },
  { group_id: "g7", group_name: "Wednesday Night Bible Study", church_id: "church_01", church_name: "First Baptist Demo", group_override: "None", members: ["u1","u2","u3","u4","u9","u10","u12"], role_overrides: { u1:"admin", u2:"leader", u3:"member", u4:"observer", u9:"leader", u10:"member", u12:"observer" } },
  { group_id: "g_new_01", group_name: "Young Adults Study", church_id: "church_01", church_name: "First Baptist Demo", group_override: "none", members: ["u1","u3","u4","u7","u9","u10"], role_overrides: { u1:"admin", u3:"member", u4:"observer", u7:"member", u9:"leader", u10:"member" } }
];

export const initialStudyPlans: StudyPlan[] = [
  { plan_id: "8_Week_Prayer", title: "8 Week Prayer", category: "prayer", audience: "general", difficulty: "intermediate", plan_type: "platform", duration_weeks: 8, length_sessions: 8, cadence: "weekly", format_type: "structured", season_tag: "none", bible_book_focus: "psalms" },
  { plan_id: "4_Week_Faith", title: "4 Week Faith", category: "faith", audience: "general", difficulty: "beginner", plan_type: "platform", duration_weeks: 4, length_sessions: 4, cadence: "weekly", format_type: "structured", season_tag: "none", bible_book_focus: "john" },
  { plan_id: "Book_John", title: "Book of John", category: "bible_book", audience: "general", difficulty: "intermediate", plan_type: "platform", duration_weeks: 6, length_sessions: 6, cadence: "weekly", format_type: "structured", season_tag: "none", bible_book_focus: "john" },
  { plan_id: "Church_Foundations_2026", title: "Church Foundations 2026", category: "foundations", audience: "general", difficulty: "beginner", plan_type: "church", duration_weeks: 4, length_sessions: 4, cadence: "weekly", format_type: "structured", season_tag: "none", bible_book_focus: "acts" },
  { plan_id: "Private_Men_Retreat_2026", title: "Men's Retreat 2026 (Private)", category: "spiritual_growth", audience: "men", difficulty: "intermediate", plan_type: "private", duration_weeks: 1, length_sessions: 3, cadence: "daily", format_type: "flexible", season_tag: "none", bible_book_focus: "various" },
  { plan_id: "Prayer_Foundations", title: "Prayer Foundations", category: "prayer", audience: "general", difficulty: "beginner", plan_type: "platform", duration_weeks: 4, length_sessions: 4, cadence: "weekly", format_type: "structured", season_tag: "none", bible_book_focus: "various" }
];

export const initialSessions: Record<string, Session[]> = {
  "8_Week_Prayer": [
    { session_id:"s_8_Week_Prayer_1", plan_id:"8_Week_Prayer", title:"Session 1: The Heart of Prayer", order:1, week:1, primary_verse:"Matthew 6:6", supporting_verses:["Matthew 6:9", "Philippians 4:6"], teaching:"This is a prototype teaching block for 8 Week Prayer, session 1.", reflection:"What stands out to you from session 1 in 8 Week Prayer?" },
    { session_id:"s_8_Week_Prayer_2", plan_id:"8_Week_Prayer", title:"Session 2: Prayer and Faith", order:2, week:2, primary_verse:"James 5:16", supporting_verses:["Psalm 23:1", "Romans 12:2"], teaching:"This is a prototype teaching block for 8 Week Prayer, session 2.", reflection:"How does prayer shape your response to others?" }
  ],
  "4_Week_Faith": [
    { session_id:"s_4_Week_Faith_1", plan_id:"4_Week_Faith", title:"Session 1: Faith Defined", order:1, week:1, primary_verse:"Hebrews 11:1", supporting_verses:["Romans 10:17", "Mark 9:24"], teaching:"Prototype teaching block for 4 Week Faith, session 1.", reflection:"Where do you need faith to grow most right now?" },
    { session_id:"s_4_Week_Faith_2", plan_id:"4_Week_Faith", title:"Session 2: Faith in Action", order:2, week:2, primary_verse:"Romans 10:17", supporting_verses:["James 2:17", "Hebrews 12:2"], teaching:"Prototype teaching block for 4 Week Faith, session 2.", reflection:"What helps your faith stay active?" }
  ],
  "Book_John": [
    { session_id:"s_Book_John_1", plan_id:"Book_John", title:"Session 1: In the Beginning", order:1, week:1, primary_verse:"John 1:1", supporting_verses:["John 1:14", "John 20:31"], teaching:"Prototype teaching block for Book of John, session 1.", reflection:"What does John emphasize about Jesus from the beginning?" }
  ],
  "Church_Foundations_2026": [
    { session_id:"s_Church_Foundations_2026_1", plan_id:"Church_Foundations_2026", title:"Session 1: Foundations of the Church", order:1, week:1, primary_verse:"Acts 2:42", supporting_verses:["Ephesians 4:11", "1 Corinthians 12:12"], teaching:"Prototype teaching block for Church Foundations 2026, session 1.", reflection:"What are the core marks of a healthy church?" }
  ],
  "Private_Men_Retreat_2026": [
    { session_id:"s_Private_Men_Retreat_2026_1", plan_id:"Private_Men_Retreat_2026", title:"Session 1: Courage and Calling", order:1, week:1, primary_verse:"Joshua 1:9", supporting_verses:["Psalm 1:1", "Proverbs 27:17"], teaching:"Prototype teaching block for Men’s Retreat 2026, session 1.", reflection:"What kind of courage is needed in this season?" }
  ],
  "Prayer_Foundations": [
    { session_id:"s_Prayer_Foundations_1", plan_id:"Prayer_Foundations", title:"Session 1: Foundations of Prayer", order:1, week:1, primary_verse:"Matthew 6:6", supporting_verses:["Philippians 4:6", "Psalm 5:3"], teaching:"Prototype teaching block for Prayer Foundations.", reflection:"How can prayer become more consistent in your life?" }
  ]
};

export const initialAssignments: Assignment[] = [
  { assignment_id:"a1", group_id:"g1", plan_id:"4_Week_Faith", assigned_by:"u1", assigned_at:"2026-04-01T00:00:00Z" },
  { assignment_id:"a2", group_id:"g2", plan_id:"Church_Foundations_2026", assigned_by:"u6", assigned_at:"2026-04-02T00:00:00Z" },
  { assignment_id:"a3", group_id:"g_new_01", plan_id:"8_Week_Prayer", assigned_by:"u9", assigned_at:"2026-04-08T13:12:19Z" },
  { assignment_id:"a4", group_id:"g1", plan_id:"Private_Men_Retreat_2026", assigned_by:"u2", assigned_at:"2026-04-08T15:03:00Z" },
  { assignment_id:"a5", group_id:"g5", plan_id:"Prayer_Foundations", assigned_by:"u1", assigned_at:"2026-04-09T10:00:00Z" },
  { assignment_id:"a6", group_id:"g5", plan_id:"8_Week_Prayer", assigned_by:"u1", assigned_at:"2026-04-10T10:00:00Z" }
];

export const initialProgress: Progress[] = [
  { progress_id:"p_u3_g_new_01_s_8_Week_Prayer_1", user_id:"u3", group_id:"g_new_01", session_id:"s_8_Week_Prayer_1", status:"completed", completed_at:"2026-04-08T14:12:57Z" },
  { progress_id:"p_u2_g5_s_Prayer_Foundations_1", user_id:"u2", group_id:"g5", session_id:"s_Prayer_Foundations_1", status:"completed", completed_at:"2026-04-09T14:12:57Z" },
  { progress_id:"p_u3_g5_s_Prayer_Foundations_1", user_id:"u3", group_id:"g5", session_id:"s_Prayer_Foundations_1", status:"completed", completed_at:"2026-04-09T14:22:57Z" },
  { progress_id:"p_u9_g5_s_Prayer_Foundations_1", user_id:"u9", group_id:"g5", session_id:"s_Prayer_Foundations_1", status:"completed", completed_at:"2026-04-09T14:35:57Z" }
];

export const initialNotes: AppNote[] = [
  { note_id:"n_u3_s1_01", user_id:"u3", group_id:"g_new_01", plan_id:"8_Week_Prayer", session_id:"s_8_Week_Prayer_1", note_type:"session", content:"Reflecting on the power of prayer in session 1.", verse_id:"", visibility:"private", created_at:"2026-04-08T14:14:34Z" },
  { note_id:"n_u3_v1_01", user_id:"u3", group_id:"g_new_01", plan_id:"8_Week_Prayer", session_id:"s_8_Week_Prayer_1", note_type:"verse", content:"Matthew 6:6 reminds me that prayer begins in private devotion.", verse_id:"Matthew 6:6", visibility:"private", created_at:"2026-04-08T14:14:45Z" },
  { note_id:"n_u2_shared_01", user_id:"u2", group_id:"g5", plan_id:"Prayer_Foundations", session_id:null, note_type:"plan", content:"This study is helping our team focus on consistent prayer.", verse_id:"", visibility:"shared_group", created_at:"2026-04-09T11:00:00Z" },
  { note_id:"n_u3_shared_sess", user_id:"u3", group_id:"g_new_01", plan_id:"8_Week_Prayer", session_id:"s_8_Week_Prayer_1", note_type:"session", content:"Shared reflection: private prayer changes public strength.", verse_id:"", visibility:"shared_group", created_at:"2026-04-09T11:10:00Z" }
];
