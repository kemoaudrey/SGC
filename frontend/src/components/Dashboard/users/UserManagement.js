import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, UserPlus, Edit, Trash2 } from "lucide-react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import DataTable from "react-data-table-component";
import "../../styles/UserManagement.css";
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [newUser, setNewUser] = useState({ nom: "",email: "", password: "", role: "commercial" });

  // Récupérer les utilisateurs depuis l'API Flask
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des utilisateurs", error));
  }, []);

  // Ajouter un utilisateur
  const handleAddUser = () => {
    axios
      .post("http://localhost:5000/api/users", newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setUsers([...users, { ...newUser, id: response.data.id }]);
        setNewUser({ nom: "", email: "", password: "", role: "commercial" });
      })
      .catch((error) => console.error("Erreur lors de l'ajout de l'utilisateur", error));
  };

  // Supprimer un utilisateur
  const handleDeleteUser = (id) => {
    axios
      .delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => setUsers(users.filter((user) => user.id !== id)))
      .catch((error) => console.error("Erreur lors de la suppression de l'utilisateur", error));
  };

  // Filtrer les utilisateurs selon la recherche et le rôle
  const filteredUsers = users.filter((user) => {
    return (
      (user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedRole === "all" || user.role === selectedRole)
    );
  });

  const columns = [
    {
      name: "Utilisateur",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-500" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{row.email}</div>
            <div className="text-sm text-gray-500">{row.role}</div>
          </div>
        </div>
      ),
    },
    {
      name: "Rôle",
      selector: (row) => row.role,
      sortable: true,
      cell: (row) => (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          {row.role}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-3">
         <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Edit className="w-4 h-4" />
                            </button>
          <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteUser(row.id)}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>

        {/* Formulaire d'ajout d'utilisateur */}
        <div className="add-user-form">
         <input
            type="nom"
            placeholder="Nom"
            value={newUser.nom}
            onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="commercial">Commercial</option>
          </select>
          <button className="btn btn-primary" onClick={handleAddUser}>
            <UserPlus className="w-4 h-4 mr-2" /> Ajouter
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className="input max-w-xs" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="all">Tous les rôles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* Table des utilisateurs */}
          <DataTable columns={columns} data={filteredUsers} pagination highlightOnHover responsive />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
