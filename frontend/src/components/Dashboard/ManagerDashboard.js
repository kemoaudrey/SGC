import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, BarChart3, Target, TrendingUp, FileText } from "lucide-react";
import { BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts"; // Add these imports

import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/ManagerDashboard.css";

const ManagerDashboard = () => {
  const [stats, setStats] = useState([]);
  const [commercials, setCommercials] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchCommercials();
    fetchProspects();
    fetchSales();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/statistics", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques", error);
    }
  };

  const fetchCommercials = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/commercials", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCommercials(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des commerciaux", error);
    }
  };

  const fetchProspects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/prospects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProspects(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des prospects", error);
    }
  };

  const fetchSales = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/sales", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSales(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des ventes", error);
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <h1>Tableau de Bord Manager</h1>
        <p>Supervisez les commerciaux, les prospects et les ventes de votre équipe.</p>

        {/* Statistiques */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="stat-title">Commerciaux</h3>
              <p className="stat-value">{commercials.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-green-100">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="stat-title">Prospects</h3>
              <p className="stat-value">{prospects.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-purple-100">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="stat-title">Ventes</h3>
              <p className="stat-value">{sales.length}</p>
            </div>
          </div>
        </div>

        {/* Liste des commerciaux */}
        <div className="commercials-list">
          <h2>Liste des Commerciaux</h2>
          <ul>
            {commercials.map((commercial) => (
              <li key={commercial.id}>
                <p>{commercial.name}</p>
                <p>{commercial.email}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Graphiques et Activités récentes */}
        <div className="charts-container">
          <div className="activities">
            <h2>Activités Récentes</h2>
            <div className="space-y-4">
              {sales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="activity-item">
                  <p>Vente réalisée par {sale.commercial_name}</p>
                  <p>Montant: {sale.amount} FCFA</p>
                </div>
              ))}
            </div>
          </div>

          <div className="activities">
            <h2>Évolution des Ventes</h2>
            <div className="h-80">
              <BarChart data={sales} width={500} height={300}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#4F46E5" />
              </BarChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;