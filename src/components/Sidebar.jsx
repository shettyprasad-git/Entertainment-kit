import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'sidebar-icon active' : 'sidebar-icon';
    };

    return (
        <div className="sidebar">
            <div className="sidebar-top">
                <div className="sidebar-brand">
                    <span>E</span>
                </div>

                <Link to="/" title="Home">
                    <FaHome className={isActive('/')} />
                </Link>

                <Link to="/search" title="Search">
                    <FaSearch className={isActive('/search')} />
                </Link>
            </div>

            <div className="sidebar-bottom">
                <div className="sidebar-profile" title="Profile">
                    <FaUser className="sidebar-icon" />
                </div>
                <div onClick={handleLogout} className="sidebar-logout" title="Logout">
                    <FaSignOutAlt className="sidebar-icon" />
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
