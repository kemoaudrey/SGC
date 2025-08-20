import React, { useState } from "react";
import axios from "axios";
import "../../src/components/styles/AdminDashboard.css";

const RoleManagement = () => {
    const [selectedRole, setSelectedRole] = useState("");
    const [permissions, setPermissions] = useState([]);

    const handleRoleChange = async (e) => {
        const role = e.target.value;
        setSelectedRole(role);

        // Récupérer les permissions du rôle sélectionné
        try {
            const response = await axios.get(`http://localhost:5000/api/roles/${role}`);
            setPermissions(response.data.permissions);
        } catch (error) {
            console.error("Erreur lors du chargement des permissions", error);
        }
    };

    return (
        <div className="role-management">
            <h2>Gestion des Rôles et Permissions</h2>
            <select onChange={handleRoleChange} value={selectedRole}>
                <option value="">Sélectionner un rôle</option>
                <option value="admin">Administrateur</option>
                <option value="manager">Manager</option>
                <option value="commercial">Commercial</option>
            </select>

            {permissions.length > 0 && (
                <div>
                    <h3>Permissions du rôle {selectedRole}</h3>
                    <ul>
                        {permissions.map((permission, index) => (
                            <li key={index}>{permission}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RoleManagement;
