from app import app
from models import db

# Ensure database creation is done within app context
with app.app_context():
    db.create_all()
    print("✅ Database tables created successfully!")
