# 🚨 FIX ERROR NOW - Step by Step

## Your Error
```
FirebaseError: Firebase: Error (auth/invalid-api-key)
```

## The Problem
The `.env.local` file is missing or has placeholder values.

## ✅ FIX IT IN 3 STEPS

### STEP 1: Get Firebase Configuration (5 minutes)

1. **Go to Firebase Console:**
   - Open: https://console.firebase.google.com/
   - Sign in with Google

2. **Create/Select Project:**
   - Click "Add project" or select existing project
   - Name it: `eventlink` (or any name)
   - Click through setup (disable Analytics if you want)

3. **Enable Authentication:**
   - Click "Authentication" → "Get started"
   - Go to "Sign-in method" tab
   - Enable "Email/Password"
   - Click "Save"

4. **Create Firestore Database:**
   - Click "Firestore Database" → "Create database"
   - Choose "Start in production mode"
   - Select location (e.g., `asia-south1`)
   - Click "Enable"

5. **Get Config Values:**
   - Click ⚙️ gear icon → "Project settings"
   - Scroll to "Your apps"
   - Click web icon `</>`
   - Register app: "EventLink Web"
   - **COPY THESE 6 VALUES:**
     - `apiKey`
     - `authDomain`
     - `projectId`
     - `storageBucket`
     - `messagingSenderId`
     - `appId`

### STEP 2: Create .env.local File (2 minutes)

**Using Notepad:**

1. Open **Notepad** (Windows + R, type `notepad`, press Enter)

2. Copy and paste this template:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

3. **Fill in the values** from Firebase (Step 1)

4. **Example:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123Def456GhI789JkL012MnOp345Qr
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=eventlink-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=eventlink-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=eventlink-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789
```

5. Click **File** → **Save As**

6. Navigate to: `C:\Users\DEV\OneDrive\Desktop\MINI PROJECT`

7. **Important:** Change "Save as type" to **"All Files (*.*)"**

8. File name: `.env.local` (with dot at the beginning!)

9. Click **Save**

10. **Verify:** You should see `.env.local` file in your project folder

### STEP 3: Restart Server (1 minute)

1. Go to your terminal (where `npm run dev` is running)

2. Press **Ctrl + C** to stop the server

3. Wait for it to stop

4. Run:
```powershell
npm run dev
```

5. Wait for "Ready" message

6. Open: **http://localhost:3000**

7. **✅ Error should be fixed!**

## ✅ Verify It Works

1. Open: http://localhost:3000
2. You should see EventLink landing page
3. No Firebase errors!
4. Click "Join as Volunteer" - should work!

## ⚠️ Important Notes

- ✅ File must be named `.env.local` (with dot!)
- ✅ Must be in project root folder
- ✅ NO spaces around `=` sign
- ✅ NO quotes around values
- ✅ Use REAL Firebase values
- ✅ MUST restart server after creating file

## 🆘 Still Not Working?

1. **Check file exists:**
   - Open File Explorer
   - Go to: `C:\Users\DEV\OneDrive\Desktop\MINI PROJECT`
   - Look for `.env.local` file
   - If hidden, enable "Show hidden files" in View tab

2. **Check file content:**
   - Open `.env.local` in Notepad
   - Verify all 6 values are filled in
   - No placeholder text like "your_api_key_here"

3. **Restart everything:**
   - Stop server (Ctrl + C)
   - Close browser
   - Start server again (`npm run dev`)
   - Clear browser cache (Ctrl + Shift + Delete)
   - Open http://localhost:3000

4. **Check browser console:**
   - Press F12
   - Look for errors
   - Check if env variables are loading

## 🎯 Quick Checklist

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore Database created
- [ ] Firebase config values copied
- [ ] `.env.local` file created
- [ ] All 6 values filled in
- [ ] File saved in project root
- [ ] Server restarted
- [ ] App loads without errors

## 📞 Need More Help?

See these guides:
- `UPDATE_ENV_FILE.md` - How to update the file
- `CREATE_ENV_FILE.md` - How to create the file
- `FIX_FIREBASE_ERROR.md` - Detailed error fix

---

**Follow these 3 steps and your error will be fixed!** 🚀

