import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import "../../styles/Prospect.css";
import Sidebar from "../Sidebar";
import Header from "../Header";

const Prospects = () => {
  const [prospects, setProspects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalProspects: 0,
    newProspectsThisWeek: 0,
    conversionRate: "0%",
  });
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetchUserRole();
    fetchStats();
  }, []);

  const fetchUserRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("User Role from Token:", payload.role); // Debugging
      setUserRole(payload.role);
      fetchProspects(payload.role);
    }
  };

  const transformProspects = (prospects, role) => {
    console.log("Transforming prospects for role:", role); // Debugging
    if (role === "manager") {
      return prospects.map((prospect) => ({
        id: prospect.id,
        name: prospect.name || "N/A",
        company: prospect.company || "N/A",
        status: prospect.status || "N/A",
        commercial: prospect.commercial || "N/A",
        probability: prospect.probability || 0,
      }));
    } else {
      return prospects.map((prospect) => ({
        id: prospect.id,
        name: prospect.name || "N/A",
        email: prospect.email || "N/A",
        contact: prospect.contact || "N/A",
        status: prospect.status || "N/A",
        action: "Edit",
      }));
    }
  };

  const fetchProspects = async (role) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Redirecting to login...");
        return;
      }

      const endpoint =
        role === "manager"
          ? "http://localhost:5000/api/getall/prospects/manager"
          : "http://localhost:5000/api/getall/prospects";

      console.log("Fetching prospects from endpoint:", endpoint); // Debugging

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data); // Debugging

      const transformedProspects = transformProspects(response.data, role);
      console.log("Transformed Prospects:", transformedProspects); // Debugging

      setProspects(transformedProspects);
    } catch (error) {
      console.error("Erreur lors de la récupération des prospects", error);
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized. Redirecting to login...");
      }
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Redirecting to login...");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/prospects/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Stats API Response:", response.data); // Debugging
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques", error);
      if (error.response && error.response.status === 404) {
        console.error("Stats endpoint not found. Check backend implementation.");
      }
    }
  };

  const filteredProspects = prospects.filter((prospect) =>
    prospect.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <h1 className="text-2xl font-bold">Gestion des Prospects</h1>
        <p className="text-gray-600">Supervision des prospects et analyse des performances commerciales</p>

        {/* Stats Bars */}
        <div className="stats-container grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="stat-card bg-blue-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Total Prospects</h3>
            <p className="text-2xl font-bold">{stats.totalProspects}</p>
          </div>
          <div className="stat-card bg-green-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Nouveaux Prospects (Cette Semaine)</h3>
            <p className="text-2xl font-bold">{stats.newProspectsThisWeek}</p>
          </div>
          <div className="stat-card bg-yellow-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Taux de Conversion</h3>
            <p className="text-2xl font-bold">{stats.conversionRate}</p>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="search-bar flex items-center bg-white p-2 rounded-lg shadow-sm mt-6">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Rechercher un prospect..."
            className="input flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tableau des prospects */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Nom</th>
                {userRole === "manager" ? (
                  <>
                    <th className="p-3 text-left">Entreprise</th>
                    <th className="p-3 text-left">Commercial</th>
                    <th className="p-3 text-left">Probabilité</th>
                  </>
                ) : (
                  <>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Contact</th>
                  </>
                )}
                <th className="p-3 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredProspects.map((prospect) => (
                <tr key={prospect.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{prospect.name}</td>
                  {userRole === "manager" ? (
                    <>
                      <td className="p-3">{prospect.company}</td>
                      <td className="p-3">{prospect.commercial}</td>
                      <td className="p-3">{prospect.probability}%</td>
                    </>
                  ) : (
                    <>
                      <td className="p-3">{prospect.email}</td>
                      <td className="p-3">{prospect.contact}</td>
                    </>
                  )}
                  <td className="p-3">
                    <span className={`status-badge ${prospect.status}`}>
                      {prospect.status}
                    </span>
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

export default Prospects;