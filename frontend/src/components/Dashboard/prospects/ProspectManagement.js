import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Sidebar from "../Sidebar";
import Header from "../Header";
import "../../styles/ProspectManagement.css";

const statusOptions = ["Nouveau", "En cours", "Converti", "Perdu"];

const ProspectManagement = () => {
  const [prospects, setProspects] = useState([]);
  const [newProspect, setNewProspect] = useState({ name: "", email: "", contact: "", status: "Nouveau" });
  const [editingProspect, setEditingProspect] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/getall/prospects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProspects(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des prospects", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProspect = async () => {
    if (!newProspect.name || !newProspect.email || !newProspect.contact) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/add/prospects", newProspect, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchProspects();
      setNewProspect({ name: "", email: "", contact: "", status: "Nouveau" });
    } catch (error) {
      console.error("Erreur lors de l'ajout du prospect", error);
    }
  };

  const handleUpdateProspect = async () => {
    if (!editingProspect) return;

    try {
      await axios.put(`http://localhost:5000/api/update/prospects/${editingProspect.id}`, editingProspect, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchProspects();
      setEditingProspect(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du prospect", error);
    }
  };

  const handleDeleteProspect = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce prospect ?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/prospects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchProspects();
    } catch (error) {
      console.error("Erreur lors de la suppression du prospect", error);
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      Nouveau: "bg-blue-100 text-blue-800",
      "En cours": "bg-yellow-100 text-yellow-800",
      Converti: "bg-green-100 text-green-800",
      Perdu: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const columns = [
    {
      name: "Nom",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) =>
        editingProspect?.id === row.id ? (
          <input
            type="text"
            value={editingProspect.name}
            onChange={(e) => setEditingProspect({ ...editingProspect, name: e.target.value })}
            className="input-edit"
          />
        ) : (
          row.name
        ),
    },
    {
      name: "Email",
      selector: (row) => row.email,
      cell: (row) =>
        editingProspect?.id === row.id ? (
          <input
            type="email"
            value={editingProspect.email}
            onChange={(e) => setEditingProspect({ ...editingProspect, email: e.target.value })}
            className="input-edit"
          />
        ) : (
          row.email
        ),
    },
    {
      name: "Contact",
      selector: (row) => row.contact,
      cell: (row) =>
        editingProspect?.id === row.id ? (
          <input
            type="text"
            value={editingProspect.contact}
            onChange={(e) => setEditingProspect({ ...editingProspect, contact: e.target.value })}
            className="input-edit"
          />
        ) : (
          row.contact
        ),
    },
    {
      name: "Statut",
      selector: (row) => row.status,
      cell: (row) =>
        editingProspect?.id === row.id ? (
          <select
            value={editingProspect.status}
            onChange={(e) => setEditingProspect({ ...editingProspect, status: e.target.value })}
            className="input-edit"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        ) : (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(row.status)}`}>
            {row.status}
          </span>
        ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons flex space-x-2">
          {editingProspect?.id === row.id ? (
            <button className="text-green-600 hover:text-green-800" onClick={handleUpdateProspect}>
              <Save className="w-4 h-4" />
            </button>
          ) : (
            <button className="text-blue-600 hover:text-blue-800" onClick={() => setEditingProspect(row)}>
              <Edit className="w-4 h-4" />
            </button>
          )}
          <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteProspect(row.id)}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <h1 className="text-2xl font-semibold">Gestion des Prospects</h1>

        {/* Formulaire d'ajout */}
        <div className="add-prospect-form">
          <input type="text" placeholder="Nom" value={newProspect.name} onChange={(e) => setNewProspect({ ...newProspect, name: e.target.value })} />
          <input type="email" placeholder="Email" value={newProspect.email} onChange={(e) => setNewProspect({ ...newProspect, email: e.target.value })} />
          <input type="text" placeholder="Contact" value={newProspect.contact} onChange={(e) => setNewProspect({ ...newProspect, contact: e.target.value })} />
          <button className="btn btn-primary" onClick={handleAddProspect}>
            <Plus className="w-5 h-5 mr-2" /> Ajouter
          </button>
        </div>

        {/* Table des prospects */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <DataTable columns={columns} data={prospects} pagination highlightOnHover responsive progressPending={loading} />
        </div>
      </div>
    </div>
  );
};

export default ProspectManagement;
