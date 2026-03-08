import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const endpoint = isLogin ? '/login' : '/register';
    const payload = isLogin ? { email, password } : { name, email, password };
    
    try {
      const response = await axios.post(`https://entertainment-kit-backend.vercel.app${endpoint}`, payload);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user || email));
        navigate('/profile');
      } else if (!isLogin && response.data.message) {
        // Successful registration usually requires login next, or auto-logs in
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
        setError('Registration successful! Please log in.');
      }
    } catch (err) {
      setError(err.response?.data?.error || `${isLogin ? 'Login' : 'Registration'} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center relative select-none"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop')` }}
    >
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#ff4500]/20 to-transparent mix-blend-overlay"></div>
      
      {/* Central Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md mx-4 p-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-700">
        
        <h2 className="text-4xl font-black text-center text-gray-900 mb-8 drop-shadow-sm">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </h2>

        {error && (
          <div className="p-3 bg-red-500/80 backdrop-blur-md text-white rounded-lg mb-6 text-sm font-semibold text-center animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="animate-in slide-in-from-top-4 fade-in duration-300">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="w-full px-5 py-4 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8e44ad] focus:bg-white/80 transition-all font-medium"
              />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-4 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8e44ad] focus:bg-white/80 transition-all font-medium"
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-4 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8e44ad] focus:bg-white/80 transition-all font-medium"
            />
          </div>

          {!isLogin && (
            <div className="animate-in slide-in-from-top-4 fade-in duration-300">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isLogin}
                className="w-full px-5 py-4 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8e44ad] focus:bg-white/80 transition-all font-medium"
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-4 bg-[#7a2e39] hover:bg-[#5c212a] text-white font-bold tracking-wider rounded-xl shadow-lg transition-transform transform hover:scale-[1.02] active:scale-95 duration-200"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Submit')}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between text-sm font-semibold text-gray-800 px-2">
          {isLogin ? (
            <>
              <a href="#" className="hover:text-black transition-colors">Forgot Password</a>
              <button type="button" onClick={() => { setIsLogin(false); setError(''); }} className="hover:text-black transition-colors">Sign up</button>
            </>
          ) : (
            <>
              <span>Already a member?</span>
              <button type="button" onClick={() => { setIsLogin(true); setError(''); }} className="hover:text-black transition-colors">Log In</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
