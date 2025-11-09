# PowerShell script to create .env.local file
# Run this script: .\create-env-file.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "EventLink - Create .env.local File" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local already exists
if (Test-Path ".env.local") {
    Write-Host "⚠️  .env.local file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Cancelled." -ForegroundColor Red
        exit
    }
}

Write-Host "Creating .env.local file template..." -ForegroundColor Green
Write-Host ""

# Create .env.local file with template
@"
# Firebase Configuration
# Replace the values below with your actual Firebase project configuration
# Get these from: https://console.firebase.google.com/ → Project Settings → Your apps

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Instructions:
# 1. Go to Firebase Console: https://console.firebase.google.com/
# 2. Select your project (or create a new one)
# 3. Click the gear icon ⚙️ → Project settings
# 4. Scroll to 'Your apps' section
# 5. Click the web icon </>
# 6. Register your app (if not already done)
# 7. Copy the values from firebaseConfig object
# 8. Replace the placeholder values above with your actual Firebase config
# 9. Save this file
# 10. Restart your dev server (npm run dev)
"@ | Out-File -FilePath ".env.local" -Encoding utf8

Write-Host "✅ .env.local file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Open .env.local in a text editor (Notepad, VS Code, etc.)" -ForegroundColor White
Write-Host "2. Get your Firebase config from: https://console.firebase.google.com/" -ForegroundColor White
Write-Host "3. Replace the placeholder values with your actual Firebase config" -ForegroundColor White
Write-Host "4. Save the file" -ForegroundColor White
Write-Host "5. Restart your dev server: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Opening .env.local in Notepad..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Start-Process notepad ".env.local"

