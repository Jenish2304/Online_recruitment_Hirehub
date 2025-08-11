import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // make sure path is correct

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // get user & logout from context
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:from-primary hover:to-secondary transition-all duration-300"
          >
            HireHub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {!user && (
              <>
                <Link to="/" className="px-4 py-2 text-accent hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 font-medium">
                  Home
                </Link>
                <Link to="/signup" className="px-4 py-2 text-accent hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 font-medium">
                  Sign Up
                </Link>
                <Link to="/login" className="px-4 py-2 btn-primary">
                  Login
                </Link>
              </>
            )}

            {user && user.role === "candidate" && (
              <>
                
                <Link to="/jobs" className="px-4 py-2 text-accent hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 font-medium">
                  Browse Jobs
                </Link>
                <Link to="/applications" className="px-4 py-2 text-accent hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 font-medium">
                  My Applications
                </Link>
                <Link to="/my/interviews" className="px-4 py-2 text-accent hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 font-medium">
                  My Interviews
                </Link>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <button onClick={handleLogout} className="px-4 py-2 text-accent hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium">
                  Logout
                </button>
              </>
            )}

            {user && user.role === "employer" && (
              <>
                <Link to="/employer/dashboard" className="px-4 py-2 text-accent hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 font-medium">
                  Dashboard
                </Link>
                   <Link to="/jobs" className="px-4 py-2 text-accent hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 font-medium">
                  Browse Jobs
                </Link>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <button onClick={handleLogout} className="px-4 py-2 text-accent hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium">
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button omitted for brevity, but same pattern: use `user` from context */}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
