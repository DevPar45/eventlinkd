# 🔧 Update .env.local File - Fix Invalid API Key Error

## Your Error
```
FirebaseError: Firebase: Error (auth/invalid-api-key)
```

## What's Wrong
Your `.env.local` file exists but has **placeholder values** like:
- `your_api_key_here`
- `your_project_id`
- etc.

These need to be replaced with **REAL Firebase values**.

## ✅ Fix It Now (5 Minutes)

### Step 1: Open Firebase Console

1. Go to: **https://console.firebase.google.com/**
2. Sign in with your Google account
3. Select your project (or create a new one if you haven't)

### Step 2: Get Your Firebase Config

1. Click the **⚙️ gear icon** next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. If you see a web app, click on it
5. If you don't see a web app:
   - Click the **web icon** `</>` 
   - Register app with nickname: **"EventLink Web"**
   - Click **Register app**
6. You'll see a code block like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbc123Def456...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

7. **Copy each value** - You need all 6 values:
   - `apiKey` → NEXT_PUBLIC_FIREBASE_API_KEY
   - `authDomain` → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - `projectId` → NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - `storageBucket` → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - `messagingSenderId` → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - `appId` → NEXT_PUBLIC_FIREBASE_APP_ID

### Step 3: Update .env.local File

**Option A: Using Notepad**

1. Open PowerShell in your project folder
2. Run:
```powershell
notepad .env.local
```

3. Replace the placeholder values with your real Firebase values
4. Your file should look like this:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123Def456GhI789JkL012MnOp345Qr
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-project-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-project-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-project-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789
```

5. **Save the file** (Ctrl + S)
6. Close Notepad

**Option B: Using VS Code/Cursor**

1. Open `.env.local` in your editor
2. Replace placeholder values with real Firebase values
3. Save the file

### Step 4: Enable Firebase Services

Make sure these are enabled in Firebase Console:

**Authentication:**
1. Go to **Authentication** → **Get started**
2. Click **"Sign-in method"** tab
3. Click **"Email/Password"**
4. Toggle **"Enable"** to ON
5. Click **Save**

**Firestore Database:**
1. Go to **Firestore Database**
2. Click **"Create database"** (if not created)
3. Select **"Start in production mode"**
4. Choose location (e.g., `asia-south1` for India)
5. Click **Enable**

### Step 5: Restart Development Server

**CRITICAL:** After updating `.env.local`:

1. Go to your terminal where `npm run dev` is running
2. Press **Ctrl + C** to stop the server
3. Wait for it to stop completely
4. Run again:
```powershell
npm run dev
```
5. Wait for it to start (you'll see "Ready" message)
6. Open: **http://localhost:3000**
7. The error should be gone! ✅

## ✅ Verify It Works

After updating and restarting:

1. Open: http://localhost:3000
2. You should see the **EventLink landing page**
3. **No Firebase errors!**
4. Click **"Join as Volunteer"** or **"Join as Organiser"**
5. You should be able to register/login

## ⚠️ Common Mistakes

❌ **Wrong:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY = "AIzaSy..."  # Has spaces and quotes
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here  # Placeholder value
```

✅ **Correct:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123Def456  # No spaces, no quotes, real value
```

## 🎯 Quick Checklist

- [ ] Opened Firebase Console
- [ ] Got Firebase config values
- [ ] Updated `.env.local` with real values
- [ ] Enabled Authentication (Email/Password)
- [ ] Created Firestore Database
- [ ] Restarted dev server
- [ ] App loads without errors
- [ ] Can register/login

## 🆘 Still Not Working?

1. **Check file format:**
   - No spaces around `=`
   - No quotes around values
   - Real values (not placeholders)

2. **Check Firebase:**
   - Project is active
   - Services are enabled
   - Config values are correct

3. **Restart everything:**
   - Stop dev server (Ctrl + C)
   - Close browser
   - Start dev server again
   - Clear browser cache
   - Open http://localhost:3000

4. **Check browser console:**
   - Press F12
   - Look for error messages
   - Check if environment variables are loading

## 📝 Need More Help?

See these files:
- `FIX_FIREBASE_ERROR.md` - Detailed error fix guide
- `CREATE_ENV_FILE.md` - How to create the file
- `ENV_SETUP.md` - Environment variables guide

