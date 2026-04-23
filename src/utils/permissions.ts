/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Group, Permissions } from '../types';

export function getRoleInGroup(user: User, group: Group): string {
  return (group.role_overrides && group.role_overrides[user.user_id]) || user.role;
}

export function resolvePermissions(context: {
  role_in_group: string;
  membership_level: string;
  licensed: boolean;
}): Permissions {
  const perms: Permissions = {
    can_view_assigned_plans: true,
    can_view_assigned_sessions: true,
    can_view_unassigned_platform_plans: context.role_in_group !== "observer",
    can_view_unassigned_church_plans: false,
    can_view_unassigned_private_plans: false,
    can_manage_church: context.role_in_group === "admin",
    can_manage_licenses: context.role_in_group === "admin",
    can_assign_plans_church: context.role_in_group === "admin",
    can_assign_plans_group: context.role_in_group === "admin" || context.role_in_group === "leader",
    can_create_notes: context.licensed && context.role_in_group !== "observer",
    can_edit_notes: context.licensed && context.role_in_group !== "observer",
    can_view_existing_notes: context.role_in_group !== "observer",
    can_track_progress: context.role_in_group !== "observer",
    can_independent_study: context.role_in_group !== "observer",
    can_navigate_sessions: true,
    can_monitor_group_progress: context.role_in_group === "admin" || context.role_in_group === "leader"
  };

  if (context.role_in_group === "observer") {
    perms.can_view_unassigned_platform_plans = false;
    perms.can_view_unassigned_church_plans = false;
    perms.can_view_unassigned_private_plans = false;
    perms.can_create_notes = false;
    perms.can_edit_notes = false;
    perms.can_view_existing_notes = false;
    perms.can_track_progress = false;
    perms.can_independent_study = false;
    perms.can_assign_plans_group = false;
    perms.can_monitor_group_progress = false;
  }

  return perms;
}
