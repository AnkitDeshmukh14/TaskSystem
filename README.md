# Task Board System

A full-stack Task Board Management System built using React and Django REST Framework.

## Live Demo

Frontend: https://task-system-o4od.vercel.app/

Backend API: https://tasksystem-backend-al79.onrender.com/api/

## GitHub Repository

https://github.com/AnkitDeshmukh14/TaskSystem

## Tech Stack

### Frontend
- React.js
- Vite
- Axios
- React Router
- Drag and Drop
- jsPDF
- XLSX

### Backend
- Python
- Django
- Django REST Framework
- JWT Authentication
- SQLite
- Cloudinary

## Features

- JWT based authentication
- Admin and User roles
- Create, edit and delete tasks
- Task priority management
- Kanban board
- Drag and drop task status
- Admin controlled vertical task ordering
- Threaded comments and replies
- Comment and task attachments
- Search tasks by name or ID
- Filter by status and priority
- Sort by due date
- Pagination
- PDF export
- Excel export

## Role Permissions

### Admin
- Create tasks
- Edit tasks
- Delete tasks
- Change task status
- Reorder tasks vertically
- Add comments and replies
- Export task data

### User
- View tasks
- Change task status horizontally
- Add comments and replies
- Upload attachments
- Cannot create, edit or delete tasks
- Cannot change vertical task order

## Local Setup

### Backend

```bash
cd Backend/project
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver