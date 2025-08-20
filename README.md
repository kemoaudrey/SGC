# SGC (Sales and Prospect Management System)

A full-stack web application for managing sales prospects and customer relationships, built with React and Flask.

## Project Overview

SGC is a comprehensive system that helps businesses manage their sales pipeline, prospects, and user roles effectively. The application features a modern frontend built with React and a robust backend powered by Flask.

## Features

- **User Authentication & Authorization**
  - Role-based access control
  - Secure login system
  - Protected routes based on user roles

- **Prospect Management**
  - Add, edit, and delete prospects
  - Track prospect status
  - Prospect filtering and search capabilities

- **Profile Management**
  - User profile viewing and editing
  - Password management
  - Role-based permissions

- **Sales Management**
  - Track sales opportunities
  - Product management
  - Sales status tracking

## Tech Stack

### Frontend
- React.js
- Axios for API calls
- Lucide React for icons
- CSS for styling
- React Router for navigation

### Backend
- Flask (Python)
- SQLAlchemy for ORM
- Alembic for database migrations
- JWT for authentication

## Project Structure

```
├── 📁 .git/ 🚫 (auto-hidden)
├── 📁 backend/
│   ├── 📄 Pipfile
│   ├── 🔒 Pipfile.lock 🚫 (auto-hidden)
│   ├── 🐍 app.py
│   ├── 🐍 create_db.py
│   ├── 🐍 database.py
│   ├── 🐍 models.py
│   └── 🐍 routes.py
├── 📁 frontend/
│   ├── 📁 public/
│   │   ├── 🖼️ favicon.ico
│   │   ├── 🌐 index.html
│   │   ├── 🖼️ logo192.png
│   │   ├── 🖼️ logo512.png
│   │   ├── 📄 manifest.json
│   │   └── 📄 robots.txt
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 Auth/
│   │   │   │   └── 📄 Login.js
│   │   │   ├── 📁 Dashboard/
│   │   │   │   ├── 📁 ManagerProspects/
│   │   │   │   │   └── 📄 Prospects.js
│   │   │   │   ├── 📁 ManagerValidation/
│   │   │   │   │   └── 📄 Validation.js
│   │   │   │   ├── 📁 ManagerVentes/
│   │   │   │   │   └── 📄 Ventes.js
│   │   │   │   ├── 📁 managercommerciaux/
│   │   │   │   │   └── 📄 commerciaux.js
│   │   │   │   ├── 📁 products/
│   │   │   │   │   └── 📄 ProductManagement.js
│   │   │   │   ├── 📁 profils/
│   │   │   │   │   └── 📄 Profile.js
│   │   │   │   ├── 📁 prospects/
│   │   │   │   │   └── 📄 ProspectManagement.js
│   │   │   │   ├── 📁 roles/
│   │   │   │   │   └── 📄 Rolemanagement.js
│   │   │   │   ├── 📁 settings/
│   │   │   │   │   └── 📄 SystemSettings.js
│   │   │   │   ├── 📁 statistics/
│   │   │   │   │   └── 📄 Statistics.js
│   │   │   │   ├── 📁 users/
│   │   │   │   │   └── 📄 UserManagement.js
│   │   │   │   ├── 📄 AdminDashboard.js
│   │   │   │   ├── 📄 CommercialDashboard.js
│   │   │   │   ├── 📄 Header.js
│   │   │   │   ├── 📄 ManagerDashboard.js
│   │   │   │   └── 📄 Sidebar.js
│   │   │   ├── 📁 pages/
│   │   │   │   ├── 📄 Home.js
│   │   │   │   └── 📄 NotFound.js
│   │   │   ├── 📁 styles/
│   │   │   │   ├── 🎨 AdminDashboard.css
│   │   │   │   ├── 🎨 CommercialDashboard.css
│   │   │   │   ├── 🎨 Commerciaux.css
│   │   │   │   ├── 🎨 Header.css
│   │   │   │   ├── 🎨 Login.css
│   │   │   │   ├── 🎨 ManagerDashboard.css
│   │   │   │   ├── 🎨 ProductManagement.css
│   │   │   │   ├── 🎨 Profile.css
│   │   │   │   ├── 🎨 Prospect.css
│   │   │   │   ├── 🎨 ProspectManagement.css
│   │   │   │   ├── 🎨 RoleManegement.css
│   │   │   │   ├── 🎨 UserManagement.css
│   │   │   │   ├── 🎨 Validation.css
│   │   │   │   ├── 🎨 VenteManagement.css
│   │   │   │   └── 🎨 Ventes.css
│   │   │   ├── 📁 ventes/
│   │   │   │   └── 📄 VenteManagement.js
│   │   │   ├── 📄 PrivateRoutes.js
│   │   │   ├── 📄 RoleManagement.js
│   │   │   └── 📄 UserManagement.js
│   │   ├── 🎨 App.css
│   │   ├── 📄 App.js
│   │   ├── 📄 App.test.js
│   │   ├── 🎨 index.css
│   │   ├── 📄 index.js
│   │   ├── 🖼️ logo.svg
│   │   └── 📄 setupTests.js
│   ├── 📖 README.md
│   ├── 📝 SGC tree file.md
│   └── 📄 package.json
└── 📖 README.md
```

## Getting Started
### Backend Setup
1. Navigate to the backend directory:
```
cd backend
```
2. Install dependencies using Pipenv:
```
pipenv install
```
3. Initialize the database:
```
python create_db.py
```
4. Run the Flask server:
```
flask run
```
### Frontend Setup
1. Navigate to the frontend directory:
```
cd frontend
```
2. Install dependencies:
```
npm install
```
3. Start the development server:
```
npm start
```
The application will be available at http://localhost:3000

## API Endpoints
- /api/profile - User profile management
- /api/add/prospects - Add new prospects
- /api/getall/prospects - Retrieve all prospects
- /api/update/prospects/<id> - Update prospect information
- /api/prospects/<id> - Delete prospect
- /api/roles/<role> - Role management