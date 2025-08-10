from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# Category Table
class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Category {self.name}>'


# Tag Table
class Tag(db.Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    tasks = db.relationship('Task', secondary='task_tags', back_populates='tags')

    def __repr__(self):
        return f'<Tag {self.name}>'


# Task Table
class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)

    # Foreign key to Category
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    category = db.relationship('Category', backref='tasks')

    # Priority stored as string for now
    priority = db.Column(db.String(20), default='medium')  # low, medium, high, urgent

    # Many-to-many tags
    tags = db.relationship('Tag', secondary='task_tags', back_populates='tasks')

    def __repr__(self):
        return f'<Task {self.text}>'


# Junction Table for Many-to-Many between Task and Tag
class TaskTag(db.Model):
    __tablename__ = 'task_tags'
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'), primary_key=True)
