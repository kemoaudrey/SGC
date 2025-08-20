import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Edit, Save, Trash2, Plus } from "lucide-react";
import Sidebar from "../../components/Dashboard/Sidebar";
import Header from "../../components/Dashboard/Header";
import "../styles/VenteManagement.css";

const VenteManagement = () => {
  const [prospects, setProspects] = useState([]);
  const [ventes, setVentes] = useState([]);
  const [editingVente, setEditingVente] = useState(null);
  const [newVente, setNewVente] = useState({ 
    prospect_id: "", 
    product_name: "", 
    amount: "", 
    status: "En cours" 
  });

  useEffect(() => {
    fetchProspects();
    fetchVentes();
  }, []);

  const fetchProspects = () => {
    axios
      .get("http://localhost:5000/api/getall/prospects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setProspects(response.data))
      .catch((error) => console.error("Erreur lors du chargement des prospects", error));
  };

  const fetchVentes = () => {
    axios
      .get("http://localhost:5000/api/getall/ventes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setVentes(response.data))
      .catch((error) => console.error("Erreur lors du chargement des ventes", error));
  };
  const handleAddVente = () => {
    if (!newVente.prospect_id || !newVente.product_name || !newVente.amount) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
  
    axios
      .post("http://localhost:5000/api/add/vente", newVente, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        fetchVentes();
        setNewVente({ prospect_id: "", product_name: "", amount: "", status: "En cours" });
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout de la vente", error);
        alert("Erreur lors de l'ajout de la vente. Veuillez réessayer.");
      });
  };

  const handleUpdateVente = () => {
    if (!editingVente) return;

    axios
      .put(`http://localhost:5000/api/update/vente/${editingVente.id}`, editingVente, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        fetchVentes();
        setEditingVente(null);
      })
      .catch((error) => console.error("Erreur lors de la mise à jour de la vente", error));
  };

  const handleDeleteVente = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette vente ?")) {
      axios
        .delete(`http://localhost:5000/api/delete/vente/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(() => fetchVentes())
        .catch((error) => console.error("Erreur lors de la suppression de la vente", error));
    }
  };

  // ✅ Fix: Ensure status values match exactly (trim spaces)
  const statusColors = {
    "En cours": "bg-yellow-100 text-yellow-800",
    "Finalisée": "bg-green-100 text-green-800",
    "Annulée": "bg-red-100 text-red-800",
  };

  const columns = [
    {
      name: "Prospect",
      selector: (row) => row.prospect_ids,
      sortable: true,
    },
    {
      name: "Produit",
      selector: (row) => row.product_name,
      sortable: true,
      cell: (row) =>
        editingVente?.id === row.id ? (
          <input
            type="text"
            value={editingVente.product_name}
            onChange={(e) => setEditingVente({ ...editingVente, product_name: e.target.value })}
            className="input-edit"
          />
        ) : (
          row.product_name
        ),
    },
    {
      name: "Montant (FCFA)",
      selector: (row) => row.amount,
      sortable: true,
      cell: (row) =>
        editingVente?.id === row.id ? (
          <input
            type="number"
            value={editingVente.amount}
            onChange={(e) => setEditingVente({ ...editingVente, amount: e.target.value })}
            className="input-edit"
          />
        ) : (
          row.amount
        ),
    },
    {
      name: "Statut",
      selector: (row) => row.status,
      cell: (row) => {
        console.log("Current status:", row.status); // ✅ Debugging
        const trimmedStatus = row.status?.trim(); // ✅ Ensure no extra spaces
        return editingVente?.id === row.id ? (
          <select
            value={editingVente.status}
            onChange={(e) => setEditingVente({ ...editingVente, status: e.target.value })}
            className="input-edit"
          >
            <option value="En cours">En cours</option>
            <option value="Finalisée">Finalisée</option>
            <option value="Annulée">Annulée</option>
          </select>
        ) : (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[trimmedStatus] || "bg-gray-100 text-gray-800"}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons flex space-x-2">
          {editingVente?.id === row.id ? (
            <button className="text-green-600 hover:text-green-800" onClick={handleUpdateVente}>
              <Save className="w-4 h-4" />
            </button>
          ) : (
            <button className="text-blue-600 hover:text-blue-800" onClick={() => setEditingVente(row)}>
              <Edit className="w-4 h-4" />
            </button>
          )}
          <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteVente(row.id)}>
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

        <h1 className="text-2xl font-semibold">Gestion des Ventes</h1>

        {/* Formulaire d'ajout */}
        <div className="vente-form bg-white p-4 rounded-lg shadow-sm mb-4">
          <h2 className="text-lg font-semibold mb-2">Ajouter une Vente</h2>
          <select value={newVente.prospect_id} onChange={(e) => setNewVente({ ...newVente, prospect_id: e.target.value })}>
            <option value="">Sélectionner un prospect</option>
            {prospects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <input type="text" placeholder="Nom du Produit" value={newVente.product_name} onChange={(e) => setNewVente({ ...newVente, product_name: e.target.value })} />
          <input type="number" placeholder="Montant" value={newVente.amount} onChange={(e) => setNewVente({ ...newVente, amount: e.target.value })} />

          <button className="btn btn-primary" onClick={handleAddVente}>
            <Plus className="w-4 h-4 mr-2" /> Ajouter la Vente
          </button>
        </div>

        {/* Tableau des ventes */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <DataTable columns={columns} data={ventes} pagination highlightOnHover responsive />
        </div>
      </div>
    </div>
  );
};

export default VenteManagement;
