import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Search, MoreVertical } from "lucide-react";
import "../../styles/Commerciaux.css";
import Sidebar from "../Sidebar";
import Header from "../Header";

const Commerciaux = () => {
  const [commercials, setCommercials] = useState([
    // Demo data
    {
      id: 1,
      name: "TANDAH Marcelle",
      email: "tandahmarcelle2@gmail.com",
      phone: "693450585",
      position: "Senior Commercial",
      region: "Littoral",
      status: "actif",
      prospects: 3,
      sales: 5,
      performance: "92%",
    },
    {
      id: 2,
      name: "KEMO Mbouyom",
      email: "kemoxaviera17@gmail.com",
      phone: "678392058",
      position: "Commercial",
      region: "Littoral",
      status: "actif",
      prospects: 2,
      sales: 3,
      performance: "87%",
    },
    {
      id: 3,
      name: "Djimeli Princesse",
      email: "djimeliprincess@gmail.com",
      phone: "693857385",
      position: "Junior Commercial",
      region: "Littoral",
      status: "actif",
      prospects: 2,
      sales: 1,
      performance: "75%",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCommercial, setNewCommercial] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    region: "",
    status: "actif",
    prospects: 0,
    sales: 0,
    performance: "0%",
  });
  const [editingCommercial, setEditingCommercial] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showActions, setShowActions] = useState(null); // Track which commercial's actions are visible

  const handleAddCommercial = async () => {
    const newCommercialWithId = { ...newCommercial, id: commercials.length + 1 };
    setCommercials([...commercials, newCommercialWithId]);
    setNewCommercial({
      name: "",
      email: "",
      phone: "",
      position: "",
      region: "",
      status: "actif",
      prospects: 0,
      sales: 0,
      performance: "0%",
    });
    setShowModal(false); // Close modal after adding
  };

  const handleDeleteCommercial = (id) => {
    setCommercials(commercials.filter((commercial) => commercial.id !== id));
  };

  const handleUpdateCommercial = () => {
    setCommercials(
      commercials.map((commercial) =>
        commercial.id === editingCommercial.id ? editingCommercial : commercial
      )
    );
    setEditingCommercial(null);
  };

  const filteredCommercials = commercials.filter((commercial) =>
    commercial.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <h1 className="text-2xl font-bold">Gestion des Commerciaux</h1>
        <p className="text-gray-600">Gérer les membres de votre équipe commerciale</p>

        {/* Button to open modal */}
        <button className="btn btn-primary mt-4" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter un commercial
        </button>

        {/* Barre de recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Rechercher un commercial..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tableau des commerciaux */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Poste</th>
                  <th>Région</th>
                  <th>Prospects</th>
                  <th>Ventes</th>
                  <th>Performance</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommercials.map((commercial) => (
                  <tr key={commercial.id} className="hover:bg-gray-50">
                    <td>{commercial.name}</td>
                    <td>{commercial.email}</td>
                    <td>{commercial.phone}</td>
                    <td>{commercial.position}</td>
                    <td>{commercial.region}</td>
                    <td>{commercial.prospects}</td>
                    <td>{commercial.sales}</td>
                    <td>{commercial.performance}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          commercial.status === "actif"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {commercial.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        onClick={() => setShowActions(showActions === commercial.id ? null : commercial.id)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {showActions === commercial.id && (
                        <div className="absolute bg-white border rounded-lg shadow-lg p-2">
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setEditingCommercial(commercial)}
                          >
                            <Edit className="w-4 h-4 mr-2" /> Modifier
                          </button>
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteCommercial(commercial.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for adding commercial */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <h2>Ajouter un commercial</h2>
              <p>Ajoutez un nouveau commercial à votre équipe</p>
              <input
                type="text"
                placeholder="Nom complet"
                value={newCommercial.name}
                onChange={(e) => setNewCommercial({ ...newCommercial, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={newCommercial.email}
                onChange={(e) => setNewCommercial({ ...newCommercial, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={newCommercial.phone}
                onChange={(e) => setNewCommercial({ ...newCommercial, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Poste"
                value={newCommercial.position}
                onChange={(e) => setNewCommercial({ ...newCommercial, position: e.target.value })}
              />
              <input
                type="text"
                placeholder="Région"
                value={newCommercial.region}
                onChange={(e) => setNewCommercial({ ...newCommercial, region: e.target.value })}
              />
              <select
                value={newCommercial.status}
                onChange={(e) => setNewCommercial({ ...newCommercial, status: e.target.value })}
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
              <div className="flex justify-end mt-6 space-x-4">
                <button onClick={() => setShowModal(false)} className="btn btn-secondary px-4 py-2 rounded-md">
                  Annuler
                </button>
                <button onClick={handleAddCommercial} className="btn btn-primary px-4 py-2 rounded-md">
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de mise à jour */}
      {editingCommercial && (
        <div className="modal-overlay" onClick={() => setEditingCommercial(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <h2>Modifier le commercial</h2>
              <input
                type="text"
                placeholder="Nom complet"
                value={editingCommercial.name}
                onChange={(e) => setEditingCommercial({ ...editingCommercial, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={editingCommercial.email}
                onChange={(e) => setEditingCommercial({ ...editingCommercial, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={editingCommercial.phone}
                onChange={(e) => setEditingCommercial({ ...editingCommercial, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Poste"
                value={editingCommercial.position}
                onChange={(e) => setEditingCommercial({ ...editingCommercial, position: e.target.value })}
              />
              <input
                type="text"
                placeholder="Région"
                value={editingCommercial.region}
                onChange={(e) => setEditingCommercial({ ...editingCommercial, region: e.target.value })}
              />
              <select
                value={editingCommercial.status}
                onChange={(e) => setEditingCommercial({ ...editingCommercial, status: e.target.value })}
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
              <div className="flex justify-end mt-6 space-x-4">
                <button onClick={() => setEditingCommercial(null)} className="btn btn-secondary px-4 py-2 rounded-md">
                  Annuler
                </button>
                <button onClick={handleUpdateCommercial} className="btn btn-primary px-4 py-2 rounded-md">
                  Mettre à jour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Commerciaux;