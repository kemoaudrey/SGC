import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Check, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import "../../styles/Ventes.css";
import Sidebar from "../Sidebar";
import Header from "../Header";

const Ventes = () => {
  const [sales, setSales] = useState([
    // Fictive data for visualization
    {
      id: 1,
      client: "Tech Solutions SA",
      product: "Assurance Responsabilité Civile Pro",
      amount: 4500,
      status: "En cours",
      date: "2023-10-01",
    },
    {
      id: 2,
      client: "Constructions Lambert",
      product: "Assurance Tous Risques Chantier",
      amount: 8200,
      status: "Validée",
      date: "2023-10-05",
    },
    {
      id: 3,
      client: "Assurances Modernes",
      product: "Assurance Multirisque Pro",
      amount: 3600,
      status: "Validée",
      date: "2023-10-10",
    },
    {
      id: 4,
      client: "Consulting Expert",
      product: "Assurance Protection Juridique",
      amount: 2100,
      status: "En cours",
      date: "2023-10-15",
    },
    {
      id: 5,
      client: "Transports Rapides",
      product: "Assurance Flotte Automobile",
      amount: 12500,
      status: "En cours",
      date: "2023-10-20",
    },
    {
      id: 6,
      client: "Média Marketing",
      product: "Assurance Cyberrisques",
      amount: 3800,
      status: "Validée",
      date: "2023-10-25",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalVentes: 6,
    chiffreAffaire: 35100,
    validatedVentes: 3,
  });
  const [chartData, setChartData] = useState([
    { month: "Oct", total: 35100 },
  ]);

  useEffect(() => {
    fetchSales();
    fetchStats();
  }, []);

  const fetchSales = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/getall/ventes/manager", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSales(response.data);
        prepareChartData(response.data);
    } catch (error) {
        console.error("Erreur lors de la récupération des ventes", error);
    }
};
  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/sales/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques", error);
    }
  };

  const prepareChartData = (salesData) => {
    const data = salesData.reduce((acc, sale) => {
      const month = new Date(sale.date).toLocaleString("default", { month: "short" });
      if (!acc[month]) {
        acc[month] = { month, total: 0 };
      }
      acc[month].total += sale.amount;
      return acc;
    }, {});
    setChartData(Object.values(data));
  };

  const handleApproveSale = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/approve-sale/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchSales();
    } catch (error) {
      console.error("Erreur lors de la validation de la vente", error);
    }
  };

  const handleRejectSale = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/reject-sale/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchSales();
    } catch (error) {
      console.error("Erreur lors du rejet de la vente", error);
    }
  };

  const filteredSales = sales.filter((sale) =>
    sale.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <h1 className="text-2xl font-bold">Gestion des Ventes</h1>
        <p className="text-gray-600">Suivi des ventes d'assurance et validation des contrats</p>

        {/* Stats Boards */}
        <div className="stats-container grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="stat-card bg-blue-100 p-4 rounded-lg hover:bg-blue-200 transition-colors">
            <h3 className="text-lg font-semibold">Total Ventes</h3>
            <p className="text-2xl font-bold">{stats.totalVentes}</p>
          </div>
          <div className="stat-card bg-green-100 p-4 rounded-lg hover:bg-green-200 transition-colors">
            <h3 className="text-lg font-semibold">Chiffre d'Affaires</h3>
            <p className="text-2xl font-bold">{stats.chiffreAffaire}FCFA</p>
          </div>
          <div className="stat-card bg-yellow-100 p-4 rounded-lg hover:bg-yellow-200 transition-colors">
            <h3 className="text-lg font-semibold">Ventes Validées</h3>
            <p className="text-2xl font-bold">{stats.validatedVentes}</p>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="search-bar flex items-center bg-white p-2 rounded-lg shadow-sm mt-6">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Rechercher une vente..."
            className="input flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tableau des ventes */}
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
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{sale.client}</td>
                  <td className="p-3">{sale.product}</td>
                  <td className="p-3">{sale.amount} FCFA</td>
                  <td className="p-3">
                    <span className={`status-badge ${sale.status}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="p-3 flex space-x-2">
                    <button
                      onClick={() => handleApproveSale(sale.id)}
                      className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRejectSale(sale.id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
          <h2 className="text-lg font-semibold mb-4">Évolution des Ventes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Ventes;