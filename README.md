# AI Resume Analyzer

A premium, full-stack application that analyzes resumes using AI to provide section-by-section scoring, ATS optimization feedback, and AI-generated improved resumes.

## Features

- **Multi-Format Analysis**: Upload PDF resumes or paste text directly.
- **Deep Analysis**: AI-powered scoring for Work Experience, Education, Skills, and more.
- **ATS Optimization**: Identifies missing keywords and provides actionable feedback.
- **Improved Resume Generation**: Generates a professional, structured version of your resume based on analysis feedback.
- **Premium UI**: Dark-themed dashboard with glassmorphism and smooth animations.
- **Print-Ready**: Generated resumes are formatted for both screen and print.

## Tech Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** for fast development and bundling
- **Tailwind CSS v4** for modern, utility-first styling
- **Framer Motion** for premium animations
- **Lucide React** for icons
- **React Hook Form** + **Zod** for form validation

### Backend
- **Node.js** with **Express 5**
- **TypeScript** with `tsx` for high-performance execution
- **MongoDB** with **Mongoose** for data persistence
- **OpenRouter (Gemini 2.0 Flash)** for AI analysis and generation
- **JWT** for secure authentication

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB running locally or a MongoDB Atlas URI

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Root
   npm install

   # Frontend
   cd frontend && npm install

   # Backend
   cd backend && npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ai-resume
   JWT_SECRET=your_jwt_secret
   OPENROUTER_API_KEY=your_api_key
   ```

4. Run the application:
   ```bash
   # Both Frontend and Backend (using concurrently if configured, or in separate terminals)
   # Terminal 1 (Backend)
   cd backend && npm run dev

   # Terminal 2 (Frontend)
   cd frontend && npm run dev
   ```


