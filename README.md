
# Artificial Insemination Web App

A modern web application for artificial insemination education and training, built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- 🎓 Educational course content
- 📹 Video lessons and tutorials
- 📊 Progress tracking
- 🏆 Certificates and achievements
- 🔐 User authentication
- 📱 Responsive design
- 🌙 Dark mode support

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Firebase
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Storage**: Firebase Storage
- **Deployment**: Vercel/Netlify

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account (for backend services)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd artificial-insemination-web-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Firebase Setup

This project uses Firebase for authentication, database, and storage. Follow the detailed setup guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) to configure your Firebase project.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── courses/        # Course-related components
│   ├── dashboard/      # Dashboard components
│   ├── lessons/        # Lesson components
│   ├── quiz/           # Quiz components
│   └── ui/             # Base UI components
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
  "# Artificial-Insemination-" 
