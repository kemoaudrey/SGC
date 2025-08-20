import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download } from "lucide-react";
import Sidebar from "../Sidebar";
import Header from "../Header";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Statistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les statistiques depuis Flask
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/statistics", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setStatistics(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des statistiques", error);
        setError("Erreur lors de la récupération des données.");
        setLoading(false);
      });
  }, []);

  // Gérer l'exportation du rapport
  const handleExportReport = () => {
    // Simule un export (peut être remplacé par une génération de fichier backend)
    alert("Rapport exporté avec succès !");
  };

  if (loading) return <p className="text-center">Chargement des statistiques...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  // Données des graphiques basées sur l'API
  const salesData = [
    { month: "Jan", sales: statistics.ventes, prospects: statistics.prospects },
    { month: "Feb", sales: statistics.ventes * 0.8, prospects: statistics.prospects * 0.9 },
    { month: "Mar", sales: statistics.ventes * 1.2, prospects: statistics.prospects * 1.1 },
    { month: "Apr", sales: statistics.ventes * 0.9, prospects: statistics.prospects * 1.05 },
    { month: "May", sales: statistics.ventes * 1.1, prospects: statistics.prospects * 0.95 },
    { month: "Jun", sales: statistics.ventes * 1.3, prospects: statistics.prospects * 1.2 },
  ];

  const productData = [
    { name: "Assurances Vie", value: statistics.produits * 0.4 },
    { name: "Assurances Santé", value: statistics.produits * 0.3 },
    { name: "Assurances Auto", value: statistics.produits * 0.2 },
    { name: "Assurances Habitation", value: statistics.produits * 0.1 },
  ];

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <h1 className="text-2xl font-bold">Statistiques & Rapports</h1>
        <button className="btn btn-primary flex items-center" onClick={handleExportReport}>
          <Download className="w-4 h-4 mr-2" />
          Exporter le Rapport
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Ventes vs Prospects</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                  <Line type="monotone" dataKey="prospects" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Répartition des Produits</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Performance Mensuelle</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                  <Bar dataKey="prospects" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
