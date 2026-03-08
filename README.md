# Entertainment Kit 🎬

![Entertainment Kit Banner](https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop)

A sleek, premium, and fully-responsive entertainment platform clone that allows users to discover, browse, and manage their favorite Movies and TV Shows. Featuring a gorgeous "Glassmorphism" UI, dynamic cinematic backgrounds, secure authentication, and a scalable backend architecture.

**Live Demo:** [https://entertainment-kit.vercel.app](https://entertainment-kit.vercel.app)

---

## 🌟 Key Features

*   **Secure Authentication & Profiles:** Robust JWT-based Login/Signup system with encrypted passwords using `bcrypt`. Supports multiple user profiles per account, each with personalized avatars and colors.
*   **Dynamic Interactive UI:** A stunning Glassmorphic design language featuring smooth CSS backdrop-filters, modern typography, hover animations, and atmospheric cinematic glow effects.
*   **The Movie Database (TMDB) Integration:** Real-time fetching of trending movies, top-rated TV shows, new releases, and live search autocomplete functionality powered by the TMDB API.
*   **Cross-Category Browsing:** Dedicated responsive pages for Home, TV Shows, Movies, and "New & Popular" catalogs. 
*   **"My List" Management:** Users can seamlessly add and remove their favorite content to a personalized watchlist which is securely synced and persisted to the cloud database.
*   **Live Search & Notifications:** Smart universal search bar that instantly queries titles and genres, accompanied by an interactive notification dropdown for the newest releases.

---

## 🛠️ Technology Stack

This application is built using a modern, decoupled Full-Stack architecture:

### Frontend (Client-Side)
*   **Framework:** React 18
*   **Build Tool:** Vite (for rapid HMR and optimized production bundles)
*   **Styling:** Tailwind CSS (utilized for rapid utility-first styling, responsive design breakpoints, and the custom Glassmorphism theme)
*   **Routing:** React Router v6 (for seamless Client-Side Routing and Page Navigation)
*   **Icons:** Lucide React (for lightweight, consistent SVG icons)
*   **HTTP Client:** Axios (for interacting with the custom backend API) & Native `fetch` (for TMDB API integration)

### Backend (Server-Side)
*   **Runtime:** Node.js
*   **Framework:** Express.js (handling REST API endpoint routing and middleware)
*   **Database:** MySQL (Hosted on Aiven Cloud)
*   **Querying:** `mysql2` package (optimized for promise-based queries and connection pooling)
*   **Authentication:** 
    *   `jsonwebtoken` (JWT) for secure, stateless API authorization
    *   `bcrypt` for hashing and salting user passwords before database transit
*   **Environment Management:** `dotenv`

---

## 🗄️ Database Architecture

The MySQL database employs a relational schema featuring three core tables:
1.  **`users`**: Stores the core account information (Username, Encrypted Password, Email, Phone). Enforces unique email and username constraints to prevent duplicate entries.
2.  **`profiles`**: Tied to `users` via a Foreign Key (`user_id`). Handles the sub-profiles for accounts, including custom display names and randomly assigned avatar colors.
3.  **`my_list`**: The watchlist bridging table. Tied via Foreign Key to `profiles`. Stores JSON blob data of saved TMDB movies to ensure fast read-times when loading the My List page.

---

## 🚀 Deployment Strategy

The application is deployed across high-performance cloud providers:

*   **Frontend Hosting:** Vercel (Auto-deployed from the `main` GitHub branch, leveraging edge caching for lightning-fast loads across the globe).
*   **Backend Hosting:** Vercel Serverless Functions (`server/server.js` functions as an API proxy).
*   **Database:** Aiven for MySQL (Cloud-managed relational database).

---

## 💻 Local Development Setup

To run this project locally on your machine, follow these steps:

### Prerequisites:
*   Node.js (v16 or higher)
*   Git

### Installation:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shettyprasad-git/Entertainment-kit.git
   cd Entertainment-kit
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Variables:**
   * Create a `.env` file in the root directory for your TMDB API Key:
     ```env
     VITE_TMDB_API_KEY=your_tmdb_api_key_here
     ```
   * Create a `.env` file inside the `server/` directory for Database & JWT secrets:
     ```env
     DB_HOST=your_aiven_mysql_host
     DB_USER=avnadmin
     DB_PASSWORD=your_database_password
     DB_NAME=defaultdb
     DB_PORT=your_port
     JWT_SECRET=your_super_secret_jwt_string
     ```

5. **Run the Application:**
   * **Start Backend Server:** (In a new terminal wrapper inside the `server` folder) 
     ```bash
     node server.js
     ```
   * **Start Frontend Dev Server:** (In the root repository folder)
     ```bash
     npm run dev
     ```
   * Open `http://localhost:5173` in your browser.

---

## 👤 Author
**Durga Prasad**
* 🔗 GitHub: [https://github.com/shettyprasad-git](https://github.com/shettyprasad-git)
* 🔗 LinkedIn: [https://www.linkedin.com/in/durgaprasadshetty](https://www.linkedin.com/in/durgaprasadshetty)
