from flask import Blueprint, request, jsonify
from models import db, Task, Category, Tag
from datetime import datetime

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([
        {
            "id": t.id,
            "text": t.text,
            "completed": t.completed,
            "created_at": t.created_at.isoformat(),
            "due_date": t.due_date.isoformat() if t.due_date else None,
            "priority": t.priority,
            "category": {
                "id": t.category.id,
                "name": t.category.name
            }
        }
        for t in tasks
    ])


@tasks_bp.route('/', methods=['POST'])
def create_task():
    data = request.json
    if not data.get("text") or not data.get("category_id"):
        return jsonify({"error": "Task text and category_id are required"}), 400

    task = Task(
        text=data["text"],
        category_id=data["category_id"],
        priority=data.get("priority", "medium"),
        due_date=datetime.fromisoformat(data["due_date"]) if data.get("due_date") else None
    )
    db.session.add(task)
    db.session.commit()

    return jsonify({"message": "Task created", "id": task.id}), 201