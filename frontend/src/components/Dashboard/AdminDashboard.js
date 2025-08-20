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
import {
  Users,
  Target,
  TrendingUp,
  Package,
} from "lucide-react";
import "../styles/AdminDashboard.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import axios from "axios";

const data = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 2000 },
  { name: "Apr", sales: 2780 },
  { name: "May", sales: 1890 },
  { name: "Jun", sales: 2390 },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/statistics", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
    .then(response => {
      console.log("Réponse API :", response.data);

      // Transformer l'objet en tableau exploitable
      const formattedStats = [
        {
          title: "Total Users",
          value: response.data.users || 0,
          change: "+12%",
          icon: Users,
          color: "stat-icon bg-blue-100",
        },
        {
          title: "Active Prospects",
          value: response.data.prospects || 0,
          change: "+23%",
          icon: Target,
          color: "stat-icon bg-green-100",
        },
        {
          title: "Total Sales",
          value: response.data.ventes || 0,
          change: "+15%",
          icon: TrendingUp,
          color: "stat-icon bg-purple-100",
        },
        {
          title: "Products",
          value: response.data.produits
           || 0,
          change: "+3",
          icon: Package,
          color: "stat-icon bg-orange-100",
        },
      ];

      setStats(formattedStats);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des statistiques :", error);
      setStats([]); // Empêche l'erreur d'affichage
    });
  }, []);

  return (
    <div className="admin-container">
      <Sidebar />
      {/* Contenu principal */}
      <div className="admin-content">
        <Header />
        <h1>Dashboard Overview</h1>
        <p>Gérez les utilisateurs, configurez les rôles et accédez aux rapports.</p>

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
            <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="activity-item">
                  <div className="activity-icon">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="activity-text">New user registered</p>
                    <p className="activity-time">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="activities">
            <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
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

export default AdminDashboard;
