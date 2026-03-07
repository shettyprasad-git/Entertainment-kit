import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function ProfileSelection() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-blue-600");
  const EditModalRef = useRef(null);
  
  const colors = ["bg-red-600", "bg-blue-600", "bg-green-500", "bg-yellow-500", "bg-purple-600", "bg-pink-600", "bg-indigo-600"];

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
    if (isEditingMode) {
      setEditingProfile(profile);
      setNewProfileName(profile.name);
      setSelectedColor(profile.color);
    } else {
      localStorage.setItem('activeProfile', JSON.stringify(profile));
      navigate('/');
    }
  };

  const saveProfile = () => {
    if (!newProfileName.trim()) return;
    
    let updated;
    if (editingProfile.id === 'NEW') {
      // Adding new profile
      updated = [...profiles, { id: Date.now(), name: newProfileName, color: selectedColor }];
    } else {
      // Updating existing
      updated = profiles.map(p => 
        p.id === editingProfile.id ? { ...p, name: newProfileName, color: selectedColor } : p
      );
    }
    
    setProfiles(updated);
    localStorage.setItem('userProfiles', JSON.stringify(updated));
    setEditingProfile(null);
  };

  const deleteProfile = (id) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    localStorage.setItem('userProfiles', JSON.stringify(updated));
    setEditingProfile(null);
  };

  const startAddProfile = () => {
    if (profiles.length >= 5) return;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setEditingProfile({ id: 'NEW', name: '', color: randomColor });
    setNewProfileName('');
    setSelectedColor(randomColor);
  };

  return (
    <div className="min-h-screen bg-[#141414] bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/d1512bf6-9818-4720-bc2a-f865fcdb438b/08c35b8e-7117-48f0-b9a3-5a0dc5c63ed4/US-en-20220613-popsignuptwoweeks-perspective_alpha_website_small.jpg')] bg-cover bg-center flex items-center justify-center relative select-none">
      
      {/* Dimmed Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Glassmorphism Container */}
      <div className="relative z-10 w-full max-w-5xl px-4 py-16 animate-in fade-in zoom-in-95 duration-700 ease-out flex flex-col items-center">
        
        <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight mb-16 drop-shadow-lg text-center">
          {isEditingMode ? "Manage Profiles" : "Who's watching?"}
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
                bg-opacity-80 backdrop-blur-md hover:bg-opacity-100 overflow-hidden relative
                ${isEditingMode ? 'opacity-75' : ''}`}
              >
                  {/* Subtle glass reflection effect inside avatar */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                  
                  {isEditingMode ? (
                    <Pencil size={40} className="text-white opacity-80" />
                  ) : (
                    <span className="text-white text-4xl font-black drop-shadow-md">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  )}
              </div>
              <span className="text-gray-400 font-medium text-lg mt-4 group-hover:text-white transition-colors tracking-wide">
                {profile.name}
              </span>
            </div>
          ))}

          {/* Add Profile Button */}
          {profiles.length < 5 && (
            <div 
              onClick={startAddProfile}
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

        <button 
          onClick={() => setIsEditingMode(!isEditingMode)}
          className={`mt-24 px-8 py-2 md:px-10 md:py-3 tracking-[0.2em] font-medium text-sm md:text-base border transition-colors duration-300 rounded-sm
            ${isEditingMode 
              ? 'bg-white text-black border-white hover:bg-gray-200' 
              : 'text-gray-400 border-gray-500 hover:text-white hover:border-white bg-white/5 backdrop-blur-sm'
            }`}
        >
          {isEditingMode ? 'DONE' : 'MANAGE PROFILES'}
        </button>

      </div>

      {/* Edit/Add Modal Overlay */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#141414] p-8 md:p-12 max-w-2xl w-full mx-4 animate-in zoom-in-95 duration-300 shadow-2xl relative">
            <h2 className="text-3xl font-medium text-white mb-8 border-b border-gray-600 pb-4">
              {editingProfile.id === 'NEW' ? 'Add Profile' : 'Edit Profile'}
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar Preview */}
              <div className={`w-28 h-28 shrink-0 rounded-md ${selectedColor} flex items-center justify-center border border-white/20 shadow-lg`}>
                 <span className="text-white text-4xl font-black drop-shadow-md">
                    {newProfileName ? newProfileName.charAt(0).toUpperCase() : '?'}
                  </span>
              </div>
              
              <div className="flex-1 space-y-6 w-full">
                <div>
                  <input 
                    type="text" 
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Name"
                    className="w-full bg-gray-600 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white transition placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <p className="text-gray-400 mb-2 text-sm">Choose Color:</p>
                  <div className="flex flex-wrap gap-3">
                    {colors.map(color => (
                        <button 
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full ${color} ${selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#141414]' : 'opacity-50 hover:opacity-100'}`}
                        />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-gray-600 pt-6 gap-4">
              <div className="flex gap-4 w-full sm:w-auto">
                <button 
                  onClick={saveProfile}
                  className="px-6 py-2 bg-white text-black font-bold hover:bg-gray-200 transition-colors w-full sm:w-auto"
                >
                  Save
                </button>
                <button 
                  onClick={() => setEditingProfile(null)}
                  className="px-6 py-2 bg-transparent text-gray-400 border border-gray-500 font-bold hover:text-white hover:border-white transition-colors w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>

              {editingProfile.id !== 'NEW' && profiles.length > 1 && (
                 <button 
                  onClick={() => deleteProfile(editingProfile.id)}
                  className="flex items-center text-gray-400 hover:text-red-500 transition-colors"
                 >
                   <Trash2 size={16} className="mr-2" /> Delete Profile
                 </button>
              )}
            </div>
            
            {/* Close X */}
            <button onClick={() => setEditingProfile(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
