from database import db
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    contact = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    permissions = db.Column(db.Text, nullable=False)  # Stocker les permissions sous forme de chaîne JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Prospect(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    contact = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default="Nouveau")  # États possibles: Nouveau, En cours, Converti
    
    # Relationship with the User model (commercial)
    commercial_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    commercial = db.relationship("User", backref="prospects")  # Relationship to access the associated commercial
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "contact": self.contact,
            "status": self.status,
            # "company": self.company,  # Include company in the dictionary
            # "probability": self.probability,  # Include probability in the dictionary
            "commercial_id": self.commercial_id,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M')
        }

class Vente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    prospect_id = db.Column(db.Integer, db.ForeignKey('prospect.id'), nullable=False)
    product_name = db.Column(db.String(150), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="En cours")  # États possibles : En cours, Finalisée, Annulée
    date_vente = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "prospect_id": self.prospect_id,
            "product_name": self.product_name,
            "amount": self.amount,
            "status": self.status,
            "date_vente": self.date_vente.strftime('%Y-%m-%d %H:%M')
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