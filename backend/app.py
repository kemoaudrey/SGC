from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models import db, Role  # Import db from models
import json
from flask_migrate import Migrate
from datetime import timedelta

app = Flask(__name__)

# PostgreSQL Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://postgres:postgres@localhost:5432/sgc_db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # Avoids warning

app.config["JWT_SECRET_KEY"] = "secretkey"

# Initialize extensions
db.init_app(app)  # 🔹 Properly initialize SQLAlchemy
jwt = JWTManager(app)
migrate = Migrate(app, db)
CORS(app)

# Import routes AFTER initializing app to avoid circular imports
import routes

# Create tables inside application context
with app.app_context():
    db.create_all()

    # Create initial roles if they do not exist
    for role_name in ["admin", "manager", "commercial"]:
        role = Role.query.filter_by(name=role_name).first()
        if not role:
            default_permissions = []
            if role_name == "admin":
                default_permissions = ["manage_users", "configure_system", "generate_reports"]
            elif role_name == "manager":
                default_permissions = ["view_team", "approve_sales", "view_reports"]
            elif role_name == "commercial":
                default_permissions = ["manage_prospects", "record_sales"]
            new_role = Role(name=role_name, permissions=json.dumps(default_permissions))
            db.session.add(new_role)
    db.session.commit()

if __name__ == "__main__":
    app.run(debug=True)
