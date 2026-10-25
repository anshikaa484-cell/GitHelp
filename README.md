GIThelp

A beginner-friendly interactive web application for learning Git commands, understanding common Git errors, and getting quick answers to frequently asked Git questions.

📌 About the Project

GIThelp is a student-focused web application designed to make learning Git and GitHub easier and more practical. It provides a simple, interactive interface where beginners can understand commonly used Git commands, learn what different Git errors mean, and find quick guidance for everyday Git workflows.

The project focuses on making Git concepts less intimidating by presenting technical information in a clear and accessible way.

✨ Key Features

📚 Beginner-friendly Git command guidance

🔍 Quick explanations of common Git concepts and errors

💡 Practical Git/GitHub help for common workflows

🧭 Easy-to-use navigation and interactive interface

📱 Responsive frontend design

🎨 Modern UI with reusable React components

⚡ Fast development and production builds using Vite

🛠️ Technologies Used

React 19

Vite 6

JavaScript

Tailwind CSS

React Router

Framer Motion

Lucide React

Axios

React Hook Form

Recharts

Redux Toolkit + React Redux (quiz, lesson progress, bookmarks)

Context API (theme, display name)

Vitest + Testing Library

📂 Project Structure

GIThelp/
└── frontend/
    ├── public/
    ├── src/
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── ...

🚀 Getting Started

Prerequisites

Make sure you have the following installed:

Node.js

npm

You can verify the installations with:

node --version
npm --version

Installation

Clone the repository:

git clone https://github.com/pranshi8578beaift25-hub/GIThelp.git

Open the project directory:

cd GIThelp/frontend

Install the dependencies:

npm install --legacy-peer-deps

Run the Development Server

npm run dev

Vite will start the application locally, normally at:

http://localhost:5173/

Create a Production Build

npm run build

Preview the Production Build

npm run preview

🎯 Project Objective

The main objective of GIThelp is to provide an approachable learning experience for students and beginner developers who are starting with Git and GitHub.

The application aims to help users:

Understand essential Git commands.

Recognize and troubleshoot common Git errors.

Learn practical Git workflows.

Improve confidence while working with repositories.

Access Git-related guidance through a simple interactive interface.

🔮 Future Enhancements

Possible future improvements include:

AI-powered Git error explanations

Interactive Git command simulations

Personalized learning paths

Git practice challenges and quizzes

Progress tracking

More advanced Git and GitHub tutorials

Deployment and repository troubleshooting guides

📄 License

This project is developed for educational and academic purposes.


✅ Evaluation-II Features

Routes: / , /dashboard , /commands , /playground , /troubleshooter , /quiz , /bookmarks , /profile , /feedback , plus Error Finder, Chatbot, Cheat Sheet and a 404 page.

Context API: light/dark theme and display name. Redux Toolkit: bookmarks, quiz, learning progress. Forms: validated feedback form. Run the tests with npm test.

Limitations: frontend only (no backend or accounts); data is stored in the browser; the Playground is a simulator and never runs real Git.

See VIVA_GUIDE.md for a file-by-file explanation.
