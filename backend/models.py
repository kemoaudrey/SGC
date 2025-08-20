from database import db
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    contact = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    manager = db.relationship('User', remote_side=[id], backref='team_members')
    
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    permissions = db.Column(db.Text, nullable=False)  # Stocker les permissions sous forme de chaîne JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
class Prospect(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(150), nullable=True)  # 🔹 AJOUT
    email = db.Column(db.String(100), unique=True, nullable=False)
    contact = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default="Nouveau")
    probability = db.Column(db.Float, default=0.0)  # 🔹 AJOUT (0-100%)
    estimated_value = db.Column(db.Float, nullable=True)  # 🔹 AJOUT
    
    commercial_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    commercial = db.relationship("User", backref="prospects")
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "company": self.company,
            "email": self.email,
            "contact": self.contact,
            "status": self.status,
            "probability": self.probability, 
            "estimated_value": self.estimated_value, 
            "commercial_id": self.commercial_id,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M'),
            "updated_at": self.updated_at.strftime('%Y-%m-%d %H:%M')
        }
class Vente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    prospect_id = db.Column(db.Integer, db.ForeignKey('prospect.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product_assurance.id'), nullable=False)
    
    prospect = db.relationship('Prospect', backref='ventes')
    product = db.relationship('ProductAssurance', backref='ventes')
    
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="En cours")
    
    approved_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    approved_at = db.Column(db.DateTime, nullable=True)
    
    date_vente = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    def to_dict(self):
        return {
            "id": self.id,
            "prospect_id": self.prospect_id,
            "product_id": self.product_id,
            "amount": self.amount,
            "status": self.status,
            "approved_by": self.approved_by,
            "approved_at": self.approved_at,
            "date_vente": self.date_vente.strftime('%Y-%m-%d %H:%M'),
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M')
        }
class ProductAssurance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    details = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False, default="Life")  # Vie, Santé, Propriété, Véhicule
    active = db.Column(db.Boolean, default=True)
class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
class Analytics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    metric_name = db.Column(db.String(100), nullable=False)
    metric_value = db.Column(db.Float, nullable=False)
    period = db.Column(db.String(50), nullable=False)  # daily, weekly, monthly
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)