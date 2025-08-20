import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Plus, Check, X } from "lucide-react"; // Retirer Shield et Edit
import Sidebar from "../Sidebar";
import Header from "../Header";
import "../../styles/RoleManegement.css";
const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRole, setNewRole] = useState({ name: "", permissions: [] });

  // Charger les rôles depuis Flask
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/getall/roles", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setRoles(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des rôles", error));
  }, []);

  // Ajouter un rôle
  const handleAddRole = () => {
    axios
      .post("http://localhost:5000/api/add/roles", newRole, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setRoles([...roles, { ...newRole, id: response.data.id }]);
        setNewRole({ name: "", permissions: [] });
      })
      .catch((error) => console.error("Erreur lors de l'ajout du rôle", error));
  };

  // Supprimer un rôle
  const handleDeleteRole = (id) => {
    axios
      .delete(`http://localhost:5000/api/delete/roles/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => setRoles(roles.filter((role) => role.id !== id)))
      .catch((error) => console.error("Erreur lors de la suppression du rôle", error));
  };

  // Mettre à jour les permissions d’un rôle
  const handleUpdatePermissions = () => {
    axios
      .put(`http://localhost:5000/update/api/roles/${selectedRole.id}`, { permissions: selectedRole.permissions }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => alert("Permissions mises à jour avec succès!"))
      .catch((error) => console.error("Erreur lors de la mise à jour des permissions", error));
  };

  // Permissions disponibles
  const availablePermissions = [
    { id: "user_create", name: "Créer des utilisateurs" },
    { id: "user_edit", name: "Modifier des utilisateurs" },
    { id: "user_delete", name: "Supprimer des utilisateurs" },
    { id: "product_manage", name: "Gérer les produits" },
    { id: "prospect_manage", name: "Gérer les prospects" },
    { id: "report_view", name: "Voir les rapports" },
  ];

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <h1 className="text-2xl font-bold">Gestion des Rôles & Permissions</h1>

        {/* Formulaire d'ajout de rôle */}
        <div className="add-role-form">
          <input
            type="text"
            placeholder="Nom du rôle"
            value={newRole.name}
            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
          />
          <button className="btn btn-primary" onClick={handleAddRole}>
            <Plus className="w-4 h-4 mr-2" /> Ajouter
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des rôles */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Rôles</h2>
              {roles.map((role) => (
                <div key={role.id} className="p-4 rounded-lg border cursor-pointer transition-colors"
                  onClick={() => setSelectedRole(role)}>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{role.name}</h3>
                    <div className="flex space-x-2">
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded"
                        onClick={() => handleDeleteRole(role.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{role.permissions.length} permissions</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gestion des permissions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Permissions</h2>
              {selectedRole ? (
                <div>
                  {availablePermissions.map((permission) => {
                    const hasPermission = selectedRole.permissions.includes(permission.id);
                    return (
                      <div key={permission.id} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{permission.name}</h3>
                          <button onClick={() => {
                            setSelectedRole((prev) => ({
                              ...prev,
                              permissions: hasPermission
                                ? prev.permissions.filter((p) => p !== permission.id)
                                : [...prev.permissions, permission.id],
                            }));
                          }}>
                            {hasPermission ? <Check className="text-green-600" /> : <X className="text-gray-400" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <button className="btn btn-primary mt-4" onClick={handleUpdatePermissions}>
                    Sauvegarder
                  </button>
                </div>
              ) : (
                <p className="text-center text-gray-500">Sélectionnez un rôle pour gérer ses permissions</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
