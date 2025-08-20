import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  Users,
  BarChart3,
  Settings,
  FileText,
  Layout,
  UserCog,
  Package,
  Target,
  TrendingUp,
  User,
} from "lucide-react";
import "../styles/AdminDashboard.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role"); // Récupération du rôle de l'utilisateur

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  // Menu pour l'Admin
  const adminMenu = [
    { icon: Layout, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Gestion Utilisateurs", path: "/users" },
    { icon: Target, label: "Prospects", path: "/prospects" },
    { icon: Package, label: "Produits Assurance", path: "/products" },
    { icon: BarChart3, label: "Statistiques", path: "/statistics" },
    { icon: FileText, label: "Rapports", path: "/reports" },
    { icon: UserCog, label: "Rôles & Permissions", path: "/roles" },
    { icon: Settings, label: "Paramètres", path: "/settings" },
  ];

  // Menu pour le Commercial
  const commercialMenu = [
    { icon: Layout, label: "Dashboard", path: "/commercial/dashboard" },
    { icon: Target, label: "Mes Prospects", path: "/commercial/prospects" },
    { icon: TrendingUp, label: "Ventes Assurance", path: "/commercial/ventes" },
    { icon: User, label: "Mon Profil", path: "/commercial/profil" },
  ];

  // Manager Menu
  const managerMenu = [
    { icon: Layout, label: "Dashboard", path: "/manager/dashboard" },
    { icon: Users, label: "Commerciaux", path: "/manager/commercials" },
    { icon: Target, label: "Prospects", path: "/manager/prospects" },
    { icon: TrendingUp, label: "Ventes", path: "/manager/ventes" },
    { icon: BarChart3, label: "Validation", path: "/manager/validation" },
  ];

  // Sélection du menu en fonction du rôle
  const menuItems = userRole === "admin" ? adminMenu : userRole === "manager" ? managerMenu : commercialMenu;

  return (
    <div className="sidebar">
      <h1>{userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard</h1>
      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 mb-2 rounded-lg transition-colors ${
                isActive ? "active" : ""
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;