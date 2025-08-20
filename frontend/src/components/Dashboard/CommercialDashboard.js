import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, FileText, TrendingUp, User } from "lucide-react";
import "../styles/CommercialDashboard.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import axios from "axios";

const CommercialDashboard = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/statistics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("Réponse API :", response.data);

        const formattedStats = [
          {
            title: "Total Prospects",
            value: response.data.prospects || 0,
            change: "+10%",
            icon: Users,
            color: "stat-icon bg-blue-100",
          },
          {
            title: "Total Sales",
            value: response.data.ventes || 0,
            change: "+20%",
            icon: TrendingUp,
            color: "stat-icon bg-green-100",
          },
          {
            title: "Profile Updates",
            value: "Modifier",
            change: "",
            icon: User,
            color: "stat-icon bg-orange-100",
            action: "/profile",
          },
          {
            title: "Sales Reports",
            value: "Exporter",
            change: "",
            icon: FileText,
            color: "stat-icon bg-purple-100",
            action: "/reports",
          },
        ];

        setStats(formattedStats);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des statistiques :", error);
        setStats([]);
      });
  }, []);

  
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <h1>Tableau de Bord Commercial</h1>
        <p>Gérez vos prospects, vos ventes et votre profil.</p>

        {/* Statistiques */}
        <div className="stats-container">
          {stats.length > 0 ? (
            stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className={stat.color}>
                  <stat.icon className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="stat-title">{stat.title}</h3>
                  <p className="stat-value">{stat.value}</p>
                  <span className="text-green-500 text-sm font-medium">
                    {stat.change}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>Aucune statistique disponible.</p>
          )}
        </div>

        {/* Graphiques et Activités récentes */}
        <div className="charts-container">
          <div className="activities">
            <h2 className="text-lg font-semibold mb-4">Activités Récentes</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="activity-item">
                  <div className="activity-icon">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="activity-text">Nouveau prospect ajouté</p>
                    <p className="activity-time">1 heure ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="activities">
            <h2 className="text-lg font-semibold mb-4">Évolution des Ventes</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: "Jan", sales: 5 }, { name: "Feb", sales: 8 }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialDashboard;
