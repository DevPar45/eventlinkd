# EventLink - Quick Start Guide

Get EventLink up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Firebase account (free)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** (Email/Password)
4. Create **Firestore Database**
5. Copy your Firebase config from Project Settings

## Step 3: Configure Environment Variables

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 4: Set Firestore Rules

1. Go to Firestore Database > Rules
2. Copy rules from `firestore.rules`
3. Paste and click "Publish"

## Step 5: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 6: Test the App

1. **Register as Organiser:**
   - Go to `/register?role=organiser`
   - Create an account
   - Create an event at `/events/create`

2. **Register as Volunteer:**
   - Go to `/register?role=volunteer`
   - Create an account
   - Browse events at `/events`
   - Apply to an event

3. **Test Messaging:**
   - As organiser, view applications
   - Click "Message" to chat with volunteer
   - Test real-time messaging

## That's It! 🎉

Your EventLink app is now running. Check the other documentation files for more details:

- `README.md` - Full documentation
- `SETUP.md` - Detailed setup instructions
- `ENV_SETUP.md` - Environment variables guide
- `PROJECT_SUMMARY.md` - Project overview

## Troubleshooting

**Firebase errors?**
- Check environment variables are set correctly
- Restart dev server after changing `.env.local`
- Verify Firebase services are enabled

**Build errors?**
- Delete `node_modules` and `.next`
- Run `npm install` again

**Permission errors?**
- Check Firestore rules are published
- Verify user is authenticated

Need help? Check the documentation files or Firebase console for errors.



