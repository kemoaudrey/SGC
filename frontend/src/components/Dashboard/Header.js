import React, { useEffect, useState } from "react";
import { Bell, Search, User } from "lucide-react";
import axios from "axios";
import "../styles/Header.css";

const Header = () => {
  const [user, setUser] = useState({ nom: "", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement du profil", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="header">
      {/* Search Bar */}
      <div className="search-container">
        <input type="text" placeholder="Search..." className="search-input" />
        <Search className="search-icon" />
      </div>

      {/* User Section */}
      <div className="user-section">
        {/* Notifications */}
        <button className="notification-btn">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="notification-badge">3</span>
        </button>

        {/* User Profile */}
        <div className="user-profile">
          <div className="user-avatar">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div className="user-info">
            {loading ? (
              <p className="text-gray-500">Chargement...</p>
            ) : (
              <>
                <p className="user-name">{user.nom || "Utilisateur"}</p>
                <p className="user-email">{user.email || "email@domain.com"}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
