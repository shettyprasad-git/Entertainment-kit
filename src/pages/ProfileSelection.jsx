import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function ProfileSelection() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    // Check for authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load custom profiles from local storage, or use default starter dummy profiles
    const savedProfiles = localStorage.getItem('userProfiles');
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    } else {
      const defaultProfiles = [
        { id: 1, name: "Prasad", color: "bg-blue-600" },
        { id: 2, name: "Kids", color: "bg-green-500" },
        { id: 3, name: "Guest", color: "bg-yellow-500" }
      ];
      setProfiles(defaultProfiles);
      localStorage.setItem('userProfiles', JSON.stringify(defaultProfiles));
    }
  }, [navigate]);

  const selectProfile = (profile) => {
    localStorage.setItem('activeProfile', JSON.stringify(profile));
    navigate('/');
  };

  const addProfile = () => {
    if (profiles.length >= 5) return;
    const colors = ["bg-red-600", "bg-purple-600", "bg-pink-600", "bg-indigo-600"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newProfile = {
      id: Date.now(),
      name: `User ${profiles.length + 1}`,
      color: randomColor
    };
    const updated = [...profiles, newProfile];
    setProfiles(updated);
    localStorage.setItem('userProfiles', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#141414] bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/d1512bf6-9818-4720-bc2a-f865fcdb438b/08c35b8e-7117-48f0-b9a3-5a0dc5c63ed4/US-en-20220613-popsignuptwoweeks-perspective_alpha_website_small.jpg')] bg-cover bg-center flex items-center justify-center relative select-none">
      
      {/* Dimmed Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Glassmorphism Container */}
      <div className="relative z-10 w-full max-w-5xl px-4 py-16 animate-in fade-in zoom-in-95 duration-700 ease-out flex flex-col items-center">
        
        <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight mb-16 drop-shadow-lg text-center">
          Who's watching?
        </h1>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {profiles.map((profile) => (
            <div 
              key={profile.id}
              onClick={() => selectProfile(profile)}
              className="group flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110"
            >
              <div 
                className={`w-28 h-28 md:w-36 md:h-36 rounded-md shadow-2xl ${profile.color} flex items-center justify-center 
                border-2 border-transparent group-hover:border-white transition-all 
                bg-opacity-80 backdrop-blur-md hover:bg-opacity-100 overflow-hidden relative`}
              >
                  {/* Subtle glass reflection effect inside avatar */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                  <span className="text-white text-4xl font-black drop-shadow-md">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
              </div>
              <span className="text-gray-400 font-medium text-lg mt-4 group-hover:text-white transition-colors tracking-wide">
                {profile.name}
              </span>
            </div>
          ))}

          {/* Add Profile Button */}
          {profiles.length < 5 && (
            <div 
              onClick={addProfile}
              className="group flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110"
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-md shadow-2xl flex items-center justify-center 
                border-2 border-transparent group-hover:border-white group-hover:bg-gray-200 transition-all
                bg-black/40 backdrop-blur-md border border-white/10">
                <Plus size={48} className="text-gray-400 group-hover:text-black transition-colors" />
              </div>
              <span className="text-gray-400 font-medium text-lg mt-4 group-hover:text-white transition-colors tracking-wide">
                Add Profile
              </span>
            </div>
          )}
        </div>

        <button className="mt-24 px-8 py-2 md:px-10 md:py-3 text-gray-400 border border-gray-500 tracking-[0.2em] font-medium text-sm md:text-base hover:text-white hover:border-white transition-colors duration-300 bg-white/5 backdrop-blur-sm rounded-sm">
          MANAGE PROFILES
        </button>

      </div>
    </div>
  );
}
