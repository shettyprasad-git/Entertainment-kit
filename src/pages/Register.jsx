import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            await axios.post('http://localhost:5000/register', {
                username: formData.username,
                name: formData.name,
                password: formData.password,
                email: formData.email,
                phone: formData.phone
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="register-container">
            <div className="register-glass">
                <div className="register-header">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
                        alt="Netflix Logo"
                        className="register-logo"
                    />
                    <h2>Sign Up</h2>
                </div>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="register-btn">
                        Register
                    </button>
                </form>

                <div className="register-footer">
                    <p>
                        Already have an account? <Link to="/login">Sign in now</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
