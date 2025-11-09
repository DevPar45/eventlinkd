# 🔧 Fix: Firebase Invalid API Key Error

## Error Message
```
FirebaseError: Firebase: Error (auth/invalid-api-key)
```

## What This Means
Your `.env.local` file either:
1. Doesn't exist
2. Has placeholder values (like "your_api_key_here")
3. Has incorrect Firebase configuration

## ✅ Solution - Step by Step

### Step 1: Check if `.env.local` exists

1. Open your project folder: `C:\Users\DEV\OneDrive\Desktop\MINI PROJECT`
2. Look for a file named `.env.local`
3. If you don't see it, you need to create it (see Step 2)

**Note:** `.env.local` might be hidden. To see it:
- In File Explorer, click "View" tab
- Check "Hidden items" checkbox
- Or press `Ctrl + Shift + .` (period)

### Step 2: Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one if you haven't)
3. Click the **gear icon** ⚙️ next to "Project Overview"
4. Click **"Project settings"**
5. Scroll down to **"Your apps"** section
6. If you see a web app, click on it. If not:
   - Click the **web icon** `</>`
   - Register app with nickname: "EventLink Web"
   - Click **Register app**
7. You'll see a `firebaseConfig` object like this:

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

8. **Copy each value** - You'll need all 6 values

### Step 3: Create/Update `.env.local` File

**Option A: Using Notepad (Easiest)**

1. Open Notepad
2. Copy and paste this template:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

3. Fill in the values from Firebase Console (from Step 2)
4. Example:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123Def456GhI789JkL012MnOp345Qr
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=eventlink-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=eventlink-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=eventlink-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789
```

5. Click **File** → **Save As**
6. Navigate to: `C:\Users\DEV\OneDrive\Desktop\MINI PROJECT`
7. In "Save as type", select **"All Files (*.*)"**
8. File name: `.env.local` (with the dot at the beginning)
9. Click **Save**

**Option B: Using VS Code or Cursor**

1. In your editor, create a new file
2. Name it: `.env.local`
3. Paste the template and fill in values
4. Save the file

**Option C: Using Command Line**

1. Open PowerShell in your project folder
2. Run:
```powershell
notepad .env.local
```
3. Paste the template and fill in values
4. Save and close

### Step 4: Verify Your `.env.local` File

Make sure your file:
- ✅ Is named exactly `.env.local` (with dot at start)
- ✅ Is in the project root folder
- ✅ Has NO spaces around the `=` sign
- ✅ Has NO quotes around the values
- ✅ Has actual Firebase values (not "your_api_key_here")

**Correct format:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123Def456
```

**Wrong format:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY = "AIzaSyAbc123Def456"  ❌ (has spaces and quotes)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here       ❌ (placeholder value)
```

### Step 5: Restart Your Development Server

**IMPORTANT:** After creating/updating `.env.local`, you MUST restart the server:

1. In your terminal, press `Ctrl + C` to stop the server
2. Wait for it to stop completely
3. Run again:
```powershell
npm run dev
```
4. Wait for it to start
5. Open: http://localhost:3000
6. The error should be gone! ✅

### Step 6: Verify Firebase Services Are Enabled

Make sure in Firebase Console:

1. **Authentication is enabled:**
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
   - Click Save

2. **Firestore Database is created:**
   - Go to Firestore Database
   - Create database if not already created
   - Choose "Start in production mode"

## 🐛 Still Getting Errors?

### Error: "File not found"
- Make sure `.env.local` is in the project root folder
- Check the file name (should start with a dot)
- Restart your dev server

### Error: "Still invalid API key"
- Double-check you copied the correct values from Firebase
- Make sure there are no extra spaces or quotes
- Verify the API key starts with "AIzaSy"
- Restart your dev server

### Error: "Cannot read properties"
- Make sure all 6 environment variables are set
- Check for typos in variable names
- Restart your dev server

## ✅ Quick Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] Firebase config values copied
- [ ] `.env.local` file created in project root
- [ ] All 6 environment variables filled in
- [ ] No placeholder values left
- [ ] Dev server restarted
- [ ] App opens without errors

## 🎯 Need Help?

If you're still stuck:
1. Check Firebase Console for any errors
2. Verify your Firebase project is active
3. Make sure you copied the values correctly
4. Try creating a new Firebase project
5. Check the browser console for more error details

