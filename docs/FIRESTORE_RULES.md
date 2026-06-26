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
