import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ProfileSelection from "./pages/ProfileSelection";
import CategoryPage from "./pages/CategoryPage";
import MyList from "./pages/MyList";
import { requests } from "./utils/requests";

function App() {
  return (
    <div className="bg-[#141414] min-h-screen text-white font-sans selection:bg-red-600 overflow-x-hidden">
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/profile" element={<ProfileSelection />} />
        <Route path="/" element={<Home />} />
        
        {/* New Dedicated Category Routes */}
        <Route path="/tv-shows" element={<CategoryPage title="TV Shows" fetchUrl={requests.originals} />} />
        <Route path="/movies" element={<CategoryPage title="Movies" fetchUrl={requests.topRated} />} />
        <Route path="/new-popular" element={<CategoryPage title="New & Popular" fetchUrl={requests.trending} />} />
        <Route path="/my-list" element={<MyList />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
