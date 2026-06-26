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

- Firebase authentication
- Firestore operations


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