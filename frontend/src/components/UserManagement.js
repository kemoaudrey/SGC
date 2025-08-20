import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../src/components/styles/AdminDashboard.css";
const UserManagement = ({ users }) => {
    const [userData, setUserData] = useState({
        email: "",
        role: "manager",
        password: "",
    });
    
    // Pour gérer l'édition d'un utilisateur
    const [editingUser, setEditingUser] = useState(null);
    const [editData, setEditData] = useState({
        email: "",
        role: "",
        password: ""
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/users", userData);
            toast.success("Utilisateur créé avec succès !");
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            toast.error("Erreur lors de la création de l'utilisateur");
            console.error("Erreur lors de la création de l'utilisateur", error);
        }
    };

    // Lance la modification en pré-remplissant les champs d'édition
    const handleEditUser = (user) => {
        setEditingUser(user.id);
        setEditData({
            email: user.email,
            role: user.role,
            password: ""  // laisser vide si aucun changement de mot de passe
        });
    };

    const handleUpdateUser = async (userId) => {
        try {
            await axios.put(`http://localhost:5000/api/users/${userId}`, editData);
            toast.success("Utilisateur mis à jour avec succès !");
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            toast.error("Erreur lors de la mise à jour de l'utilisateur");
            console.error("Erreur lors de la mise à jour de l'utilisateur", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/users/${userId}`);
            toast.success("Utilisateur supprimé avec succès !");
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            toast.error("Erreur lors de la suppression de l'utilisateur");
            console.error("Erreur lors de la suppression de l'utilisateur", error);
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setEditData({ email: "", role: "", password: "" });
    };

    return (
        <div className="user-management">
            <h2>Gestion des Utilisateurs</h2>
            <form onSubmit={handleCreateUser}>
                <h3>Créer un nouvel utilisateur</h3>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    onChange={handleChange}
                    required
                />
                <select name="role" onChange={handleChange} required>
                    <option value="manager">Manager</option>
                    <option value="commercial">Commercial</option>
                    <option value="admin">Administrateur</option>
                </select>
                <button type="submit">Créer un utilisateur</button>
            </form>

            <h3>Liste des utilisateurs</h3>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {editingUser === user.id ? (
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={editData.email}
                                    onChange={handleEditChange}
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    value={editData.password}
                                    placeholder="Nouveau mot de passe (optionnel)"
                                    onChange={handleEditChange}
                                />
                                <select name="role" value={editData.role} onChange={handleEditChange} required>
                                    <option value="manager">Manager</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="admin">Administrateur</option>
                                </select>
                                <button onClick={() => handleUpdateUser(user.id)}>Valider</button>
                                <button onClick={handleCancelEdit}>Annuler</button>
                            </div>
                        ) : (
                            <div>
                                {user.email} - {user.role}
                                <button onClick={() => handleEditUser(user)}>Éditer</button>
                                <button onClick={() => handleDeleteUser(user.id)}>Supprimer</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default UserManagement;
