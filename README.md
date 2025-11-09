# EventLink - Connecting Volunteers with India's Biggest Events

EventLink is a digital platform connecting verified volunteers, event helpers, and safety staff directly with event organisers, brands, and venues.

## 🚀 Features

### Phase 1 (MVP)
- ✅ Volunteer and Organiser registration/login
- ✅ Event listing and browsing
- ✅ Event application system
- ✅ Dashboard for volunteers (view applied events)
- ✅ Dashboard for organisers (manage events, view applicants)
- ✅ Real-time messaging/chat system
- ✅ Profile management
- ✅ Responsive design (mobile-first)

### Phase 2 (Future)
- Verified profiles (badge system)
- Ratings & reviews
- Certificate generator (PDF)
- QR check-in/check-out for event attendance
- Training portal for volunteers
- Paid gig option & B2B event management
- Stripe payment integration

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Firebase (Auth + Firestore + Storage)
- **Animations:** Framer Motion
- **Deployment:** Vercel (frontend) + Firebase backend

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eventlink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Storage
   - Copy your Firebase config values

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Set up Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own data
       match /users/{userId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Events can be read by anyone, written by organisers
       match /events/{eventId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null;
         allow update, delete: if request.auth != null && 
           resource.data.organiserId == request.auth.uid;
       }
       
       // Applications can be read by event organisers and applicants
       match /applications/{applicationId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null;
         allow update: if request.auth != null && 
           (resource.data.volunteerId == request.auth.uid ||
            get(/databases/$(database)/documents/events/$(resource.data.eventId)).data.organiserId == request.auth.uid);
       }
       
       // Messages can be read/written by participants
       match /messages/{messageId} {
         allow read, write: if request.auth != null && 
           (resource.data.senderId == request.auth.uid ||
            resource.data.receiverId == request.auth.uid);
       }
       
       // Chats can be read by participants
       match /chats/{chatId} {
         allow read, write: if request.auth != null && 
           request.auth.uid in resource.data.participants;
       }
     }
   }
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
eventlink/
├── app/
│   ├── dashboard/          # User dashboard (role-based)
│   ├── event/
│   │   └── [id]/          # Event details page
│   ├── events/
│   │   ├── create/        # Create event (organisers)
│   │   └── page.tsx       # Events listing
│   ├── login/             # Login page
│   ├── messages/          # Messaging system
│   ├── profile/           # User profile
│   ├── register/          # Registration page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/
│   └── Navbar.tsx         # Navigation component
├── lib/
│   ├── context/
│   │   └── AuthContext.tsx # Authentication context
│   ├── firebase/
│   │   ├── config.ts      # Firebase configuration
│   │   ├── events.ts      # Event operations
│   │   └── messages.ts    # Messaging operations
│   └── types/
│       └── index.ts       # TypeScript types
├── public/                # Static assets
├── .env.example           # Environment variables template
└── package.json           # Dependencies
```

## 🔐 Authentication

EventLink uses Firebase Authentication with email/password. Users can register as either:
- **Volunteer**: Can browse and apply to events
- **Organiser**: Can create and manage events

## 📊 Database Schema

### Users Collection
```typescript
{
  id: string;
  email: string;
  name: string;
  role: "volunteer" | "organiser";
  phone?: string;
  bio?: string;
  avatar?: string;
  verified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Events Collection
```typescript
{
  id: string;
  organiserId: string;
  organiserName: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: Date;
  endDate?: Date;
  requiredVolunteers: number;
  appliedVolunteers: string[];
  selectedVolunteers: string[];
  status: "open" | "closed" | "completed";
  image?: string;
  requirements?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Applications Collection
```typescript
{
  id: string;
  eventId: string;
  volunteerId: string;
  volunteerName: string;
  volunteerEmail: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: Date;
  message?: string;
}
```

### Messages Collection
```typescript
{
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Firebase Hosting (Alternative)

```bash
npm run build
firebase init hosting
firebase deploy
```

## 🔮 Future Enhancements

1. **Verified Profiles**: Add verification badges for trusted users
2. **Ratings & Reviews**: Allow volunteers and organisers to rate each other
3. **Certificate Generator**: Generate PDF certificates for completed events
4. **QR Check-in/Check-out**: Track volunteer attendance
5. **Training Portal**: Educational resources for volunteers
6. **Payment Integration**: Stripe integration for paid events
7. **Analytics Dashboard**: Event and user analytics
8. **Mobile App**: React Native app for iOS and Android

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ for connecting India's event community



