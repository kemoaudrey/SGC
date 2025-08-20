import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Check, X } from "lucide-react";
import "../../styles/Validation.css";
import Sidebar from "../Sidebar";
import Header from "../Header";

const Validation = () => {
  const [pendingSales, setPendingSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPendingSales();
  }, []);

  const fetchPendingSales = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/pending-sales", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPendingSales(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des ventes en attente", error);
    }
  };

  const handleApproveSale = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/approve-sale/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchPendingSales();
    } catch (error) {
      console.error("Erreur lors de la validation de la vente", error);
    }
  };

  const handleRejectSale = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/reject-sale/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchPendingSales();
    } catch (error) {
      console.error("Erreur lors du rejet de la vente", error);
    }
  };

  const filteredPendingSales = pendingSales.filter((sale) =>
    sale.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <h1 className="text-2xl font-bold">Validation des Ventes</h1>

        {/* Barre de recherche */}
        <div className="search-bar flex items-center bg-white p-2 rounded-lg shadow-sm">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Rechercher une vente..."
            className="input flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tableau des ventes en attente */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Produit</th>
                <th className="p-3 text-left">Montant</th>
                <th className="p-3 text-left">Statut</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPendingSales.map((sale) => (
                <tr key={sale.id} className="border-b">
                  <td className="p-3">{sale.client}</td>
                  <td className="p-3">{sale.product}</td>
                  <td className="p-3">{sale.amount}€</td>
                  <td className="p-3">
                    <span className={`status-badge ${sale.status}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="p-3 flex space-x-2">
                    <button onClick={() => handleApproveSale(sale.id)} className="text-green-500">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleRejectSale(sale.id)} className="text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Validation;
