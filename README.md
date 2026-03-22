# Mathematical Formula Retrieval System

A full-stack web application for storing, managing, and intelligently retrieving mathematical formulas.

## Features
- **Intelligent Search**: Rank formulas by relevance (Name > Description > LaTeX).
- **LaTeX Rendering**: High-quality rendering using KaTeX.
- **User Authentication**: JWT-based login/signup.
- **Role-Based Access**: Admin dashboard for formula management.
- **Personalization**: Bookmark favorite formulas and view search history.
- **Responsive Design**: Mobile-first UI with Dark/Light mode.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide Icons, KaTeX.
- **Backend**: Node.js, Express, TypeScript, JWT, Bcrypt.
- **Database**: JSON-based persistent store (mimicking a NoSQL/SQL structure).

## Setup Instructions

### 1. Prerequisites
- Node.js installed.

### 2. Installation
```bash
npm install
```

### 3. Running the Application
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### 4. Default Credentials
- **Admin**: `admin@example.com` / `admin123`
- **User**: `user@example.com` / `user123`

## Architecture
- **MVC Pattern**: Separated controllers (API routes), models (Types), and views (React components).
- **RESTful API**: Clean endpoints for Auth, Formulas, and Bookmarks.
- **State Management**: React Context API for Auth state.
