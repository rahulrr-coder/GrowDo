from flask import Blueprint, request, jsonify
from models import db, Task, Category, Tag
from datetime import datetime

tasks_bp = Blueprint('tasks', __name__)

# GET all tasks
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

#POST

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

#PUT 

@tasks_bp.route('/<int:task_id>',methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.json

    task.text = data.get("text", task.text)
    task.category_id = data.get("category_id", task.category_id)
    task.priority = data.get("priority", task.priority)
    task.due_date = datetime.fromisoformat(data["due_date"]) if data.get("due_date") else task.due_date

    db.session.commit()
    return jsonify({"message": "Task updated"}), 200

# PATCH
@tasks_bp.route('/<int:task_id>/toggle', methods=['PATCH'])
def toggle_task(task_id):
    task = Task.query.get_or_404(task_id)
    task.completed = not task.completed
    db.session.commit()
    return jsonify({"message": "Task status updated", "completed": task.completed}), 200

#Delete 
@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"}), 200

