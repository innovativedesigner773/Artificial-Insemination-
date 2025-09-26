# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `artificial-insemination-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** authentication:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 3: Enable Firestore Database

1. Go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location for your database
5. Click "Done"

## Step 4: Get Web App Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Add app** and select the web icon (</>)
4. Register your app with a nickname (e.g., "Web App")
5. Copy the configuration object

## Step 5: Update Configuration

Replace the configuration in `src/utils/firebase/config.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-actual-app-id"
};
```

## Step 6: Set Up Firestore Security Rules

1. Go to **Firestore Database** > **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public courses
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // User progress
    match /progress/{progressId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Enrollments
    match /enrollments/{enrollmentId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Quiz results
    match /quizResults/{resultId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## Step 7: Test the Setup

1. Start your development server: `npm run dev`
2. Try to register a new user
3. Check the Firebase Console to see if the user appears in Authentication
4. Check Firestore to see if user documents are created

## Troubleshooting

### Common Issues:

1. **auth/configuration-not-found**: 
   - Verify your Firebase configuration is correct
   - Make sure Authentication is enabled in Firebase Console
   - Check that your domain is authorized

2. **Permission denied**:
   - Check Firestore security rules
   - Ensure user is authenticated before accessing protected data

3. **Network errors**:
   - Check if your API key has proper restrictions
   - Verify the project ID is correct
