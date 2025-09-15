# Dil Se Likho - Personal Shayari Diary

A beautiful, full-stack web application for writing, storing, and cherishing your Shayari (poetry) with AI-powered insights and elegant design.

## Features

### Core Features
- **Google Authentication** - Secure login with NextAuth.js
- **Shayari Editor** - Beautiful diary-style editor with auto-save
- **Library Dashboard** - Grid view with filters and search
- **Top Shayaris Marquee** - Dynamic scrolling display from Google Sheets
- **AI Integration** - Gemini AI for compliments, mood analysis, and suggestions
- **Favorites & Secret Mode** - Pin favorites and password-protect entries
- **Export Options** - Save as PDF or share as images
- **Calendar View** - Visualize your writing journey
- **Dark/Light Mode** - Beautiful themes for any preference

### UI/UX Features
- **Responsive Design** - Works perfectly on desktop and mobile
- **GSAP Animations** - Smooth, engaging animations throughout
- **Glassmorphism Design** - Modern, elegant visual style
- **Ink-drop Effects** - Special typing animations
- **Heart Confetti** - Easter egg when typing ❤️
- **Mood-based Backgrounds** - Dynamic themes based on content
- **Auto-scrolling Marquee** - Horizontal scrolling with pause-on-hover

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, GSAP
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js with Google OAuth
- **AI**: Gemini API integration
- **External APIs**: Google Sheets API for dynamic content
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Environment Variables
Create a `.env.local` file with the following variables:

\`\`\`env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Google Sheets API (for Top Shayaris)
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----"
GOOGLE_SHEETS_SPREADSHEET_ID=your_google_sheets_spreadsheet_id
GOOGLE_SHEETS_RANGE=Sheet1!A:A

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
\`\`\`

### 3. Get Required API Keys

#### MongoDB Atlas
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and add to `MONGODB_URI`

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret

#### Google Sheets API (for Top Shayaris)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Sheets API
3. Create a Service Account
4. Download the JSON key file
5. Extract `client_email` and `private_key` for environment variables
6. Create a Google Sheet with Shayaris in column A
7. Share the sheet with the service account email (Editor access)
8. Copy the spreadsheet ID from the URL

#### Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to `GEMINI_API_KEY`

### 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The app is optimized for Vercel deployment with automatic builds and serverless functions.

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── top-shayaris/  # Google Sheets integration
│   │   └── shayari/       # Shayari CRUD operations
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── editor/            # Shayari editor
│   ├── calendar/          # Calendar view
│   ├── settings/          # User settings
│   └── shayari/           # Individual Shayari pages
├── components/            # React components
│   ├── top-shayaris.tsx  # Marquee component
│   └── ui/               # UI components
├── lib/                   # Utilities and configurations
│   ├── models/           # MongoDB models
│   ├── auth.ts           # NextAuth configuration
│   ├── mongodb.ts        # Database connection
│   └── gemini.ts         # AI integration
└── public/               # Static assets
\`\`\`

## Features in Detail

### Top Shayaris Marquee
- Dynamic content from Google Sheets
- Smooth GSAP-powered horizontal scrolling
- Pause animation on hover
- Responsive design for mobile and desktop
- Fallback content when no data available
- Infinite loop for seamless experience

### Shayari Editor
- Diary-style lined paper design
- Real-time auto-save functionality
- Mood selection with visual indicators
- Favorite and secret entry toggles
- AI-powered insights after saving

### Dashboard
- Beautiful glassmorphism card design
- Advanced filtering (date, mood, favorites)
- Search functionality
- Statistics overview
- Responsive grid layout

### AI Integration
- Compliments on your writing
- Mood analysis and tagging
- Creative suggestions for improvement
- Contextual feedback in Hindi/Urdu style

### Export & Sharing
- PDF generation with beautiful typography
- Image sharing with elegant designs
- Multiple theme options
- Social media ready formats

## Google Sheets Setup for Top Shayaris

1. Create a new Google Sheet
2. Add your favorite Shayaris in column A (one per row)
3. Example structure:
   \`\`\`
   Shayari
   तू मिले या ना मिले ये मेरी किस्मत है…
   तेरे बिना ये दिल अधूरा सा लगता है…
   तुझे देखे बिना चैन कहाँ आता है…
   \`\`\`
4. Share with your service account email
5. Copy the spreadsheet ID from URL
6. Update environment variables

## Contributing

This is a personal diary application. Feel free to fork and customize for your own use!

## License

MIT License - feel free to use this project as inspiration for your own applications.
