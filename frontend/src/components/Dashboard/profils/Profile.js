import React, { useState, useEffect } from "react";
import { Save, X, Edit2 } from "lucide-react";
import axios from "axios";
import Sidebar from "../../Dashboard/Sidebar";
import Header from "../../Dashboard/Header";
import "../../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState({ nom: "", email: "", contact: "", role: "", joinedDate: "" });
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ nom: "", email: "", contact: "", password: "" });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = () => {
    axios
      .get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setUser(response.data);
        setUpdatedUser({ ...response.data, password: "" }); // Reset password field for security
      })
      .catch((error) => console.error("Erreur lors du chargement du profil", error));
  };

  const handleUpdateProfile = () => {
    axios
      .put("http://localhost:5000/api/profile", updatedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        fetchUserProfile();
        setEditing(false);
      })
      .catch((error) => console.error("Erreur lors de la mise à jour du profil", error));
  };

  const handleChange = (e) => {
    setUpdatedUser({
      ...updatedUser,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <Header />
        
        {/* Profile Header */}
        <div className="profile-header">
          <h2 className="text-2xl font-semibold">Mon Profil</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="btn-edit"
            >
              <Edit2 className="w-5 h-5 mr-2" />
              Modifier
            </button>
          ) : (
            <div className="button-group">
              <button
                onClick={() => setEditing(false)}
                className="btn-cancel"
              >
                <X className="w-5 h-5 mr-2" />
                Annuler
              </button>
              <button
                onClick={handleUpdateProfile}
                className="btn-save"
              >
                <Save className="w-5 h-5 mr-2" />
                Enregistrer
              </button>
            </div>
          )}
        </div>

        {/* Profile Information */}
        <div className="profile-container">
          <div className="profile-form bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Editable Fields */}
              <div className="form-group">
                <label className="label">Nom</label>
                {editing ? (
                  <input
                    type="text"
                    name="nom"
                    value={updatedUser.nom}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900">{user.nom}</p>
                )}
              </div>

              <div className="form-group">
                <label className="label">Email</label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={updatedUser.email}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900">{user.email}</p>
                )}
              </div>

              <div className="form-group">
                <label className="label">Téléphone</label>
                {editing ? (
                  <input
                    type="text"
                    name="contact"
                    value={updatedUser.contact}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900">{user.contact}</p>
                )}
              </div>

              {/* Password Field (Only for Editing) */}
              {editing && (
                <div className="form-group">
                  <label className="label">Nouveau mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    value={updatedUser.password}
                    onChange={handleChange}
                    placeholder="Laissez vide pour ne pas changer"
                    className="input-field"
                  />
                </div>
              )}

              {/* Static Fields */}
              <div className="form-group">
                <label className="label">Rôle</label>
                <p className="text-gray-900">{user.role}</p>
              </div>

              <div className="form-group">
                <label className="label">Date d'entrée</label>
                <p className="text-gray-900">{user.joinedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;




