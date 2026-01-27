# Firestore Security Rules

To fix the Firebase permission error for messages, apply these security rules in your Firebase Console:

## Steps:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project "casak7la"
3. Go to **Firestore Database** → **Rules**
4. Replace the existing rules with the code below:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products collection - readable by everyone
    match /products/{document=**} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Orders collection - guests and authenticated users can create, admins can read/update
    match /orders/{document=**} {
      allow create: if true;  // Anyone can create orders (guests or authenticated)
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Contact Messages collection - writable by everyone, readable by admin only
    match /contact_messages/{document=**} {
      allow create: if true;  // Anyone can submit a message (no auth required)
      allow read, delete, update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Users collection
    match /users/{userId} {
      allow read: if request.auth.uid == userId || 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      allow write: if request.auth.uid == userId;
    }

    // Cart collection
    match /users/{userId}/cart/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }

    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Troubleshooting:

If you're still getting permission errors after applying the rules, try these **temporary rules** for testing (NOT for production):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Temporarily allow all access for testing
    allow read, write: if true;
  }
}
```

Then test if the message submission works. If it does, your code is correct and you need to adjust the security rules properly.

## What these rules do:
- ✅ Anyone can **submit** contact messages (no authentication required)
- ✅ Only **admin users** can **read** and **delete** messages
- ✅ Orders are only readable/writable by admins
- ✅ Products are readable by everyone but editable only by admins
- ✅ Users can manage their own data

**Important:** Make sure your admin users have `isAdmin: true` in their user document!
