# EventLink Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account (free tier works)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable the following services:

#### Authentication
- Go to Authentication > Sign-in method
- Enable "Email/Password" provider

#### Firestore Database
- Go to Firestore Database
- Create database in "Production mode" (we'll add security rules later)
- Choose a location closest to your users

#### Storage (Optional for Phase 2)
- Go to Storage
- Get started with default rules

### 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click on the web icon (`</>`)
4. Register your app with a nickname (e.g., "EventLink Web")
5. Copy the Firebase configuration object

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase configuration.

### 5. Firestore Security Rules

Go to Firestore Database > Rules and paste the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is the document owner
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update, delete: if isOwner(userId);
    }
    
    // Events collection
    match /events/{eventId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && 
        resource.data.organiserId == request.auth.uid;
    }
    
    // Applications collection
    match /applications/{applicationId} {
      allow read: if isAuthenticated() && 
        (resource.data.volunteerId == request.auth.uid ||
         get(/databases/$(database)/documents/events/$(resource.data.eventId)).data.organiserId == request.auth.uid);
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
        (resource.data.volunteerId == request.auth.uid ||
         get(/databases/$(database)/documents/events/$(resource.data.eventId)).data.organiserId == request.auth.uid);
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read, write: if isAuthenticated() && 
        (resource.data.senderId == request.auth.uid ||
         resource.data.receiverId == request.auth.uid);
    }
    
    // Chats collection
    match /chats/{chatId} {
      allow read, write: if isAuthenticated() && 
        request.auth.uid in resource.data.participants;
    }
  }
}
```

Click "Publish" to save the rules.

### 6. Firestore Indexes

Firestore may require composite indexes for some queries. If you see an error about missing indexes:

1. Click on the error link in the Firebase console
2. It will take you to the Indexes page
3. Click "Create Index" and wait for it to build

Common indexes needed:
- `chats` collection: `participants` (array) + `lastMessageTime` (descending)
- `messages` collection: `chatId` + `timestamp` (ascending)

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 8. Test the Application

1. **Register as a Volunteer:**
   - Go to `/register?role=volunteer`
   - Create an account
   - Browse events at `/events`

2. **Register as an Organiser:**
   - Go to `/register?role=organiser`
   - Create an account
   - Create an event at `/events/create`

3. **Test the Flow:**
   - As a volunteer, apply to an event
   - As an organiser, view applications and accept/reject them
   - Test messaging between users

## Troubleshooting

### Firebase Configuration Errors

- Make sure all environment variables are set in `.env.local`
- Restart the development server after changing environment variables
- Check that your Firebase project has the correct services enabled

### Firestore Permission Errors

- Verify that security rules are published
- Check that the user is authenticated
- Ensure the user has the correct role/permissions

### Build Errors

- Delete `node_modules` and `.next` folder
- Run `npm install` again
- Run `npm run build` to check for TypeScript errors

### Real-time Updates Not Working

- Check that Firestore rules allow read access
- Verify that the user is authenticated
- Check browser console for errors

## Next Steps

1. **Customize the UI:**
   - Update colors in `tailwind.config.ts`
   - Modify components in `components/` directory
   - Add your logo and branding

2. **Add Features:**
   - Image upload for events (Firebase Storage)
   - Email notifications
   - Certificate generation
   - QR code check-in

3. **Deploy:**
   - Deploy to Vercel: `vercel deploy`
   - Or deploy to Firebase Hosting: `firebase deploy`

## Support

For issues or questions:
- Check the [README.md](./README.md) for more information
- Open an issue on GitHub
- Check Firebase documentation for backend issues



