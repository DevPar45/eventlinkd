# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root directory of the project with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## How to Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click on the gear icon (⚙️) next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you haven't added a web app, click the web icon (`</>`)
7. Register your app with a nickname
8. Copy the configuration values from the `firebaseConfig` object

## Example Configuration

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyExample123456789
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=eventlink-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=eventlink-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=eventlink-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

## Optional Environment Variables (Phase 2)

These are for future features and can be added later:

```env
# Stripe for payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Cloudinary for image uploads
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Important Notes

1. **Never commit `.env.local` to version control** - It's already in `.gitignore`
2. **Restart the development server** after changing environment variables
3. **All variables must start with `NEXT_PUBLIC_`** to be accessible in the browser
4. **Use different Firebase projects** for development and production

## Production Deployment

When deploying to Vercel or another hosting platform:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all the required variables
4. Redeploy your application

For Vercel:
- Go to Project Settings > Environment Variables
- Add each variable with the appropriate value
- Select the environments (Production, Preview, Development)
- Redeploy

## Troubleshooting

### Variables not working?
- Make sure the file is named `.env.local` (not `.env`)
- Restart your development server
- Check that variables start with `NEXT_PUBLIC_`
- Verify the file is in the root directory

### Firebase errors?
- Double-check all configuration values
- Ensure Firebase services are enabled (Auth, Firestore, Storage)
- Check Firebase console for any quota limits



