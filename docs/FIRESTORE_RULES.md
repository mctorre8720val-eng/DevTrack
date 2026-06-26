# Recommended Firestore Security Rules (dev)

Use these rules as a starting point. Deploy them carefully and adapt to your app's needs.

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /Projects/{projectId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.ownerId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.ownerId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.ownerId;
    }

    // Fallback: require auth for all other documents
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

/* Rules for ProjectShares collection */
match /databases/{database}/documents {
  match /ProjectShares/{shareId} {
    // Read access: owner or the shared user
    allow get, list: if request.auth != null && (
      resource.data.ownerId == request.auth.uid || resource.data.uid == request.auth.uid
    );

    // Create: only the project owner may create a share (check incoming ownerId)
    allow create: if request.auth != null && request.resource.data.ownerId == request.auth.uid;

    // Delete: only the project owner may delete a share
    allow delete: if request.auth != null && resource.data.ownerId == request.auth.uid;

    // Prevent clients from elevating roles on themselves
    allow update: if false;
  }
}

/* Presence and Activities rules */
match /databases/{database}/documents {
  match /Presence/{uid} {
    // Users may write their own presence
    allow write: if request.auth != null && request.auth.uid == uid;
    allow read: if request.auth != null;
  }

  match /Activities/{activityId} {
    // Allow write if authenticated (client should record actorUid as request.auth.uid)
    allow create: if request.auth != null && request.auth.uid == request.resource.data.actorUid;
    allow read: if request.auth != null;
    allow update, delete: if false;
  }
}
