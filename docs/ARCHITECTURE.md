# Architecture

## Application Structure

DevTrack follows a React frontend architecture.

## Pages

Pages represent full screens.

Examples:

- Login
- Register
- Dashboard
- Projects
- Tasks


## Components

Reusable UI elements.

Examples:

- Navbar
- Sidebar
- Button
- Card
- Form


## Services

Business logic.

Examples:


## Collaboration model

- Roles: `owner`, `editor`, `viewer`. Owners can share and delete projects. Editors can edit project content. Viewers can only read.
- Sharing data model: new top-level collection `ProjectShares` with documents { projectId, ownerId, uid, role, createdAt }.
- Access query patterns: list shares for a project via `getSharesByProject(projectId)`, list projects shared to a user via `getSharedProjectsForUser(uid)`.
- Realtime: subscribe to shares for a user with `subscribeSharedProjectsForUser(uid, cb)` to show incoming invites/ access changes in the UI.

Implementation notes:
- `src/services/shareService.js` provides `shareProject`, `revokeShareById`, `getSharesByProject`, `getSharedProjectsForUser`, and `subscribeSharedProjectsForUser`.
- Firestore rules should enforce that only the project `ownerId` can create/revoke shares; see `docs/FIRESTORE_RULES.md` for a basic template (extend to include `ProjectShares`).


## Database Structure

Firestore:

Users

    userId
        name
        email


Projects

    projectId
        title
        description
        ownerId


Tasks

    taskId
        title
        status
        projectId


## Data Flow

User

↓

React Component

↓

Service Layer

↓

Firebase

↓

Firestore