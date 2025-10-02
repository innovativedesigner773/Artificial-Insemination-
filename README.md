# 🐄 Artificial Insemination Educational Platform

A comprehensive web application for artificial insemination education and training, built with modern web technologies. This platform provides structured courses, assessments, and certification for students, instructors, and administrators in the field of artificial insemination.

## 🌟 Features

### 🎓 **Educational Content**
- **Structured Courses**: Comprehensive curriculum covering AI basics to advanced techniques
- **Multi-format Lessons**: Video, interactive content, documents, and presentations
- **Multi-language Support**: Content available in 11 South African languages
- **Progress Tracking**: Detailed analytics and completion monitoring
- **Certificates**: Achievement and completion certificates

### 👥 **Role-Based System**
- **Students**: Access courses, track progress, earn certificates
- **Instructors**: Create courses, manage students, view analytics
- **Administrators**: Full system management, user management, analytics

### 🧩 **Assessment System**
- **Interactive Quizzes**: Timed assessments with multiple choice questions
- **Real-time Scoring**: Instant feedback and progress tracking
- **Difficulty Levels**: Easy, medium, and hard question categories
- **Detailed Analytics**: Performance metrics and pass rates

### 📱 **Modern UI/UX**
- **Responsive Design**: Works seamlessly on all devices
- **Dark Mode Support**: Theme switching capabilities
- **Accessibility**: WCAG compliant components
- **Progressive Web App**: Offline capabilities and app-like experience

## 🛠️ Tech Stack

### **Frontend**
- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript 5.5.3** - Type safety and enhanced developer experience
- **Vite 5.4.10** - Fast build tool and development server
- **Tailwind CSS 3.4.7** - Utility-first CSS framework
- **Radix UI** - Headless, accessible UI components

### **Backend & Database**
- **Firebase 12.3.0** - Backend-as-a-Service
- **Firebase Authentication** - User management and security
- **Firestore** - NoSQL database for real-time data
- **Firebase Storage** - File and media storage

### **Key Libraries**
- **React Hook Form 7.53.2** - Form handling and validation
- **React Player 3.3.3** - Video playback with YouTube/Vimeo support
- **Recharts 2.12.7** - Data visualization and analytics
- **Sonner 1.4.41** - Toast notifications
- **Lucide React** - Beautiful icon library

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** 
- **npm** or **yarn**
- **Firebase account** (for backend services)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd artificial-insemination-web-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp env.example .env.local
```

4. **Configure Firebase:**
   - Follow the detailed setup guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Update `src/utils/firebase/config.ts` with your Firebase configuration

5. **Start the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── courses/        # Course-related components
│   ├── dashboard/       # Role-based dashboards
│   ├── lessons/        # Video and content players
│   ├── quiz/           # Assessment components
│   └── ui/             # Base UI components (Radix UI)
├── hooks/              # Custom React hooks
├── services/           # API services and Firebase integration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
└── styles/             # Global styles and themes
```

## 🎯 Core Functionality

### **Course Management**
- Create and edit courses with modules and lessons
- Support for multiple content types (video, text, documents, quizzes)
- Multi-language video support
- Course publishing and access control

### **User Management**
- Role-based access control (Student, Instructor, Admin)
- User registration and authentication
- Profile management and settings
- Batch user creation for administrators

### **Assessment System**
- Create quizzes with multiple choice questions
- Time-limited assessments
- Real-time scoring and feedback
- Progress tracking and analytics

### **Analytics & Reporting**
- Student progress tracking
- Course completion rates
- User engagement metrics
- Detailed performance analytics

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🌐 Deployment

### **Production Build**
```bash
npm run build
```

### **Deployment Options**
- **Vercel**: Optimized for Vercel deployment
- **Netlify**: Compatible with Netlify
- **Firebase Hosting**: Direct Firebase integration
- **Any Static Host**: Standard static site deployment

## 📊 Sample Course Content

### **Artificial Insemination Basics (8 hours)**
1. **Reproductive Anatomy**
   - Female Reproductive System
   - Male Reproductive System
   - Quick Check: Anatomy

2. **AI Procedures**
   - Preparation and Hygiene
   - Insemination Technique
   - Quick Check: Procedures

3. **AI Fundamentals**
   - Types of Artificial Insemination
   - Timing and Success Factors

4. **Applications, Ethics, and Future**
   - Applications in Agriculture
   - Applications in Human Medicine
   - Advantages and Limitations
   - Ethics, Future, and Study Aids

### **Advanced AI & Farm Management (10 hours)**
1. **Troubleshooting**
   - Detecting Estrus
   - Quick Check: Troubleshooting

## 🔐 Security & Authentication

- **Firebase Authentication** with email/password
- **Role-based access control**
- **Secure Firestore rules**
- **Protected routes and components**
- **User session management**

## 🎨 Customization

### **Theming**
- Custom color palette with green theme
- Dark/light mode support
- Responsive design system
- Accessible component library

### **Content Management**
- Multi-language support
- Video integration (YouTube/Vimeo)
- Document attachments
- Interactive content blocks

## 📈 Performance Features

- **Code Splitting**: Optimized bundle sizes
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Responsive images with fallbacks
- **Caching**: Efficient data caching strategies
- **PWA**: Progressive Web App capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for setup issues
- Review the [QUIZ_INTEGRATION.md](./QUIZ_INTEGRATION.md) for quiz system details
- Open an issue for bug reports or feature requests

## 🔗 Related Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md)
- [Quiz Integration Guide](./QUIZ_INTEGRATION.md)
- [Component Guidelines](./src/guidelines/Guidelines.md)

---

**Built with ❤️ for the agricultural education community**