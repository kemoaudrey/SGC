import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import UserManagement from './components/Dashboard/users/UserManagement';
import Statistics from './components/Dashboard/statistics/Statistics';
import ProductManagement from './components/Dashboard/products/ProductManagement';
import SystemSettings from './components/Dashboard/settings/SystemSettings';
import RoleManagement from './components/Dashboard/roles/Rolemanagement';
import CommercialDashboard from './components/Dashboard/CommercialDashboard';
import Prospects from './components/Dashboard/ManagerProspects/Prospects';
import Commerciaux from './components/Dashboard/managercommerciaux/commerciaux'
import ProspectManagement from './components/Dashboard/prospects/ProspectManagement';
import VenteManagement from './components/ventes/VenteManagement';
import Profile from './components/Dashboard/profils/Profile';
// Correct import statement
import ManagerDashboard from './components/Dashboard/ManagerDashboard';
import Ventes from './components/Dashboard/ManagerVentes/Ventes';
import Validation from './components/Dashboard/ManagerValidation/Validation';
function App() {
  return (
    <Router>
          <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/settings" element={<SystemSettings />} />
              <Route path="/roles" element={<RoleManagement />} />
          <Route path="/commercial/dashboard" element={<CommercialDashboard />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/commercials" element={<Commerciaux />} />
          <Route path="/commercial/prospects" element={<ProspectManagement />} />
          <Route path="/manager/prospects" element={<Prospects />} />
          <Route path="/manager/ventes" element={<Ventes />} />
          <Route path="/manager/validation" element={<Validation />} />

          <Route path="/commercial/ventes" element={<VenteManagement />} />
          <Route path="/commercial/profil" element={<Profile />} />
          </Routes>
       
    </Router>
  )
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Sidebar from './components/Dashboard/Sidebar';
// import Header from './components/Dashboard/Header';

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-100">
//         <Sidebar />
//         <div className="ml-64">
//           <Header />
//           <main className="pt-16">
//             <Routes>
//             <Route exact path="/login" element={<Login />} />
//               <Route path="/" element={<AdminDashboard />} />
//               {/* Other routes will be added here */}
//             </Routes>
//           </main>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;
