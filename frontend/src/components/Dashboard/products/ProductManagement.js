import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, Edit, Trash2, Plus } from "lucide-react";
import "../../styles/ProductManagement.css";
import Sidebar from "../Sidebar";
import Header from "../Header";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newProduct, setNewProduct] = useState({ name: "", details: "", category: "Life", active: true });
  const [editingProduct, setEditingProduct] = useState(null);

  // console.log("Token JWT :", localStorage.getItem("token"));

   // Récupérer les produits depuis le backend
   useEffect(() => {
    axios.get("http://localhost:5000/api/getall/products", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((response) => setProducts(response.data))
    .catch((error) => console.error("Erreur lors de la récupération des produits", error));
  }, []);

  // Filtrer les produits selon la recherche
  const filteredProducts = products.filter((product) =>
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.details.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === "all" || product.category.toLowerCase() === selectedCategory)
  );

  // Ajouter un produit
  const handleAddProduct = () => {
    axios.post("http://localhost:5000/api/add/products", newProduct, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    
    .then((response) => {
      setProducts([...products, { ...newProduct, id: response.data.id }]);
      setNewProduct({ name: "", details: "", category: "Life", active: true });
    })
    .catch((error) => console.error("Erreur lors de l'ajout du produit", error));
  };

// Supprimer un produit
const handleDeleteProduct = (id) => {
  axios.delete(`http://localhost:5000/api/delete/products/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
  .then(() => setProducts(products.filter((product) => product.id !== id)))
  .catch((error) => console.error("Erreur lors de la suppression du produit", error));
};

  // Mettre à jour un produit
  const handleUpdateProduct = () => {
    if (!editingProduct) return;
  
    axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, editingProduct, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(() => {
      setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
      setEditingProduct(null);
    })
    .catch((error) => console.error("Erreur lors de la mise à jour du produit", error));
  };
  

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <h1 className="text-2xl font-bold">Produits d'Assurance</h1>
        
        {/* Formulaire d'ajout */}
        <div className="add-product-form">
          <input
            type="text"
            placeholder="Nom du produit"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
        <input
  type="text"
  placeholder="Description"
  value={newProduct.details}  // Correction ici
  onChange={(e) => setNewProduct({ ...newProduct, details: e.target.value })}
/>

          <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
            <option value="Life">Vie</option>
            <option value="Health">Santé</option>
            <option value="Property">Propriété</option>
            <option value="Vehicle">Véhicule</option>
          </select>
          <button className="btn btn-primary" onClick={handleAddProduct}>
            <Plus className="w-4 h-4 mr-2" /> Ajouter
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className="input max-w-xs" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="all">Toutes les catégories</option>
              <option value="Life">Vie</option>
              <option value="Health">Santé</option>
              <option value="Property">Propriété</option>
              <option value="Vehicle">Véhicule</option>
            </select>
          </div>

           {/* Liste des produits */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <span className="text-sm text-gray-500">{product.category}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => setEditingProduct(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{product.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Modal de mise à jour */}
      {editingProduct && (
    <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
                <h2>Modifier le produit</h2>
                <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
                <input
                    type="text"
                    value={editingProduct.details}
                    onChange={(e) => setEditingProduct({ ...editingProduct, details: e.target.value })}
                />
                <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                >
                    <option value="Life">Vie</option>
                    <option value="Health">Santé</option>
                    <option value="Property">Propriété</option>
                    <option value="Vehicle">Véhicule</option>
                </select>
                <button onClick={handleUpdateProduct} className="btn btn-primary">Mettre à jour</button>
                <button onClick={() => setEditingProduct(null)} className="btn btn-secondary">Annuler</button>
            </div>
        </div>
    </div>
)}

    </div>
  );
};

export default ProductManagement;
 