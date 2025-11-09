# 🚨 URGENT: Create .env.local File to Fix Error

## The Problem
You're getting this error:
```
FirebaseError: Firebase: Error (auth/invalid-api-key)
```

This is because the `.env.local` file is missing or has placeholder values.

## ✅ Quick Fix (3 Steps)

### STEP 1: Get Firebase Config

1. Go to: https://console.firebase.google.com/
2. Click your project (or create one)
3. Click ⚙️ gear icon → **Project settings**
4. Scroll to **"Your apps"** → Click web icon `</>`
5. If no app exists, register one: "EventLink Web"
6. **Copy these 6 values:**
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### STEP 2: Create .env.local File

**Method 1: Using Notepad (Easiest)**

1. Open **Notepad**
2. Copy this template and paste:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

3. **Fill in the values** from Firebase (Step 1)
4. Click **File** → **Save As**
5. Navigate to: `C:\Users\DEV\OneDrive\Desktop\MINI PROJECT`
6. Change "Save as type" to **"All Files (*.*)"**
7. File name: `.env.local` (start with a dot!)
8. Click **Save**

**Method 2: Using PowerShell**

1. Open PowerShell in project folder
2. Run this command:
```powershell
notepad .env.local
```
3. Paste the template and fill in values
4. Save and close

**Method 3: Using VS Code/Cursor**

1. Create new file in your editor
2. Name it: `.env.local`
3. Paste template and fill in values
4. Save

### STEP 3: Restart Server

**CRITICAL:** After creating `.env.local`:

1. Stop server: Press `Ctrl + C` in terminal
2. Start again: `npm run dev`
3. Open: http://localhost:3000
4. Error should be fixed! ✅

## 📋 Example .env.local File

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123Def456GhI789JkL012MnOp345Qr
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-project-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-project-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-project-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789
```

## ⚠️ Important Notes

- ✅ File must be named `.env.local` (with dot at start)
- ✅ Must be in project root folder
- ✅ NO spaces around `=` sign
- ✅ NO quotes around values
- ✅ Use REAL Firebase values (not "your_api_key_here")
- ✅ Restart server after creating file

## 🎯 Verify It Works

After creating `.env.local` and restarting:

1. Open: http://localhost:3000
2. You should see the EventLink landing page
3. No Firebase errors!
4. You can register/login

## 🆘 Still Having Issues?

1. Check file is named exactly `.env.local`
2. Check file is in project root
3. Check all 6 values are filled in
4. Check no placeholder text remains
5. Restart dev server
6. Clear browser cache (Ctrl + Shift + Delete)

