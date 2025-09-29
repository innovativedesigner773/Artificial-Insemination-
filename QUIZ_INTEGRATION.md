# Quiz Integration with Course Creation

This document explains how the quiz system has been integrated into the course creation process, following the simplified Firestore data model you specified.

## 🧩 Firestore Data Structure

### Quiz Collection (`quizzes`)
```json
{
  "id": "quiz_123",
  "title": "HTML Basics Quiz",
  "description": "Test your HTML knowledge",
  "timeLimit": 300,  // in seconds
  "totalQuestions": 3,
  "createdAt": "2024-01-01T00:00:00Z",
  "courseId": "course_456" // optional reference
}
```

### Questions Collection (`questions`)
```json
{
  "id": "question_789",
  "text": "What does HTML stand for?",
  "options": [
    "Hyper Text Markup Language",
    "Home Tool Markup Language", 
    "Hyperlinks and Text Markup Language",
    "Hyper Tool Making Language"
  ],
  "correctAnswerIndex": 0,
  "explanation": "HTML stands for Hyper Text Markup Language.",
  "points": 10,
  "imageUrl": null,
  "difficulty": "easy",
  "tags": ["HTML", "basics"],
  "quizId": "quiz_123"
}
```

## 🚀 How It Works

### 1. Course Creation with Quizzes

When creating a course, you can now add quiz lessons:

1. **Add Module**: Create a module for your course content
2. **Add Lesson**: Select "Assessment Quiz" as the lesson type
3. **Quiz Creator Opens**: A modal opens with the quiz creation interface
4. **Create Quiz**: 
   - Set quiz title, description, and time limit
   - Add questions with multiple choice options
   - Set correct answers by selecting the radio button
   - Add explanations, points, difficulty levels, and tags
5. **Quiz Linked**: The quiz is automatically linked to the lesson via `quizId`

### 2. Quiz Creation Features

- **Multiple Choice Questions**: Add 2-6 options per question
- **Time Limits**: Set quiz duration in seconds (60-3600 seconds)
- **Scoring**: Assign points to each question
- **Difficulty Levels**: Easy, Medium, Hard
- **Explanations**: Add optional explanations for correct answers
- **Tags**: Categorize questions with tags
- **Real-time Preview**: See all questions before creating the quiz

### 3. Quiz Taking Experience

Students can take quizzes through the `QuizInterface` component:

- **Timer**: Real-time countdown display
- **Progress Tracking**: Visual progress bar and question navigation
- **Answer Selection**: Radio button interface for multiple choice
- **Question Navigation**: Jump between questions or go sequentially
- **Auto-submit**: Automatically submits when time runs out
- **Results Display**: Shows score, percentage, and pass/fail status

## 🔧 Technical Implementation

### Key Components

1. **QuizCreator**: Modal component for creating quizzes during course creation
2. **QuizInterface**: Component for students to take quizzes
3. **FirestoreService**: Database methods for quiz and question management
4. **CourseCreator**: Enhanced to support quiz lesson creation

### Database Methods

```typescript
// Create a new quiz
await firestoreService.createQuiz({
  title: "Quiz Title",
  description: "Quiz Description", 
  timeLimit: 300,
  courseId: "optional_course_id"
})

// Add questions to a quiz
await firestoreService.createQuestion(quizId, {
  text: "Question text",
  options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  correctAnswerIndex: 0,
  explanation: "Explanation text",
  points: 10,
  difficulty: "medium"
})

// Get quiz and questions
const quiz = await firestoreService.getQuiz(quizId)
const questions = await firestoreService.getQuestions(quizId)

// Submit quiz answers
const result = await firestoreService.submitQuiz(quizId, answers, timeSpent)
```

### Lesson Integration

Quiz lessons are stored in the course modules with a `quizId` reference:

```typescript
interface Lesson {
  id: string
  title: string
  type: 'quiz'
  duration: number
  content?: string
  quizId?: string // Links to the quiz document
}
```

## 🎯 Usage Example

### Creating a Quiz in Course Creation

1. Open course creation interface
2. Add a module (e.g., "HTML Fundamentals")
3. Click "Add Lesson" and select "Assessment Quiz"
4. Fill in lesson details (title, duration)
5. Quiz creator modal opens automatically
6. Create your quiz with questions
7. Quiz is automatically linked to the lesson

### Taking a Quiz

1. Student navigates to quiz lesson in course
2. QuizInterface component loads the quiz and questions
3. Student answers questions with timer running
4. Results are calculated and displayed
5. Progress is tracked in the course

## ✨ Features

- **Simplified Data Model**: Clean, flat structure for easy management
- **Real-time Creation**: Create quizzes directly during course creation
- **Flexible Questions**: Support for multiple choice with any number of options
- **Rich Metadata**: Points, difficulty, explanations, and tags
- **Timer Support**: Configurable time limits with automatic submission
- **Progress Tracking**: Visual progress indicators and question navigation
- **Results Analysis**: Detailed scoring with pass/fail determination

The quiz system is now fully integrated into your course creation workflow, making it easy to add assessments to any course content!
