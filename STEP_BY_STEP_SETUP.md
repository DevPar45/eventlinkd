# EventLink - Step-by-Step Setup Guide

## 📍 File Location

All EventLink files are stored in:
```
C:\Users\DEV\OneDrive\Desktop\MINI PROJECT\
```

This is the **root directory** of your EventLink project. All files are directly in this folder (not in a subfolder).

---

## 🚀 Step-by-Step Instructions

### **STEP 1: Open Terminal/Command Prompt**

1. Open PowerShell or Command Prompt
2. Navigate to the project directory:

   **Option A - PowerShell (Recommended):**
   ```powershell
   cd "C:\Users\DEV\OneDrive\Desktop\MINI PROJECT"
   ```
   
   **Option B - If Option A doesn't work, try:**
   ```powershell
   cd C:\Users\DEV\OneDrive\Desktop
   cd "MINI PROJECT"
   ```
   
   **Option C - For Command Prompt (CMD):**
   ```cmd
   cd /d "C:\Users\DEV\OneDrive\Desktop\MINI PROJECT"
   ```
   
   **Option D - Navigate step by step:**
   ```powershell
   cd C:\Users\DEV\OneDrive\Desktop
   cd "MINI PROJECT"
   ```
   
   **Verify you're in the right folder:**
   ```powershell
   dir
   ```
   You should see files like `package.json`, `app`, `components`, etc.

### **STEP 2: Install Dependencies**

Run this command to install all required packages (including Tailwind CSS):

```powershell
npm install
```

**Wait for it to complete** - This may take 2-5 minutes. You should see:
- ✅ Packages being downloaded
- ✅ Dependencies installed
- ✅ No errors

### **STEP 3: Set Up Firebase**

#### 3.1 Create Firebase Project

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `eventlink` (or any name)
4. Click **Continue**
5. Disable Google Analytics (optional) and click **Create project**
6. Wait for project creation, then click **Continue**

#### 3.2 Enable Authentication

1. In Firebase Console, click **Authentication** in the left menu
2. Click **Get started**
3. Click on **Sign-in method** tab
4. Click on **Email/Password**
5. Toggle **Enable** to ON
6. Click **Save**

#### 3.3 Create Firestore Database

1. Click **Firestore Database** in the left menu
2. Click **Create database**
3. Select **Start in production mode** (we'll add rules later)
4. Choose a location (e.g., `asia-south1` for India)
5. Click **Enable**

#### 3.4 Get Firebase Configuration

1. Click the **gear icon** ⚙️ next to "Project Overview"
2. Click **Project settings**
3. Scroll down to **"Your apps"** section
4. Click the **web icon** `</>`
5. Register app with nickname: `EventLink Web`
6. Click **Register app**
7. **Copy the config values** - You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### **STEP 4: Create Environment Variables File**

1. In the project folder (`C:\Users\DEV\OneDrive\Desktop\MINI PROJECT\`), create a new file named: `.env.local`

2. Open `.env.local` in a text editor (Notepad, VS Code, etc.)

3. Paste this template and fill in your Firebase values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=paste_your_apiKey_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=paste_your_authDomain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=paste_your_projectId_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=paste_your_storageBucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=paste_your_messagingSenderId_here
NEXT_PUBLIC_FIREBASE_APP_ID=paste_your_appId_here
```

**Example:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123Def456
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=eventlink-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=eventlink-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=eventlink-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

4. **Save the file** (make sure it's named exactly `.env.local`)

### **STEP 5: Set Up Firestore Security Rules**

1. In Firebase Console, go to **Firestore Database**
2. Click on **Rules** tab
3. Open the file `firestore.rules` from your project folder
4. **Copy all the content** from `firestore.rules`
5. **Paste it** into the Firebase Rules editor (replace existing rules)
6. Click **Publish**

### **STEP 6: Run the Development Server**

In your terminal (still in the project directory), run:

```powershell
npm run dev
```

You should see:
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
- Ready in X seconds
```

### **STEP 7: Open the Application**

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the EventLink landing page! 🎉

---

## ✅ Testing the Application

### Test as Organiser:

1. Click **"Join as Organiser"** or go to `/register?role=organiser`
2. Fill in the registration form:
   - Name: `Test Organiser`
   - Email: `organiser@test.com`
   - Password: `password123`
   - Select **Organiser** role
3. Click **Create Account**
4. You'll be redirected to the dashboard
5. Click **"Create Event"** button
6. Fill in event details and create an event

### Test as Volunteer:

1. Open a new browser window (or incognito mode)
2. Go to `/register?role=volunteer`
3. Fill in the registration form:
   - Name: `Test Volunteer`
   - Email: `volunteer@test.com`
   - Password: `password123`
   - Select **Volunteer** role
4. Click **Create Account**
5. Go to **Events** page (`/events`)
6. Click on an event
7. Click **"Apply to this event"**

### Test Messaging:

1. As organiser, go to your event
2. View applications
3. Click the **Message** button next to an applicant
4. Send a message
5. As volunteer, go to **Messages** page
6. You should see the chat!

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'tailwindcss'"
**Solution:** Run `npm install` again

### Error: "Firebase config not found"
**Solution:** 
- Check that `.env.local` file exists
- Verify all environment variables are set
- Restart the dev server: Press `Ctrl+C` then run `npm run dev` again

### Error: "Permission denied" in Firestore
**Solution:**
- Check that Firestore rules are published
- Verify rules match the content in `firestore.rules`

### Port 3000 already in use
**Solution:**
- Close other applications using port 3000
- Or run: `npm run dev -- -p 3001` (uses port 3001)

### TypeScript errors
**Solution:**
- Run `npm install` to ensure all types are installed
- Check that `tsconfig.json` exists

---

## 📁 Project Structure

```
C:\Users\DEV\OneDrive\Desktop\MINI PROJECT\
│
├── app/                    # Next.js pages
│   ├── dashboard/        # User dashboard
│   ├── event/            # Event details
│   ├── events/           # Events listing & creation
│   ├── login/            # Login page
│   ├── messages/         # Messaging
│   ├── profile/          # User profile
│   ├── register/         # Registration
│   └── page.tsx          # Landing page
│
├── components/           # React components
│   └── Navbar.tsx
│
├── lib/                  # Utilities
│   ├── context/         # Auth context
│   ├── firebase/        # Firebase functions
│   └── types/           # TypeScript types
│
├── .env.local           # Environment variables (CREATE THIS)
├── package.json        # Dependencies
├── tailwind.config.ts  # Tailwind config
└── firestore.rules     # Security rules
```

---

## 🎯 Quick Commands Reference

```powershell
# Navigate to project
cd "C:\Users\DEV\OneDrive\Desktop\MINI PROJECT"

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 📚 Additional Resources

- **Quick Start:** See `QUICKSTART.md`
- **Detailed Setup:** See `SETUP.md`
- **Environment Variables:** See `ENV_SETUP.md`
- **Project Overview:** See `PROJECT_SUMMARY.md`

---

## ✨ You're All Set!

Your EventLink application is now running. Start building and testing! 🚀
