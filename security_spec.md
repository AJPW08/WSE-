# Security Specification: Wisdom Study Engine

## Data Invariants
1. A note cannot exist without a valid group ID that the user belongs to.
2. Progress tracking is only allowed for group members.
3. Private notes are absolutely restricted to the owner.
4. Shared notes are restricted to group members.

## The Dirty Dozen Payloads

1. **Identity Spoofing**: Create a note with `user_id` of another user.
2. **Orphaned Write**: Create a progress record for a group the user isn't in.
3. **Privilege Escalation**: Update an assignment as a regular member (not leader/admin).
4. **Data Poisoning**: Inject a 1MB string into a note's `content`.
5. **ID Poisoning**: Use a 10KB string as a `noteId`.
6. **Cross-Group Leak**: Access a private note belonging to a different group.
7. **Snapshot Bypass**: Try to update the `user_id` of an existing note.
8. **Terminal State Break**: (N/A for notes, but status field for progress).
9. **Unauthenticated Read**: Attempt to read any document without an auth token.
10. **Shadow Key Injection**: Add a `hidden_admin: true` field to a user profile.
11. **Bulk Scrape**: Use `list` on `/notes` without a group filter (if rules didn't catch it).
12. **Relationship Orphan**: Assign a plan to a non-existent group.

## Verification Plan
The `firestore.rules` have been designed to block all the above via:
- `isOwner()` and `isMemberOfGroup()` checks.
- `isValidNote()` and `isValidUser()` schema validation.
- `affectedKeys().hasOnly()` for controlled updates.
- `isValidId()` for path hardening.
