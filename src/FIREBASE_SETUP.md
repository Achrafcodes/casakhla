# Firebase Setup Guide for CASAKA7LA

This application uses Firebase for authentication and product database management. Follow these steps to set up your Firebase backend:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or "Create a project"
3. Enter project name: `casaka7la` (or your preferred name)
4. Follow the setup wizard (Google Analytics is optional)

## Step 2: Register Your Web App

1. In the Firebase Console, click the web icon (`</>`) to add a web app
2. Register app with nickname: "CASAKA7LA Web App"
3. Copy the Firebase configuration object

## Step 3: Update Firebase Configuration

1. Open `/lib/firebase.ts`
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get Started"
3. Enable **Email/Password** sign-in method
4. Enable **Google** sign-in method (optional but recommended)
   - Add your email as an authorized domain if needed

## Step 5: Set Up Firestore Database

1. In Firebase Console, go to **Build > Firestore Database**
2. Click "Create database"
3. Choose **Start in production mode** (we'll set up rules next)
4. Select your preferred location (choose closest to your users)

## Step 6: Configure Firestore Security Rules

1. In Firestore Database, go to the **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - authenticated users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products collection - anyone can read, only admins can write
    match /products/{productId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Orders collection - only admins can read and write
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

3. Click **Publish** to save the rules

## Step 7: Test Your Setup

### Create an Admin Account:
1. Sign up with an email containing "admin" (e.g., `admin@casaka7la.com`)
2. You'll automatically get admin privileges
3. Access the Admin Dashboard via the shield icon in the header

### Test Product Management:
1. As an admin, navigate to Admin Dashboard
2. Click "Add Product" to create a new product
3. Products will be saved to Firestore and persist across sessions

## Database Schema

### Users Collection (`users/{userId}`)
```typescript
{
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isAdmin: boolean;
  createdAt: string;
}
```

### Products Collection (`products/{productId}`)
```typescript
{
  title: string;
  category: string;
  price: string;
  description?: string;
  images: string[]; // Array of image URLs
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Orders Collection (`orders/{orderId}`)
```typescript
{
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  totalAmount: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Admin Access

Users with emails containing "admin" automatically receive admin privileges:
- `admin@example.com` ✅
- `admin123@test.com` ✅
- `myadmin@casaka7la.com` ✅
- `user@example.com` ❌

## Authentication Features

- ✅ Email/Password signup and login
- ✅ Google Sign-In
- ✅ Automatic admin role detection
- ✅ Session persistence across page refreshes
- ✅ Secure password hashing (handled by Firebase)
- ✅ User profile management

## Product Management Features (Admin Only)

- ✅ Add new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ Real-time sync across all users
- ✅ Image URL support
- ✅ Category management

## Troubleshooting

### "Firebase: Error (auth/api-key-not-valid)"
- Check that you've replaced the placeholder API key in `/lib/firebase.ts`

### "Missing or insufficient permissions"
- Verify Firestore security rules are correctly set up
- Make sure you're logged in with an admin account

### "Failed to get document"
- Check that Firestore Database is created and active
- Verify your internet connection

### Google Sign-In not working
- Add authorized domains in Firebase Console:
  - Authentication > Settings > Authorized domains
  - Add your deployment domain

## Next Steps

Once Firebase is configured:
1. Deploy to production (Firebase Hosting, Vercel, etc.)
2. Add your production domain to Firebase authorized domains
3. Update CORS settings if needed
4. Consider adding Firebase Storage for product images
5. Set up Firebase Functions for advanced backend logic

## Support

For more information, visit:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)