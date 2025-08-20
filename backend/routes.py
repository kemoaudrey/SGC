from flask import Blueprint, request, jsonify
from models import User, db, Role, Vente, ProductAssurance, Prospect
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import  check_password_hash, generate_password_hash
from app import app, db
from datetime import datetime
from functools import wraps
import json
from flask_jwt_extended import create_refresh_token, jwt_required, get_jwt_identity
from datetime import timedelta
auth_bp = Blueprint("auth", __name__)
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=3)  # Expiration du token en 2 heures

def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user or user.role not in allowed_roles:
                return jsonify({"error": "Accès refusé"}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
@app.route("/api/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token():
    identity = get_jwt_identity()
    new_token = create_access_token(identity=identity)
    return jsonify({"token": new_token})

@app.route("/api/login", methods=["POST"])
def login():
    email = request.json['email']
    password = request.json['password']
    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):  # Remplace par un vrai hashage
        return jsonify({"error": "Identifiants incorrects"}), 401

    # Génération du token JWT
    # access_token = create_access_token(identity={"id": user.id, "role": user.role})
    access_token = create_access_token(identity=str(user.id))  # Convertir en string


    return jsonify({
         'id': user.id,
        "token": access_token,
        "refresh_token": create_refresh_token(identity=user.id),
        "role": user.role
                     })

# Create a new user
@app.route("/api/users", methods=["POST"])
def create_user():
    data = request.json
    nom = data.get("nom")
    email = data.get("email")
    contact = data.get("contact")
    password = data.get("password")
    role = data.get("role")

    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(nom=nom, email=email, contact=contact, password=hashed_password, role=role)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Utilisateur créé avec succès!"}), 201

# Get all users
@app.route("/api/users", methods=["GET"])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([
        {
            "id": u.id,
            "nom": u.nom,
            "email": u.email,
            "contact": u.contact,
            "role": u.role
        } for u in users
    ])

# Update user
@app.route("/api/users/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    data = request.json
    user = User.query.get_or_404(user_id)
    
    user.nom = data.get("nom", user.nom)
    user.email = data.get("email", user.email)
    user.contact = data.get("contact", user.contact)
    user.role = data.get("role", user.role)

    db.session.commit()
    return jsonify({"message": "Utilisateur mis à jour avec succès!"}), 200

# Delete user
@app.route("/api/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Utilisateur supprimé!"}), 200

# Get logged-in user profile
@app.route("/api/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    return jsonify({
        "id": user.id,
        "nom": user.nom,
        "email": user.email,
        "contact": user.contact,
        "role": user.role
    })

