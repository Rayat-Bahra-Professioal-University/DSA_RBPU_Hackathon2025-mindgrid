# 🚀 Pothole Watch - Setup Instructions

## Firebase Configuration

To make your Pothole Watch app fully functional, you need to configure Firebase:

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `pothole-watch` (or your preferred name)
4. Follow the setup wizard

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable **Email/Password** authentication method

### Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create Database"
3. Choose "Start in production mode" (we'll add security rules later)
4. Select your preferred location

### Step 4: Enable Storage

1. Go to **Storage**
2. Click "Get Started"
3. Use default security rules for now

### Step 5: Get Your Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register your app with a nickname (e.g., "Pothole Watch Web")
5. Copy the `firebaseConfig` object

### Step 6: Update Your Code

Open `src/lib/firebase.ts` and replace the placeholder config with your actual Firebase config:

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

### Step 7: Configure Firestore Security Rules

In Firestore, go to **Rules** tab and use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reports collection
    match /reports/{reportId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

### Step 8: Configure Storage Security Rules

In Storage, go to **Rules** tab:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /reports/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Admin Access

The default admin secret code is: `ADMIN2025`

To change it, edit `src/contexts/AuthContext.tsx` and update:
```typescript
const ADMIN_SECRET_CODE = 'YOUR_NEW_SECRET_CODE';
```

## Testing the Application

1. **Sign Up**: Create a regular account (without admin code)
2. **Sign Up as Admin**: Create another account with admin code `ADMIN2025`
3. **Report a Pothole**: Login as regular user and submit a report
4. **Manage Reports**: Login as admin and update report status

## Multilingual Support

The app supports English and Hindi by default. Users can toggle languages using the globe icon in the navbar.

To add more languages, edit `src/lib/i18n.ts` and add new translation objects.

## Next Steps

- Integrate real map API (Google Maps or Leaflet)
- Add email notifications for status updates
- Implement analytics dashboard
- Add export functionality for admin reports
- Configure custom domain and deploy

## Need Help?

If you encounter any issues:
1. Check browser console for errors
2. Verify Firebase configuration
3. Ensure all security rules are properly set
4. Check that authentication and Firestore are enabled

---

Built with ❤️ for safer roads
