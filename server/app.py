from flask import Flask,jsonify
from flask_cors import CORS
from config import Config
from models import db, Category, Tag, Task, TaskTag

from routes.tasks import tasks_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    db.init_app(app)
    with app.app_context():
        db.create_all()

        if Category.query.count() == 0:
            default_categories = ['Personal','Work','Home','Health','Learning','Finance']
            for name in default_categories:
                db.session.add(Category(name=name))
            db.session.commit()
            print("Default categories created.")

    @app.route('/api/categories', methods=['GET'])
    def get_categories():
        categories = Category.query.all()
        return jsonify([{"id": cat.id, "name": cat.name} for cat in categories])
    
    app.register_blueprint(tasks_bp, url_prefix="/api/tasks")
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)

