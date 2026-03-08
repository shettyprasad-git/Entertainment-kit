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
    <div className="min-h-screen bg-[#141414] bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/d1512bf6-9818-4720-bc2a-f865fcdb438b/08c35b8e-7117-48f0-b9a3-5a0dc5c63ed4/US-en-20220613-popsignuptwoweeks-perspective_alpha_website_small.jpg')] bg-cover bg-center flex flex-col justify-center relative select-none">
      
      {/* Background Gradient Split (Top Dark, Bottom Purple tint) */}
      <div className="absolute inset-0 z-0 flex flex-col">
        <div className="h-1/2 bg-black/80"></div>
        <div className="h-1/2 bg-[#8b85cc]/90 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-500">
        
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          {isLogin ? 'Login Form' : 'Signup Form'}
        </h2>

        {/* Custom Toggle Switch */}
        <div className="relative flex w-full bg-white border border-gray-200 rounded-lg mb-8 overflow-hidden h-12 shadow-sm">
          {/* Animated Slider Background */}
          <div 
            className={`absolute top-0 bottom-0 w-1/2 bg-blue-600 transition-transform duration-300 ease-in-out ${!isLogin ? 'translate-x-full' : 'translate-x-0'}`}
            style={{ borderRadius: isLogin ? '8px 0 0 8px' : '0 8px 8px 0' }}
          ></div>
          
          <button 
            type="button"
            className={`flex-1 relative z-10 font-semibold transition-colors duration-300 ${isLogin ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Login
          </button>
          
          <button 
            type="button"
            className={`flex-1 relative z-10 font-semibold transition-colors duration-300 ${!isLogin ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Signup
          </button>
        </div>

        {error && (
          <div className={`p-3 rounded mb-6 text-sm font-medium ${error.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="animate-in slide-in-from-top-4 fade-in duration-300">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {!isLogin && (
            <div className="animate-in slide-in-from-top-4 fade-in duration-300">
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isLogin}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          )}

          {isLogin && (
            <div className="flex justify-start">
              <a href="#" className="text-blue-500 text-sm hover:underline font-medium">Forgot password?</a>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 mt-6 bg-[#004b93] hover:bg-blue-800 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : isLogin ? 'Login' : 'Signup'}
          </button>
        </form>

        {isLogin && (
          <div className="mt-8 text-center text-sm text-gray-600">
            Not a member? <button type="button" onClick={() => { setIsLogin(false); setError(''); }} className="text-blue-500 hover:underline font-medium">Signup now</button>
          </div>
        )}
      </div>
    </div>
  );
}