# Update profile
@app.route("/api/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    data = request.json
    user.nom = data.get("nom", user.nom)
    user.email = data.get("email", user.email)
    user.contact = data.get("contact", user.contact)

    # Hash password if updated
    if "password" in data and data["password"]:
        user.password = generate_password_hash(data["password"])

    db.session.commit()
    return jsonify({"message": "Profil mis à jour avec succès!"})

@app.route("/api/getall/products", methods=["GET"])
@jwt_required()
def get_products():
    products = ProductAssurance.query.all()
    return jsonify([
        {"id": p.id, "name": p.name, "details": p.details, "category": p.category, "active": p.active}
        for p in products
    ])

@app.route("/api/add/products", methods=["POST"])
@jwt_required()
def add_product():
    try:
        current_user = get_jwt_identity()  # Vérifier l'identité de l'utilisateur
        print(f"User ID from token: {current_user} ({type(current_user)})")  # Debug

        data = request.json
        new_product = ProductAssurance(
            name=data["name"],
            details=data["details"],
            category=data.get("category", "Life"),
            active=data.get("active", True)
        )
        db.session.add(new_product)
        db.session.commit()
        
        return jsonify({"message": "Produit ajouté avec succès!", "id": new_product.id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/products/<int:product_id>", methods=["PUT"])
@jwt_required()
def update_product(product_id):
    product = ProductAssurance.query.get_or_404(product_id)
    data = request.json
    product.name = data.get("name", product.name)
    product.details = data.get("details", product.details)
    product.category = data.get("category", product.category)
    product.active = data.get("active", product.active)
    db.session.commit()
    return jsonify({"message": "Produit mis à jour avec succès!"})

@app.route("/api/delete/products/<int:product_id>", methods=["DELETE"])
@jwt_required()
def delete_product(product_id):
    product = ProductAssurance.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Produit supprimé avec succès!"})

@app.route("/api/add/prospects", methods=["POST"])
@jwt_required()
def add_prospect():
    data = request.json
    current_user_id = get_jwt_identity()

    new_prospect = Prospect(
        name=data["name"],
        email=data["email"],
        contact=data["contact"],
        status="Nouveau",
        commercial_id=current_user_id
    )

    db.session.add(new_prospect)
    db.session.commit()
    return jsonify({"message": "Prospect ajouté avec succès!", "prospect": new_prospect.to_dict()}), 201

@app.route("/api/getall/prospects", methods=["GET"])
@jwt_required()
def get_prospects():
    current_user_id = get_jwt_identity()
    prospects = Prospect.query.filter_by(commercial_id=current_user_id).all()
    return jsonify([prospect.to_dict() for prospect in prospects])

@app.route("/api/update/prospects/<int:prospect_id>", methods=["PUT"])
@jwt_required()
def update_prospect(prospect_id):
    data = request.json
    current_user_id = get_jwt_identity()

    prospect = Prospect.query.filter_by(id=prospect_id, commercial_id=current_user_id).first()
    if not prospect:
        return jsonify({"message": "Prospect non trouvé ou accès refusé"}), 404

    prospect.name = data.get("name", prospect.name)
    prospect.email = data.get("email", prospect.email)
    prospect.contact = data.get("contact", prospect.contact)
    prospect.status = data.get("status", prospect.status)

    db.session.commit()
    return jsonify({"message": "Prospect mis à jour!", "prospect": prospect.to_dict()})

@app.route("/api/prospects/<int:prospect_id>/status", methods=["PATCH"])
@jwt_required()
def update_prospect_status(prospect_id):
    data = request.json
    current_user_id = get_jwt_identity()

    prospect = Prospect.query.filter_by(id=prospect_id, commercial_id=current_user_id).first()
    if not prospect:
        return jsonify({"message": "Prospect non trouvé ou accès refusé"}), 404

    prospect.status = data["status"]
    db.session.commit()
    return jsonify({"message": "Statut mis à jour!", "prospect": prospect.to_dict()})


# 🔹 Ajouter une vente pour un prospect
@app.route("/api/add/vente", methods=["POST"])
@jwt_required()
def add_vente():
    data = request.json
    current_user_id = get_jwt_identity()

    prospect = Prospect.query.filter_by(id=data["prospect_id"], commercial_id=current_user_id).first()
    if not prospect:
        return jsonify({"message": "Prospect non trouvé ou accès refusé"}), 404

    new_vente = Vente(
        prospect_id=data["prospect_id"],
        # prospect_name=data["prospect_name"],

        product_name=data["product_name"],
        amount=data["amount"],
        status="En cours",
        date_vente=datetime.utcnow()
    )

    db.session.add(new_vente)
    db.session.commit()
    return jsonify({"message": "Vente ajoutée avec succès!", "vente": new_vente.to_dict()}), 201


# 🔹 Obtenir les ventes liées aux prospects du commercial
@app.route("/api/getall/ventes", methods=["GET"])
@jwt_required()
def get_ventes():
    current_user_id = get_jwt_identity()

    # Récupérer les prospects appartenant au commercial
    prospects = Prospect.query.filter_by(commercial_id=current_user_id).all()
    prospect_ids = [p.id for p in prospects]
    # prospect_name = [p.name for p in prospects]
    # Récupérer les ventes associées aux prospects du commercial
    ventes = Vente.query.filter(Vente.prospect_id.in_(prospect_ids)).all()

    return jsonify([vente.to_dict() for vente in ventes])


# 🔹 Mettre à jour une vente existante
@app.route("/api/update/vente/<int:vente_id>", methods=["PUT"])
@jwt_required()
def update_vente(vente_id):
    data = request.json
    current_user_id = get_jwt_identity()

    vente = Vente.query.join(Prospect).filter(Vente.id == vente_id, Prospect.commercial_id == current_user_id).first()
    if not vente:
        return jsonify({"message": "Vente non trouvée ou accès refusé"}), 404

    vente.product_name = data.get("product_name", vente.product_name)
    vente.amount = data.get("amount", vente.amount)
    vente.status = data.get("status", vente.status)

    db.session.commit()
    return jsonify({"message": "Vente mise à jour!", "vente": vente.to_dict()})


# 🔹 Supprimer une vente
@app.route("/api/delete/vente/<int:vente_id>", methods=["DELETE"])
@jwt_required()
def delete_vente(vente_id):
    current_user_id = get_jwt_identity()

    vente = Vente.query.join(Prospect).filter(Vente.id == vente_id, Prospect.commercial_id == current_user_id).first()
    if not vente:
        return jsonify({"message": "Vente non trouvée ou accès refusé"}), 404

    db.session.delete(vente)
    db.session.commit()
    return jsonify({"message": "Vente supprimée avec succès!"})

@app.route("/api/statistics", methods=["GET"])
@jwt_required()
def get_statistics():
    nb_users = User.query.count()
    nb_prospects = Prospect.query.count()
    nb_ventes = Vente.query.count()
    nb_produits = ProductAssurance.query.count()
    return jsonify({"users": nb_users, "prospects": nb_prospects, "ventes": nb_ventes, "produits": nb_produits})

@app.route("/api/add/roles", methods=["POST"])
@jwt_required()
def create_role():
    data = request.json
    existing_role = Role.query.filter_by(name=data["name"]).first()
    
    if existing_role:
        return jsonify({"message": "Ce rôle existe déjà!"}), 400  # Erreur 400 si le rôle est déjà présent

    new_role = Role(
        name=data["name"],
        permissions=json.dumps(data.get("permissions", []))
    )
    db.session.add(new_role)
    db.session.commit()
    
    return jsonify({"message": "Rôle ajouté avec succès!", "id": new_role.id}), 201

@app.route("/api/getall/roles", methods=["GET"])
@jwt_required()
def get_roles():
    roles = Role.query.all()
    return jsonify([{"id": r.id, "name": r.name, "permissions": json.loads(r.permissions)} for r in roles])

@app.route("/api/update/roles/<int:role_id>", methods=["PUT"])
@jwt_required()
def update_role_permissions(role_id):
    data = request.json
    role = Role.query.get_or_404(role_id)
    role.permissions = json.dumps(data.get("permissions", []))
    db.session.commit()
    return jsonify({"message": "Permissions mises à jour!"})

@app.route("/api/delete/roles/<int:role_id>", methods=["DELETE"])
@jwt_required()
def delete_role(role_id):
    role = Role.query.get_or_404(role_id)
    db.session.delete(role)
    db.session.commit()
    return jsonify({"message": "Rôle supprimé avec succès!"})

@app.route("/api/reports", methods=["GET"])
@jwt_required()
def generate_reports():
    ventes = Vente.query.all()
    total_revenue = sum([v.amount for v in ventes])
    return jsonify({"total_ventes": len(ventes), "revenu_total": total_revenue})

@app.route("/api/getall/prospects/manager", methods=["GET"])
@jwt_required()
def get_all_prospects_for_manager():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Check if the current user is a manager
    if current_user.role != "manager":
        return jsonify({"message": "Unauthorized access"}), 403

    # Fetch all prospects managed by the manager's team
    team_members = User.query.filter_by(manager_id=current_user_id).all()  # Assuming a manager_id field exists
    team_member_ids = [member.id for member in team_members]

    prospects = Prospect.query.filter(Prospect.commercial_id.in_(team_member_ids)).all()
    prospects_data = []
    for prospect in prospects:
        prospects_data.append({
            "id": prospect.id,
            "name": prospect.name,
            "company": prospect.company,  # Ensure this field exists in the Prospect model
            "status": prospect.status,
            "commercial": prospect.commercial.nom if prospect.commercial else "N/A",  # Ensure this field exists
            "probability": prospect.probability,  # Ensure this field exists
        })
    return jsonify(prospects_data), 200

@app.route("/api/prospects/stats", methods=["GET"])
@jwt_required()
def get_prospect_stats():
    try:
        total_prospects = Prospect.query.count()
        new_prospects_this_week = Prospect.query.filter(
            Prospect.created_at >= datetime.utcnow() - timedelta(days=7)
        ).count()
        conversion_rate = "15%"  # Replace with actual logic

        return jsonify({
            "totalProspects": total_prospects,
            "newProspectsThisWeek": new_prospects_this_week,
            "conversionRate": conversion_rate,
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/manager/dashboard", methods=["GET"])
@jwt_required()
@role_required(['manager', 'admin'])
def manager_dashboard():
    user_id = get_jwt_identity()
    
    # Statistiques équipe
    team_members = User.query.filter_by(manager_id=user_id).all()
    team_ids = [m.id for m in team_members]
    
    stats = {
        "team_size": len(team_members),
        "total_prospects": Prospect.query.filter(Prospect.commercial_id.in_(team_ids)).count(),
        "prospects_converted": Prospect.query.filter(
            Prospect.commercial_id.in_(team_ids), 
            Prospect.status == 'Converti'
        ).count(),
        "pending_approvals": Vente.query.join(Prospect).filter(
            Prospect.commercial_id.in_(team_ids),
            Vente.status == 'En attente'
        ).count()
    }
    
    return jsonify(stats)


@app.route("/api/manager/approve-sale/<int:vente_id>", methods=["POST"])
@jwt_required()
@role_required(['manager', 'admin'])
def approve_sale(vente_id):
    user_id = get_jwt_identity()
    
    vente = Vente.query.join(Prospect).join(User).filter(
        Vente.id == vente_id,
        User.manager_id == user_id
    ).first()
    
    if not vente:
        return jsonify({"error": "Vente non trouvée ou non autorisée"}), 404
    
    data = request.json
    action = data.get('action')  # 'approve' ou 'reject'
    
    if action == 'approve':
        vente.status = 'Approuvée'
        vente.approved_by = user_id
        vente.approved_at = datetime.utcnow()
    elif action == 'reject':
        vente.status = 'Rejetée'
    
    db.session.commit()
    return jsonify({"message": f"Vente {action}ée avec succès"})