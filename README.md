# Entertainment-Kit

A modern, AI-powered web application for discovering and managing movies and TV shows. This Next.js starter kit provides a beautiful interface to browse content, manage a personal watchlist, and get personalized recommendations from a generative AI.

**Live Demo URL:** [https://entertainment-kit.vercel.app/](https://entertainment-kit.vercel.app/)

## Key Features

*   **Modern UI/UX:** Sleek dark theme with glassmorphism effects, built with Next.js, React, and ShadCN UI components.
*   **Firebase Integration:** Secure user authentication (Email/Password) and a Firestore database for storing user data like watchlists.
*   **AI-Powered Recommendations:** A Genkit-powered flow that suggests movies and TV shows based on a user's viewing history.
*   **Content Browsing & Search:** Rich interface for browsing, filtering, and searching a catalog of movies and TV shows.
*   **Responsive Design:** Fully responsive layout for a seamless experience on desktops, tablets, and mobile devices.
*   **Ready for Deployment:** Configured for easy and secure deployment on Vercel.

## Tech Stack

*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, ShadCN UI
*   **Backend & Database:** Firebase (Authentication, Firestore)
*   **Generative AI:** Google Genkit
*   **Deployment:** Vercel

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/shettyprasad-git/Entertainment-kit.git
    cd Entertainment-kit
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of your project and add the necessary Firebase credentials. You can get these from your Firebase project settings.

    ```env
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
    NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
    
    # Google AI (Genkit) API Key
    # This is often the same as your Firebase API key in Google Cloud projects.
    GEMINI_API_KEY=your-google-ai-api-key 
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

## Deployment

This project is optimized for deployment on Vercel.

1.  Push your code to a GitHub repository.
2.  Import the repository into Vercel.
3.  Add the environment variables from your `.env.local` file to the Vercel project's "Environment Variables" settings.
4.  Click **Deploy**. Vercel will automatically build and deploy your application.
